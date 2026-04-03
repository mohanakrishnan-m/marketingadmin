<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        $clientCount   = $user->clients()->count();
        $templateCount = $user->emailTemplates()->count();

        $campaigns       = $user->campaigns()->get();
        $sentCampaigns   = $campaigns->where('status', 'Sent');
        $scheduledCount  = $campaigns->where('status', 'Scheduled')->count();

        $totalSent   = $sentCampaigns->sum('sent');
        $totalOpened = $sentCampaigns->sum('opened');
        $openRate    = $totalSent > 0 ? round(($totalOpened / $totalSent) * 100, 1) : 0;

        $recentClients = $user->clients()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'           => $c->id,
                'businessName' => $c->business_name,
                'contactName'  => $c->contact_name,
                'email'        => $c->email,
                'whatsapp'     => $c->whatsapp,
                'category'     => $c->category ?? [],
            ]);

        $recentCampaigns = $user->campaigns()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($c) => [
                'id'         => $c->id,
                'name'       => $c->name,
                'template'   => $c->template_name ?? '',
                'recipients' => $c->recipients,
                'sent'       => $c->sent,
                'opened'     => $c->opened,
                'status'     => $c->status,
                'sentAt'     => $c->sent_at ? $c->sent_at->format('Y-m-d H:i') : null,
            ]);

        return response()->json([
            'clientCount'    => $clientCount,
            'templateCount'  => $templateCount,
            'totalSent'      => $totalSent,
            'totalOpened'    => $totalOpened,
            'openRate'       => $openRate,
            'scheduledCount' => $scheduledCount,
            'recentClients'  => $recentClients,
            'recentCampaigns'=> $recentCampaigns,
        ]);
    }
}
