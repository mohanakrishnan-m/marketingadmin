// Mock Clients
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

// Mock Email Templates
export const initialTemplates = [
  {
    id: 1,
    name: 'Welcome Email',
    subject: 'Welcome to {{company}}, {{name}}!',
    content: `<p>Hi <strong>{{name}}</strong>,</p><p>Welcome aboard! We're thrilled to have <strong>{{company}}</strong> as part of our community.</p><p>Your account is all set up and ready to go. Here's what you can do next:</p><ul><li>Complete your profile</li><li>Explore our features</li><li>Reach out if you need help</li></ul><p>Best regards,<br/>The Team</p>`,
    createdAt: '2026-03-10',
  },
  {
    id: 2,
    name: 'Monthly Newsletter',
    subject: 'Your Monthly Update — April 2026',
    content: `<p>Hi <strong>{{name}}</strong>,</p><p>Here's what's new this month at {{company}}. We've been working hard to bring you the best updates.</p><p>Check out the highlights below and let us know what you think!</p><p>Warm regards,<br/>The Marketing Team</p>`,
    createdAt: '2026-03-15',
  },
  {
    id: 3,
    name: 'Promotional Offer',
    subject: 'Exclusive Offer for {{name}} 🎉',
    content: `<p>Dear <strong>{{name}}</strong>,</p><p>We have an exclusive offer just for <strong>{{company}}</strong>. Don't miss out!</p><p>Use code <strong>SAVE20</strong> for 20% off on your next purchase.</p><p>This offer expires in 48 hours. Act fast!</p><p>Cheers,<br/>Sales Team</p>`,
    createdAt: '2026-03-20',
  },
  {
    id: 4,
    name: 'Follow Up',
    subject: 'Following up — {{company}}',
    content: `<p>Hi <strong>{{name}}</strong>,</p><p>I wanted to follow up on our recent conversation. We'd love to continue exploring how we can help <strong>{{company}}</strong> grow.</p><p>Can we schedule a quick call this week?</p><p>Looking forward to hearing from you,<br/>Business Development</p>`,
    createdAt: '2026-03-25',
  },
];

// Mock Campaigns
export const initialCampaigns = [
  { id: 1, name: 'April Welcome Campaign', template: 'Welcome Email', recipients: 42, sent: 42, opened: 31, status: 'Sent', sentAt: '2026-04-01 09:30' },
  { id: 2, name: 'March Newsletter Blast', template: 'Monthly Newsletter', recipients: 128, sent: 128, opened: 84, status: 'Sent', sentAt: '2026-03-28 11:00' },
  { id: 3, name: 'Spring Promo Drive', template: 'Promotional Offer', recipients: 65, sent: 65, opened: 47, status: 'Sent', sentAt: '2026-03-22 14:15' },
  { id: 4, name: 'Q1 Follow Up Sequence', template: 'Follow Up', recipients: 38, sent: 38, opened: 22, status: 'Sent', sentAt: '2026-03-15 10:00' },
  { id: 5, name: 'Product Launch Teaser', template: 'Promotional Offer', recipients: 95, sent: 0, opened: 0, status: 'Scheduled', sentAt: '2026-04-10 09:00' },
];

export const CATEGORIES = [
  'Retail', 'Technology', 'Food & Beverage', 'Finance', 'Fashion',
  'Healthcare', 'Logistics', 'Education', 'Real Estate', 'Other',
];
