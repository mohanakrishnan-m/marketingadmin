<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;

class SettingController extends Controller
{
    public function show(Request $request)
    {
        $user     = $request->user();
        $settings = $user->settings ?? Setting::create(['user_id' => $user->id]);

        return response()->json($this->formatSettings($user, $settings));
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'profile'                       => 'sometimes|array',
            'profile.name'                  => 'sometimes|string|max:100',
            'profile.email'                 => 'sometimes|email|max:150',
            'profile.company'               => 'sometimes|string|max:200',
            'profile.phone'                 => 'sometimes|string|max:30',
            'profile.timezone'              => 'sometimes|string|max:80',
            'emailConfig'                   => 'sometimes|array',
            'emailConfig.senderName'        => 'sometimes|string|max:100',
            'emailConfig.senderEmail'       => 'sometimes|email|max:150',
            'emailConfig.replyTo'           => 'sometimes|email|max:150',
            'emailConfig.smtpHost'          => 'sometimes|string|max:200',
            'emailConfig.smtpPort'          => 'sometimes|integer|min:1|max:65535',
            'emailConfig.smtpUsername'      => 'sometimes|string|max:200',
            'emailConfig.smtpPassword'      => 'sometimes|string|max:500',
            'emailConfig.footerText'        => 'sometimes|string|max:500',
            'notifs'                        => 'sometimes|array',
            'notifs.campaignSent'           => 'sometimes|boolean',
            'notifs.clientAdded'            => 'sometimes|boolean',
            'notifs.openRateAlert'          => 'sometimes|boolean',
            'notifs.weeklyReport'           => 'sometimes|boolean',
            'notifs.systemAlerts'           => 'sometimes|boolean',
            'security'                      => 'sometimes|array',
            'security.twoFactor'            => 'sometimes|boolean',
            'security.sessionTimeout'       => 'sometimes|integer|min:5|max:1440',
            'security.loginAlerts'          => 'sometimes|boolean',
            'security.currentPassword'      => 'sometimes|string',
            'security.newPassword'          => 'sometimes|string|min:6',
        ]);

        // Update profile fields on user
        if (isset($data['profile'])) {
            $profileUpdate = array_filter([
                'name'     => $data['profile']['name'] ?? null,
                'company'  => $data['profile']['company'] ?? null,
                'phone'    => $data['profile']['phone'] ?? null,
                'timezone' => $data['profile']['timezone'] ?? null,
            ], fn($v) => $v !== null);

            if (isset($data['profile']['email']) && $data['profile']['email'] !== $user->email) {
                $profileUpdate['email'] = $data['profile']['email'];
            }

            if (! empty($profileUpdate)) {
                $user->update($profileUpdate);
            }
        }

        // Update password if provided
        if (isset($data['security']['currentPassword']) && isset($data['security']['newPassword'])) {
            if (! Hash::check($data['security']['currentPassword'], $user->password)) {
                return response()->json(['message' => 'Current password is incorrect'], 422);
            }
            $user->update(['password' => Hash::make($data['security']['newPassword'])]);
        }

        // Upsert settings row
        $settings = $user->settings ?? Setting::create(['user_id' => $user->id]);

        $settingsUpdate = [];

        if (isset($data['emailConfig'])) {
            $ec = $data['emailConfig'];
            if (isset($ec['senderName']))   $settingsUpdate['sender_name']   = $ec['senderName'];
            if (isset($ec['senderEmail']))  $settingsUpdate['sender_email']  = $ec['senderEmail'];
            if (isset($ec['replyTo']))      $settingsUpdate['reply_to']      = $ec['replyTo'];
            if (isset($ec['smtpHost']))     $settingsUpdate['smtp_host']     = $ec['smtpHost'];
            if (isset($ec['smtpPort']))     $settingsUpdate['smtp_port']     = $ec['smtpPort'];
            if (isset($ec['smtpUsername'])) $settingsUpdate['smtp_username'] = $ec['smtpUsername'];
            if (isset($ec['smtpPassword'])) $settingsUpdate['smtp_password_encrypted'] = Crypt::encryptString($ec['smtpPassword']);
            if (isset($ec['footerText']))   $settingsUpdate['footer_text']   = $ec['footerText'];
        }

        if (isset($data['notifs'])) {
            $n = $data['notifs'];
            if (isset($n['campaignSent']))    $settingsUpdate['notif_campaign_sent']    = $n['campaignSent'];
            if (isset($n['clientAdded']))     $settingsUpdate['notif_client_added']     = $n['clientAdded'];
            if (isset($n['openRateAlert']))   $settingsUpdate['notif_open_rate_alert']  = $n['openRateAlert'];
            if (isset($n['weeklyReport']))    $settingsUpdate['notif_weekly_report']    = $n['weeklyReport'];
            if (isset($n['systemAlerts']))    $settingsUpdate['notif_system_alerts']    = $n['systemAlerts'];
        }

        if (isset($data['security'])) {
            $s = $data['security'];
            if (isset($s['twoFactor']))      $settingsUpdate['two_factor']      = $s['twoFactor'];
            if (isset($s['sessionTimeout'])) $settingsUpdate['session_timeout'] = $s['sessionTimeout'];
            if (isset($s['loginAlerts']))    $settingsUpdate['login_alerts']    = $s['loginAlerts'];
        }

        if (! empty($settingsUpdate)) {
            $settings->update($settingsUpdate);
        }

        $user->refresh();
        $settings->refresh();

        return response()->json($this->formatSettings($user, $settings));
    }

    private function formatSettings($user, $settings): array
    {
        return [
            'profile' => [
                'name'     => $user->name,
                'email'    => $user->email,
                'company'  => $user->company ?? '',
                'phone'    => $user->phone ?? '',
                'timezone' => $user->timezone ?? 'Asia/Kolkata',
            ],
            'emailConfig' => [
                'senderName'  => $settings->sender_name ?? 'Iceberg Marketing',
                'senderEmail' => $settings->sender_email ?? 'noreply@iceberg.io',
                'replyTo'     => $settings->reply_to ?? 'support@iceberg.io',
                'smtpHost'    => $settings->smtp_host ?? '',
                'smtpPort'    => $settings->smtp_port ?? 587,
                'smtpUsername'=> $settings->smtp_username ?? '',
                'footerText'  => $settings->footer_text ?? '',
            ],
            'notifs' => [
                'campaignSent'   => (bool) $settings->notif_campaign_sent,
                'clientAdded'    => (bool) $settings->notif_client_added,
                'openRateAlert'  => (bool) $settings->notif_open_rate_alert,
                'weeklyReport'   => (bool) $settings->notif_weekly_report,
                'systemAlerts'   => (bool) $settings->notif_system_alerts,
            ],
            'security' => [
                'twoFactor'      => (bool) $settings->two_factor,
                'sessionTimeout' => (string) ($settings->session_timeout ?? 60),
                'loginAlerts'    => (bool) $settings->login_alerts,
            ],
        ];
    }
}
