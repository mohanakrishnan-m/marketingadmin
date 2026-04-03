<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'user_id',
        'sender_name',
        'sender_email',
        'reply_to',
        'smtp_host',
        'smtp_port',
        'smtp_username',
        'smtp_password_encrypted',
        'footer_text',
        'notif_campaign_sent',
        'notif_client_added',
        'notif_open_rate_alert',
        'notif_weekly_report',
        'notif_system_alerts',
        'two_factor',
        'session_timeout',
        'login_alerts',
    ];

    protected $casts = [
        'notif_campaign_sent' => 'boolean',
        'notif_client_added' => 'boolean',
        'notif_open_rate_alert' => 'boolean',
        'notif_weekly_report' => 'boolean',
        'notif_system_alerts' => 'boolean',
        'two_factor' => 'boolean',
        'login_alerts' => 'boolean',
    ];

    protected $hidden = [
        'smtp_password_encrypted',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
