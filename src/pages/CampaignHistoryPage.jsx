import { useState } from 'react';
import { History, Send, Eye, Users, TrendingUp, Search, Calendar } from 'lucide-react';

const STATUS_COLORS = {
  Sent: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Scheduled: 'bg-blue-50 text-blue-600 border-blue-100',
  Draft: 'bg-gray-50 text-gray-500 border-gray-100',
  Failed: 'bg-red-50 text-red-600 border-red-100',
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center">
            <History size={14} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Campaign History</h2>
            <p className="text-[11px] text-gray-400">{campaigns.length} campaigns total</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('send-campaign')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm"
        >
          <Send size={12} strokeWidth={2.2} />
          New Campaign
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Emails Sent', value: totalSent.toLocaleString(), icon: Send, bg: 'bg-indigo-50', color: 'text-indigo-500' },
          { label: 'Total Opened', value: totalOpened.toLocaleString(), icon: Eye, bg: 'bg-emerald-50', color: 'text-emerald-500' },
          { label: 'Avg. Open Rate', value: `${avgOpen}%`, icon: TrendingUp, bg: 'bg-orange-50', color: 'text-orange-500' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5">
            <div className={`w-7 h-7 ${bg} rounded-lg flex items-center justify-center mb-2`}>
              <Icon size={14} className={color} />
            </div>
            <p className="text-[18px] font-bold text-gray-900">{value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="pl-8 pr-3 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-lg focus:border-indigo-300 w-52 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-1">
            {['all', 'Sent', 'Scheduled', 'Draft'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 text-[11.5px] font-medium rounded-lg transition-colors duration-150
                  ${statusFilter === s ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead className="bg-gray-50/70">
              <tr>
                {['Campaign Name', 'Template', 'Recipients', 'Opened', 'Open Rate', 'Status', 'Sent At'].map((col) => (
                  <th key={col} className="px-3 py-2.5 text-left">
                    <span className="text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">{col}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <History size={18} className="text-gray-400" />
                      </div>
                      <p className="text-[13px] font-medium text-gray-500">No campaigns found</p>
                      <p className="text-[11.5px] text-gray-400">{search ? 'Try different filters' : 'Send your first campaign to see history'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const openPct = c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0;
                  return (
                    <tr key={c.id} className="table-row-hover transition-colors duration-100">
                      <td className="px-3 py-2.5">
                        <p className="text-[12.5px] font-medium text-gray-800">{c.name}</p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-[12px] text-gray-500">{c.template}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1 text-[12px] text-gray-600">
                          <Users size={11} className="text-gray-400" />
                          {c.recipients}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1 text-[12px] text-gray-600">
                          <Eye size={11} className="text-gray-400" />
                          {c.opened}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        {c.status === 'Sent' ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${openPct >= 60 ? 'bg-emerald-400' : openPct >= 30 ? 'bg-amber-400' : 'bg-red-400'}`}
                                style={{ width: `${openPct}%` }}
                              />
                            </div>
                            <span className="text-[12px] text-gray-600 font-medium">{openPct}%</span>
                          </div>
                        ) : (
                          <span className="text-[12px] text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1 text-[11.5px] text-gray-400">
                          <Calendar size={10} />
                          {c.sentAt}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/40">
            <p className="text-[11px] text-gray-400">Showing {filtered.length} of {campaigns.length} campaigns</p>
          </div>
        )}
      </div>
    </div>
  );
}
