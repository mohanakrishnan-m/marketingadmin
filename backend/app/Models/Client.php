<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'business_name',
        'contact_name',
        'whatsapp',
        'email',
        'category',
    ];

    protected $casts = [
        'category' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function campaignRecipients()
    {
        return $this->hasMany(CampaignRecipient::class);
    }
}
