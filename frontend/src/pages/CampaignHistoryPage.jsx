import { useState } from 'react';
import { History, Send, Eye, Users, TrendingUp, Search, Calendar, Filter } from 'lucide-react';

const STATUS_COLORS = {
  Sent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  Draft: 'bg-slate-50 text-slate-600 border-slate-200',
  Failed: 'bg-red-50 text-red-700 border-red-200',
};

export default function CampaignHistoryPage({ campaigns, onNavigate }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = campaigns.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.template.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSent = campaigns.filter((c) => c.status === 'Sent').reduce((s, c) => s + c.sent, 0);
  const totalOpened = campaigns.filter((c) => c.status === 'Sent').reduce((s, c) => s + c.opened, 0);
  const avgOpen = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-5">
      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="grid gap-4 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_24%)] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_12px_28px_rgba(249,115,22,0.24)]">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] leading-tight text-slate-900 sm:text-[28px]">Campaign history</h2>
              <p className="hidden pt-2 text-[14px] leading-6 text-slate-500 sm:block">
                Review sent volume, opens, schedules, and the templates tied to each campaign run.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('send-campaign')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)]"
          >
            <Send size={15} />
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Emails Sent', value: totalSent.toLocaleString(), icon: Send, tone: 'bg-indigo-50 text-indigo-700' },
          { label: 'Opens Tracked', value: totalOpened.toLocaleString(), icon: Eye, tone: 'bg-emerald-50 text-emerald-700' },
          { label: 'Average Open Rate', value: `${avgOpen}%`, icon: TrendingUp, tone: 'bg-orange-50 text-orange-700' },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="app-panel rounded-[28px] p-5">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
              <Icon size={18} />
            </div>
            <p className="pt-4 text-[24px] font-semibold tracking-[-0.03em] text-slate-900">{value}</p>
            <p className="pt-1 text-[13px] text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaign or template"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-3 pl-11 pr-4 text-[13px] text-slate-700"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'Sent', 'Scheduled', 'Draft'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-2xl px-4 py-3 text-[12px] font-medium ${
                  statusFilter === status ? 'bg-indigo-600 text-white' : 'border border-slate-200/80 bg-white text-slate-600'
                }`}
              >
                {status === 'all' ? 'All statuses' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[920px]">
            <thead className="bg-slate-50/80">
              <tr>
                {['Campaign', 'Template', 'Recipients', 'Opened', 'Open Rate', 'Status', 'Sent At'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((campaign) => {
                const openPct = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
                return (
                  <tr key={campaign.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-4 py-4 text-[13px] font-semibold text-slate-900">{campaign.name}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{campaign.template}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{campaign.recipients}</td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{campaign.opened}</td>
                    <td className="px-4 py-4">
                      {campaign.status === 'Sent' ? (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${openPct}%` }} />
                          </div>
                          <span className="text-[12px] font-medium text-slate-600">{openPct}%</span>
                        </div>
                      ) : (
                        <span className="text-[12px] text-slate-400">Pending send</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${STATUS_COLORS[campaign.status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[12px] text-slate-500">{campaign.sentAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 lg:hidden">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-[13px] text-slate-500">
              No campaigns match the current filters.
            </div>
          ) : (
            filtered.map((campaign) => {
              const openPct = campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0;
              return (
                <div key={campaign.id} className="rounded-[26px] border border-slate-200/80 bg-white/90 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-slate-900">{campaign.name}</p>
                      <p className="pt-1 text-[12px] text-slate-500">{campaign.template}</p>
                    </div>
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold ${STATUS_COLORS[campaign.status] || 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-slate-600">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3"><Users size={13} className="mb-1 text-slate-400" /> {campaign.recipients} recipients</div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3"><Eye size={13} className="mb-1 text-slate-400" /> {campaign.opened} opens</div>
                  </div>
                  <div className="mt-4 text-[12px] text-slate-500">Open rate: {campaign.status === 'Sent' ? `${openPct}%` : 'Pending send'}</div>
                  <div className="mt-2 text-[12px] text-slate-400">{campaign.sentAt}</div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
