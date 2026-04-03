<?php

namespace Database\Seeders;

use App\Models\Campaign;
use App\Models\CampaignRecipient;
use App\Models\Client;
use App\Models\EmailTemplate;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => 'admin@iceberg.io'],
            [
                'name' => 'Admin User',
                'company' => 'Iceberg Marketing',
                'phone' => '+91 98200 00000',
                'timezone' => 'Asia/Kolkata',
                'password' => Hash::make('admin123'),
            ]
        );

        Setting::updateOrCreate(
            ['user_id' => $user->id],
            [
                'sender_name' => 'Iceberg Marketing',
                'sender_email' => 'noreply@iceberg.io',
                'reply_to' => 'support@iceberg.io',
                'smtp_host' => '127.0.0.1',
                'smtp_port' => 587,
                'footer_text' => 'Iceberg Marketing Portal 2026. All rights reserved.',
                'notif_campaign_sent' => true,
                'notif_client_added' => true,
                'notif_open_rate_alert' => false,
                'notif_weekly_report' => true,
                'notif_system_alerts' => true,
                'two_factor' => false,
                'session_timeout' => 60,
                'login_alerts' => true,
            ]
        );

        $clients = collect([
            ['business_name' => 'Nova Retail Co.', 'contact_name' => 'Arjun Mehta', 'whatsapp' => '919820011234', 'email' => 'arjun@novaretail.com', 'category' => ['Retail']],
            ['business_name' => 'BlueWave Tech', 'contact_name' => 'Priya Sharma', 'whatsapp' => '919876543210', 'email' => 'priya@bluewave.io', 'category' => ['Technology']],
            ['business_name' => 'Green Earth Foods', 'contact_name' => 'Rahul Verma', 'whatsapp' => '919765432101', 'email' => 'rahul@greenearthfoods.in', 'category' => ['Food & Beverage']],
            ['business_name' => 'Pinnacle Finance', 'contact_name' => 'Sneha Joshi', 'whatsapp' => '919654321098', 'email' => 'sneha@pinnaclefin.com', 'category' => ['Finance']],
            ['business_name' => 'Urban Style Studio', 'contact_name' => 'Kunal Das', 'whatsapp' => '919543210987', 'email' => 'kunal@urbanstyle.co', 'category' => ['Fashion']],
            ['business_name' => 'MediCare Plus', 'contact_name' => 'Anita Nair', 'whatsapp' => '919432109876', 'email' => 'anita@medicareplus.in', 'category' => ['Healthcare']],
            ['business_name' => 'Horizon Logistics', 'contact_name' => 'Vikram Rao', 'whatsapp' => '919321098765', 'email' => 'vikram@horizonlog.com', 'category' => ['Logistics']],
            ['business_name' => 'Sparkle Jewels', 'contact_name' => 'Meera Patel', 'whatsapp' => '919210987654', 'email' => 'meera@sparklejewels.in', 'category' => ['Retail']],
        ])->map(function (array $client) use ($user) {
            return Client::updateOrCreate(
                ['user_id' => $user->id, 'email' => $client['email']],
                $client
            );
        })->values();

        $templates = collect([
            [
                'name' => 'Client Welcome Series',
                'subject' => 'Welcome to the next growth sprint, {{name}}',
                'content' => '<p>Hi <strong>{{name}}</strong>,</p><p>Thanks for joining us from <strong>{{company}}</strong>. Your account is ready, and our team has already prepared the first campaign checklist for your brand.</p><p>Here is what happens next:</p><ul><li>We review your audience segments and active offers</li><li>We align a launch calendar for email and WhatsApp follow-up</li><li>We share the first campaign draft for approval</li></ul><p>If you want to fast-track the rollout, simply reply with your next promotion window and hero product.</p><p>Regards,<br/>Iceberg Client Success</p>',
            ],
            [
                'name' => 'Monthly Product Spotlight',
                'subject' => 'April campaign highlights for {{company}}',
                'content' => '<p>Hello <strong>{{name}}</strong>,</p><p>We have packaged this month\'s strongest marketing updates for <strong>{{company}}</strong>.</p><ul><li>Top-performing email subject line from the last 30 days</li><li>Best offer window for weekend conversions</li><li>Recommended resend audience for non-openers</li></ul><p>Reply if you want this version adapted for a regional launch or product-specific push.</p><p>Warm regards,<br/>Iceberg Campaign Team</p>',
            ],
            [
                'name' => 'Limited-Time Offer Push',
                'subject' => '48-hour promotion for {{company}}',
                'content' => '<p>Hi <strong>{{name}}</strong>,</p><p>We have created a short-window promotional email for <strong>{{company}}</strong> designed to lift conversions fast.</p><p>Featured message:</p><ul><li>Offer expires in 48 hours</li><li>Primary call to action drives traffic to the featured collection</li><li>Follow-up resend can target non-openers after 24 hours</li></ul><p>If needed, we can localize the copy for festive sales, new arrivals, or clearance events.</p><p>Best,<br/>Performance Marketing Desk</p>',
            ],
            [
                'name' => 'Lead Nurture Follow-Up',
                'subject' => 'Following up on the next campaign for {{company}}',
                'content' => '<p>Hi <strong>{{name}}</strong>,</p><p>I wanted to circle back on the campaign plan we discussed for <strong>{{company}}</strong>.</p><p>We can help you move forward with:</p><ul><li>Audience cleanup before the next email drop</li><li>Template refinement for higher open rates</li><li>Scheduling a resend strategy for warm leads</li></ul><p>Share a suitable time this week and we will prepare the next rollout draft before the call.</p><p>Regards,<br/>Growth Partnerships Team</p>',
            ],
        ])->map(function (array $template) use ($user) {
            return EmailTemplate::updateOrCreate(
                ['user_id' => $user->id, 'name' => $template['name']],
                $template
            );
        })->keyBy('name');

        $campaigns = [
            ['name' => 'April Welcome Campaign', 'template' => 'Client Welcome Series', 'recipients' => 4, 'sent' => 4, 'opened' => 3, 'status' => 'Sent', 'sent_at' => now()->subDays(2)->setTime(9, 30)],
            ['name' => 'March Newsletter Blast', 'template' => 'Monthly Product Spotlight', 'recipients' => 6, 'sent' => 6, 'opened' => 4, 'status' => 'Sent', 'sent_at' => now()->subDays(6)->setTime(11, 0)],
            ['name' => 'Spring Promo Drive', 'template' => 'Limited-Time Offer Push', 'recipients' => 5, 'sent' => 5, 'opened' => 3, 'status' => 'Sent', 'sent_at' => now()->subDays(12)->setTime(14, 15)],
            ['name' => 'Product Launch Teaser', 'template' => 'Limited-Time Offer Push', 'recipients' => 8, 'sent' => 0, 'opened' => 0, 'status' => 'Scheduled', 'scheduled_at' => now()->addDays(7)->setTime(9, 0)],
        ];

        foreach ($campaigns as $index => $campaignData) {
            $template = $templates[$campaignData['template']];

            $campaign = Campaign::updateOrCreate(
                ['user_id' => $user->id, 'name' => $campaignData['name']],
                [
                    'email_template_id' => $template->id,
                    'template_name' => $template->name,
                    'recipients' => $campaignData['recipients'],
                    'sent' => $campaignData['sent'],
                    'opened' => $campaignData['opened'],
                    'status' => $campaignData['status'],
                    'sent_at' => $campaignData['sent_at'] ?? null,
                    'scheduled_at' => $campaignData['scheduled_at'] ?? null,
                ]
            );

            foreach ($clients->take($campaignData['recipients']) as $client) {
                CampaignRecipient::updateOrCreate(
                    ['campaign_id' => $campaign->id, 'client_id' => $client->id],
                    [
                        'sent_at' => $campaignData['status'] === 'Sent' ? $campaignData['sent_at'] : null,
                        'opened' => $campaignData['status'] === 'Sent' ? $index % 2 === 0 : false,
                        'opened_at' => $campaignData['status'] === 'Sent' ? $campaignData['sent_at'] : null,
                    ]
                );
            }
        }
    }
}
