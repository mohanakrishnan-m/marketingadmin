export const initialClients = [
  { id: 1, businessName: 'Nova Retail Co.', contactName: 'Arjun Mehta', whatsapp: '+91 98200 11234', email: 'arjun@novaretail.com', category: 'Retail' },
  { id: 2, businessName: 'BlueWave Tech', contactName: 'Priya Sharma', whatsapp: '+91 98765 43210', email: 'priya@bluewave.io', category: 'Technology' },
  { id: 3, businessName: 'Green Earth Foods', contactName: 'Rahul Verma', whatsapp: '+91 97654 32101', email: 'rahul@greenearthfoods.in', category: 'Food & Beverage' },
  { id: 4, businessName: 'Pinnacle Finance', contactName: 'Sneha Joshi', whatsapp: '+91 96543 21098', email: 'sneha@pinnaclefin.com', category: 'Finance' },
  { id: 5, businessName: 'Urban Style Studio', contactName: 'Kunal Das', whatsapp: '+91 95432 10987', email: 'kunal@urbanstyle.co', category: 'Fashion' },
  { id: 6, businessName: 'MediCare Plus', contactName: 'Anita Nair', whatsapp: '+91 94321 09876', email: 'anita@medicareplus.in', category: 'Healthcare' },
  { id: 7, businessName: 'Horizon Logistics', contactName: 'Vikram Rao', whatsapp: '+91 93210 98765', email: 'vikram@horizonlog.com', category: 'Logistics' },
  { id: 8, businessName: 'Sparkle Jewels', contactName: 'Meera Patel', whatsapp: '+91 92109 87654', email: 'meera@sparklejewels.in', category: 'Retail' },
];

export const initialTemplates = [
  {
    id: 1,
    name: 'Client Welcome Series',
    subject: 'Welcome to the next growth sprint, {{name}}',
    content: `<p>Hi <strong>{{name}}</strong>,</p><p>Thanks for joining us from <strong>{{company}}</strong>. Your account is ready, and our team has already prepared the first campaign checklist for your brand.</p><p>Here is what happens next:</p><ul><li>We review your audience segments and active offers</li><li>We align a launch calendar for email and WhatsApp follow-up</li><li>We share the first campaign draft for approval</li></ul><p>If you want to fast-track the rollout, simply reply with your next promotion window and hero product.</p><p>Regards,<br/>Iceberg Client Success</p>`,
    createdAt: '2026-03-10',
  },
  {
    id: 2,
    name: 'Monthly Product Spotlight',
    subject: 'April campaign highlights for {{company}}',
    content: `<p>Hello <strong>{{name}}</strong>,</p><p>We have packaged this month's strongest marketing updates for <strong>{{company}}</strong>.</p><ul><li>Top-performing email subject line from the last 30 days</li><li>Best offer window for weekend conversions</li><li>Recommended resend audience for non-openers</li></ul><p>Reply if you want this version adapted for a regional launch or product-specific push.</p><p>Warm regards,<br/>Iceberg Campaign Team</p>`,
    createdAt: '2026-03-15',
  },
  {
    id: 3,
    name: 'Limited-Time Offer Push',
    subject: '48-hour promotion for {{company}}',
    content: `<p>Hi <strong>{{name}}</strong>,</p><p>We have created a short-window promotional email for <strong>{{company}}</strong> designed to lift conversions fast.</p><p>Featured message:</p><ul><li>Offer expires in 48 hours</li><li>Primary call to action drives traffic to the featured collection</li><li>Follow-up resend can target non-openers after 24 hours</li></ul><p>If needed, we can localize the copy for festive sales, new arrivals, or clearance events.</p><p>Best,<br/>Performance Marketing Desk</p>`,
    createdAt: '2026-03-20',
  },
  {
    id: 4,
    name: 'Lead Nurture Follow-Up',
    subject: 'Following up on the next campaign for {{company}}',
    content: `<p>Hi <strong>{{name}}</strong>,</p><p>I wanted to circle back on the campaign plan we discussed for <strong>{{company}}</strong>.</p><p>We can help you move forward with:</p><ul><li>Audience cleanup before the next email drop</li><li>Template refinement for higher open rates</li><li>Scheduling a resend strategy for warm leads</li></ul><p>Share a suitable time this week and we will prepare the next rollout draft before the call.</p><p>Regards,<br/>Growth Partnerships Team</p>`,
    createdAt: '2026-03-25',
  },
];

export const initialCampaigns = [
  { id: 1, name: 'April Welcome Campaign', template: 'Client Welcome Series', recipients: 42, sent: 42, opened: 31, status: 'Sent', sentAt: '2026-04-01 09:30' },
  { id: 2, name: 'March Newsletter Blast', template: 'Monthly Product Spotlight', recipients: 128, sent: 128, opened: 84, status: 'Sent', sentAt: '2026-03-28 11:00' },
  { id: 3, name: 'Spring Promo Drive', template: 'Limited-Time Offer Push', recipients: 65, sent: 65, opened: 47, status: 'Sent', sentAt: '2026-03-22 14:15' },
  { id: 4, name: 'Q1 Follow Up Sequence', template: 'Lead Nurture Follow-Up', recipients: 38, sent: 38, opened: 22, status: 'Sent', sentAt: '2026-03-15 10:00' },
  { id: 5, name: 'Product Launch Teaser', template: 'Limited-Time Offer Push', recipients: 95, sent: 0, opened: 0, status: 'Scheduled', sentAt: '2026-04-10 09:00' },
];

export const CATEGORIES = [
  'Retail', 'Technology', 'Food & Beverage', 'Finance', 'Fashion',
  'Healthcare', 'Logistics', 'Education', 'Real Estate', 'Other',
];
