<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\SMTP;

class TestMailController extends Controller
{
    /**
     * POST /api/mail/test
     * Body: { "to": "someone@example.com" }  (optional, defaults to developer.iceberg@gmail.com)
     */
    public function send(Request $request)
    {
        $data = $request->validate([
            'to' => 'nullable|email',
        ]);

        $toEmail = $data['to'] ?? 'developer.iceberg@gmail.com';
        $user    = $request->user();

        try {
            $mailService = new MailService($user);
            $mailService->sendTest($toEmail);

            Log::info("Test mail sent to {$toEmail} by user {$user->id}");

            return response()->json([
                'message' => "Test email delivered to {$toEmail} successfully.",
            ]);
        } catch (\Throwable $e) {
            Log::error("Test mail failed for user {$user->id}: " . $e->getMessage());

            return response()->json([
                'message' => 'Mail delivery failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/mail/debug
     * Returns SMTP connection debug info (dev only)
     */
    public function debug(Request $request)
    {
        if (app()->environment('production')) {
            return response()->json(['message' => 'Not available in production'], 403);
        }

        $user     = $request->user();
        $settings = $user->settings;

        $output = [];

        // Build a PHPMailer instance with debug output captured
        try {
            $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
            $mailer->isSMTP();
            $mailer->SMTPDebug  = SMTP::DEBUG_SERVER;
            $mailer->Debugoutput = function ($str, $level) use (&$output) {
                $output[] = trim($str);
            };

            $mailer->Host       = ($settings?->smtp_host)     ?: env('MAIL_HOST', '127.0.0.1');
            $mailer->Port       = (int)(($settings?->smtp_port) ?: env('MAIL_PORT', 587));
            $mailer->SMTPSecure = $mailer->Port === 465
                ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
                : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;

            $username = ($settings?->smtp_username) ?: env('MAIL_USERNAME');
            $password = null;
            if ($settings?->smtp_password_encrypted) {
                try {
                    $password = \Illuminate\Support\Facades\Crypt::decryptString($settings->smtp_password_encrypted);
                } catch (\Throwable $e) {
                    $output[] = 'WARN: could not decrypt password: ' . $e->getMessage();
                }
            }
            if (! $password) $password = env('MAIL_PASSWORD');

            if ($username && $password) {
                $mailer->SMTPAuth = true;
                $mailer->Username = $username;
                $mailer->Password = $password;
            }

            $connected = $mailer->smtpConnect();

            return response()->json([
                'connected'   => $connected,
                'host'        => $mailer->Host,
                'port'        => $mailer->Port,
                'auth'        => $mailer->SMTPAuth,
                'username'    => $mailer->Username,
                'encryption'  => $mailer->SMTPSecure,
                'debug_lines' => $output,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'connected'   => false,
                'error'       => $e->getMessage(),
                'debug_lines' => $output,
            ], 500);
        }
    }
}
