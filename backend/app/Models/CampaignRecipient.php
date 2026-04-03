<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CampaignRecipient extends Model
{
    protected $fillable = [
        'campaign_id',
        'client_id',
        'tracking_token',
        'opened',
        'opened_at',
        'sent_at',
    ];

    protected $casts = [
        'opened' => 'boolean',
        'opened_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}
