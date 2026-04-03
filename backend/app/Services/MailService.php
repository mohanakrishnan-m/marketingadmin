<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

class MailService
{
    private PHPMailer $mailer;
    private string $fromAddress;
    private string $fromName;
    private ?string $replyTo;

    /**
     * Build a configured PHPMailer instance from user DB settings,
     * falling back to .env values if settings are not configured.
     */
    public function __construct(User $user)
    {
        $settings = $user->settings;

        // Resolve SMTP credentials: DB settings take priority over .env
        $host     = ($settings?->smtp_host)     ?: env('MAIL_HOST', '127.0.0.1');
        $port     = (int)(($settings?->smtp_port) ?: env('MAIL_PORT', 587));
        $username = ($settings?->smtp_username)  ?: env('MAIL_USERNAME');
        $password = null;

        if ($settings?->smtp_password_encrypted) {
            try {
                $password = Crypt::decryptString($settings->smtp_password_encrypted);
            } catch (\Throwable $e) {
                Log::warning('MailService: could not decrypt SMTP password for user '.$user->id.': '.$e->getMessage());
            }
        }

        if (! $password) {
            $password = env('MAIL_PASSWORD');
        }

        $this->fromAddress = ($settings?->sender_email) ?: env('MAIL_FROM_ADDRESS', 'subratsethi@risingiceberg.com');
        $this->fromName    = ($settings?->sender_name)  ?: env('MAIL_FROM_NAME', config('app.name'));
        $this->replyTo     = $settings?->reply_to ?: null;

        $mailer = new PHPMailer(true);
        $mailer->isSMTP();
        $mailer->Host    = $host;
        $mailer->Port    = $port;
        $mailer->CharSet = PHPMailer::CHARSET_UTF8;

        // Port 465 = implicit SSL (SMTPS) — connect wrapped in SSL from the start
        // Port 587 / 25 = STARTTLS — negotiate TLS after plaintext greeting
        // Any other port = try STARTTLS, fall back to plain
        if ($port === 465) {
            $mailer->SMTPSecure  = PHPMailer::ENCRYPTION_SMTPS;   // SSL
            $mailer->SMTPAutoTLS = false;
        } elseif ($port === 587 || $port === 2525) {
            $mailer->SMTPSecure  = PHPMailer::ENCRYPTION_STARTTLS; // STARTTLS
            $mailer->SMTPAutoTLS = false;
        } else {
            // Let PHPMailer auto-detect
            $mailer->SMTPSecure  = '';
            $mailer->SMTPAutoTLS = true;
        }

        if ($username && $password) {
            $mailer->SMTPAuth = true;
            $mailer->Username = $username;
            $mailer->Password = $password;
        } else {
            $mailer->SMTPAuth = false;
        }

        $this->mailer = $mailer;
    }

    /**
     * Send an HTML email to a single recipient.
     *
     * @throws PHPMailerException
     */
    public function send(
        string $toEmail,
        string $toName,
        string $subject,
        string $htmlBody,
        ?string $footerText = null,
        ?string $trackingPixelUrl = null
    ): void
    {
        $mailer = clone $this->mailer;

        $mailer->clearAddresses();
        $mailer->clearReplyTos();

        $mailer->setFrom($this->fromAddress, $this->fromName);
        $mailer->addAddress($toEmail, $toName);

        if ($this->replyTo) {
            $mailer->addReplyTo($this->replyTo);
        }

        $mailer->isHTML(true);
        $mailer->Subject = $subject;
        $mailer->Body    = $this->wrapHtml($subject, $htmlBody, $footerText, $trackingPixelUrl);
        $mailer->AltBody = strip_tags($htmlBody);

        $mailer->send();
    }

    /**
     * Send a plain test email (used by the test-mail endpoint).
     *
     * @throws PHPMailerException
     */
    public function sendTest(string $toEmail, string $toName = 'Developer'): void
    {
        $this->send(
            $toEmail,
            $toName,
            'Test Email — Iceberg Marketing Portal',
            '<h2 style="font-family:Arial,sans-serif;color:#1e293b;">Mail is working! ✅</h2>'
            . '<p style="font-family:Arial,sans-serif;color:#475569;">This is a test email from the <strong>Iceberg Marketing Portal</strong>.</p>'
            . '<p style="font-family:Arial,sans-serif;color:#94a3b8;font-size:12px;">Sent at: ' . now()->toDateTimeString() . '</p>',
            null
        );
    }

    private function wrapHtml(string $subject, string $html, ?string $footerText, ?string $trackingPixelUrl = null): string
    {
        $footer = $footerText
            ? '<div style="margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px;">' . htmlspecialchars($footerText, ENT_QUOTES) . '</div>'
            : '';
        $trackingPixel = $trackingPixelUrl
            ? '<img src="' . htmlspecialchars($trackingPixelUrl, ENT_QUOTES) . '" width="1" height="1" style="display:block;width:1px;height:1px;border:0;opacity:0;" alt="" />'
            : '';

        if (preg_match('/<html[\s>]/i', $html)) {
            return preg_replace('/<\/body>/i', $footer . $trackingPixel . '</body>', $html, 1) ?: ($html . $footer . $trackingPixel);
        }

        return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{$subject}</title>
</head>
<body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;">
  {$html}
  {$footer}
  {$trackingPixel}
</body>
</html>
HTML;
    }
}
