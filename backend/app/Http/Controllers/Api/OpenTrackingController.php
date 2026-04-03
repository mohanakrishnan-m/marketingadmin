<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CampaignRecipient;
use Illuminate\Http\Request;

class OpenTrackingController extends Controller
{
    public function __invoke(string $token)
    {
        $recipient = CampaignRecipient::with('campaign')->where('tracking_token', $token)->first();

        if ($recipient && ! $recipient->opened) {
            $recipient->update([
                'opened' => true,
                'opened_at' => now(),
            ]);

            $campaign = $recipient->campaign;

            if ($campaign) {
                $campaign->update([
                    'opened' => $campaign->recipients()->where('opened', true)->count(),
                ]);
            }
        }

        return response(base64_decode('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='), 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
}
