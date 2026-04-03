import {
  Users, Send, FileText, TrendingUp, ArrowUpRight,
  Mail, CalendarDays, Target, Sparkles, BarChart2, Radio,
} from 'lucide-react';

const STATUS_COLORS = {
  Sent: 'bg-emerald-50 text-emerald-700',
  Scheduled: 'bg-blue-50 text-blue-700',
  Draft: 'bg-slate-100 text-slate-600',
};

const CATEGORY_COLORS = {
  Retail: 'bg-violet-50 text-violet-700',
  Technology: 'bg-blue-50 text-blue-700',
  'Food & Beverage': 'bg-orange-50 text-orange-700',
  Finance: 'bg-emerald-50 text-emerald-700',
  Fashion: 'bg-pink-50 text-pink-700',
  Healthcare: 'bg-cyan-50 text-cyan-700',
  Logistics: 'bg-amber-50 text-amber-700',
  Education: 'bg-indigo-50 text-indigo-700',
};

function getCategoryList(category) {
  return Array.isArray(category) ? category : category ? [category] : [];
}

function StatCard({ label, value, icon: Icon, tone }) {
  return (
    <div className="app-panel min-w-0 rounded-2xl p-3 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-1">
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={14} />
        </div>
        <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
          <ArrowUpRight size={9} />
          Active
        </span>
      </div>
      <p className="pt-2 text-[20px] font-bold tracking-[-0.03em] text-slate-900">{value}</p>
      <p className="truncate text-[12px] font-semibold text-slate-700">{label}</p>
    </div>
  );
}

export default function Dashboard({ clients, templates, campaigns, onNavigate }) {
  const totalSent = campaigns.filter((c) => c.status === 'Sent').reduce((s, c) => s + c.sent, 0);
  const totalOpened = campaigns.filter((c) => c.status === 'Sent').reduce((s, c) => s + c.opened, 0);
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0.0';
  const scheduled = campaigns.filter((c) => c.status === 'Scheduled').length;
  const recentClients = [...clients].slice(-5).reverse();
  const recentCampaigns = [...campaigns].slice(-5).reverse();

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="app-panel overflow-hidden rounded-[28px]">
        <div className="bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.08),transparent_22%)] p-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-600">
            <Sparkles size={12} />
            Marketing Overview
          </div>
          <h2 className="max-w-3xl pt-4 text-[24px] font-bold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[32px]">
            Track clients, templates, and campaign momentum in one place
          </h2>
          <p className="hidden max-w-2xl pt-3 text-[14px] leading-6 text-slate-500 sm:block">
            Review audience size, monitor engagement, and move quickly into the next email marketing action.
          </p>
        </div>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
        <StatCard label="Live Audience" value={clients.length} icon={Radio} tone="bg-pink-50 text-pink-700" />
        <StatCard label="Open Rate" value={`${openRate}%`} icon={BarChart2} tone="bg-violet-50 text-violet-700" />
        <StatCard label="Total Clients" value={clients.length} icon={Users} tone="bg-blue-50 text-blue-700" />
        <StatCard label="Emails Sent" value={totalSent.toLocaleString()} icon={Send} tone="bg-indigo-50 text-indigo-700" />
        <StatCard label="Active Templates" value={templates.length} icon={FileText} tone="bg-emerald-50 text-emerald-700" />
        <StatCard label="Scheduled Sends" value={scheduled} icon={CalendarDays} tone="bg-orange-50 text-orange-700" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="app-panel overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">Recently added clients</p>
                <p className="text-[14px] text-slate-500">Businesses ready to be added into the next campaign cycle</p>
              </div>
            </div>
            <button onClick={() => onNavigate('all-clients')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-50">
              View all
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentClients.map((client) => (
              <div key={client.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-[14px] font-semibold text-violet-700">
                    {client.businessName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-slate-900">{client.businessName}</p>
                    <p className="truncate text-[14px] text-slate-500">{client.contactName} · {client.email}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getCategoryList(client.category).slice(0, 2).map((item) => (
                    <span key={item} className={`inline-flex w-fit rounded-full px-3 py-1.5 text-[12px] font-semibold ${CATEGORY_COLORS[item] || 'bg-slate-100 text-slate-700'}`}>
                      {item}
                    </span>
                  ))}
                  {getCategoryList(client.category).length > 2 && (
                    <span className="inline-flex w-fit rounded-full bg-slate-100 px-3 py-1.5 text-[12px] font-semibold text-slate-600">
                      +{getCategoryList(client.category).length - 2}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="app-panel overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Mail size={16} />
              </div>
              <div>
                <p className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">Campaign performance</p>
                <p className="text-[14px] text-slate-500">Recent sends and scheduled campaign activity</p>
              </div>
            </div>
            <button onClick={() => onNavigate('campaign-history')} className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-medium text-slate-600 hover:bg-slate-50">
              History
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentCampaigns.map((campaign) => {
              const openPct = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
              return (
                <div key={campaign.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-semibold text-slate-900">{campaign.name}</p>
                      <div className="pt-1 text-[14px] text-slate-500">
                        {campaign.recipients} recipients
                        {campaign.status === 'Sent' ? ` · ${openPct}% opened` : ' · Scheduled delivery'}
                      </div>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1.5 text-[12px] font-semibold ${STATUS_COLORS[campaign.status] || 'bg-slate-100 text-slate-700'}`}>
                      {campaign.status}
                    </span>
                  </div>
                  {campaign.status === 'Sent' && (
                    <div className="pt-3">
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${openPct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div className="app-panel rounded-[28px] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-700">
              <Target size={16} />
            </div>
            <div>
              <p className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">Next marketing actions</p>
              <p className="text-[14px] text-slate-500">Recommended operational flow for the team today</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            {[
              'Review new client records and confirm categories before adding them to segments.',
              'Refresh subject lines for templates with low open-rate campaigns in the last 30 days.',
              'Schedule resend audiences for unopened promotional pushes with proven click intent.',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[14px] leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="app-panel rounded-[28px] p-5 sm:p-6">
          <p className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">Quick actions</p>
          <p className="pt-1 text-[14px] text-slate-500">Jump into the most common marketing operations</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Add client', page: 'add-client', icon: Users },
              { label: 'Create template', page: 'create-template', icon: FileText },
              { label: 'Send campaign', page: 'send-campaign', icon: Send },
              { label: 'Review history', page: 'campaign-history', icon: TrendingUp },
            ].map(({ label, page, icon: Icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <Icon size={16} />
                </div>
                <span className="text-[14px] font-medium text-slate-700">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
