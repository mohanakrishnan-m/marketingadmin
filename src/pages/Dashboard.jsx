import { Users, Send, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Mail, Eye } from 'lucide-react';

const STATUS_COLORS = {
  Sent: 'bg-emerald-50 text-emerald-600',
  Scheduled: 'bg-blue-50 text-blue-600',
  Draft: 'bg-gray-100 text-gray-500',
};

const CATEGORY_COLORS = {
  Retail: 'bg-violet-50 text-violet-600',
  Technology: 'bg-blue-50 text-blue-600',
  'Food & Beverage': 'bg-orange-50 text-orange-600',
  Finance: 'bg-emerald-50 text-emerald-700',
  Fashion: 'bg-pink-50 text-pink-600',
  Healthcare: 'bg-cyan-50 text-cyan-600',
  Logistics: 'bg-amber-50 text-amber-600',
  Education: 'bg-indigo-50 text-indigo-600',
};

export default function Dashboard({ clients, templates, campaigns, onNavigate }) {
  const totalSent = campaigns.filter((c) => c.status === 'Sent').reduce((s, c) => s + c.sent, 0);
  const totalOpened = campaigns.filter((c) => c.status === 'Sent').reduce((s, c) => s + c.opened, 0);
  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : '0.0';

  const stats = [
    {
      label: 'Total Clients',
      value: clients.length,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      trend: '+12%',
      up: true,
      trendLabel: 'vs last month',
    },
    {
      label: 'Emails Sent',
      value: totalSent.toLocaleString(),
      icon: Send,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
      trend: '+8%',
      up: true,
      trendLabel: 'vs last month',
    },
    {
      label: 'Templates',
      value: templates.length,
      icon: FileText,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      trend: `+${templates.length - 2}`,
      up: true,
      trendLabel: 'new this month',
    },
    {
      label: 'Avg. Open Rate',
      value: `${openRate}%`,
      icon: TrendingUp,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
      trend: '+2.4%',
      up: true,
      trendLabel: 'vs last month',
    },
  ];

  const recentClients = [...clients].slice(-5).reverse();
  const recentCampaigns = [...campaigns].slice(-5).reverse();

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon size={15} className={s.iconColor} strokeWidth={2.2} />
                </div>
                <div className={`flex items-center gap-0.5 text-[11px] font-medium ${s.up ? 'text-emerald-500' : 'text-red-400'}`}>
                  {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {s.trend}
                </div>
              </div>
              <p className="text-[22px] font-bold text-gray-900 leading-none mb-1">{s.value}</p>
              <p className="text-[11.5px] text-gray-500 font-medium">{s.label}</p>
              <p className="text-[10.5px] text-gray-400 mt-0.5">{s.trendLabel}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Clients */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center">
                <Users size={12} className="text-blue-500" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800">Recent Clients</span>
            </div>
            <button
              onClick={() => onNavigate('all-clients')}
              className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-0.5 transition-colors"
            >
              View all <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentClients.map((client) => (
              <div key={client.id} className="px-4 py-2.5 hover:bg-gray-50/60 transition-colors duration-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-bold text-indigo-600">
                        {client.businessName.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-gray-800 truncate">{client.businessName}</p>
                      <p className="text-[11px] text-gray-400 truncate">{client.contactName}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      CATEGORY_COLORS[client.category] || 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {client.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-50 rounded-md flex items-center justify-center">
                <Mail size={12} className="text-emerald-500" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800">Recent Campaigns</span>
            </div>
            <button
              onClick={() => onNavigate('campaign-history')}
              className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-0.5 transition-colors"
            >
              View all <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCampaigns.map((c) => {
              const openPct = c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0;
              return (
                <div key={c.id} className="px-4 py-2.5 hover:bg-gray-50/60 transition-colors duration-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] font-medium text-gray-800 truncate">{c.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-gray-400 flex items-center gap-1">
                          <Send size={10} /> {c.recipients} recipients
                        </span>
                        {c.status === 'Sent' && (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <Eye size={10} /> {openPct}% opened
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {c.status === 'Sent' && (
                        <div className="w-16">
                          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${openPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <span className={`text-[10.5px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-500'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <p className="text-[12.5px] font-semibold text-gray-700 mb-3">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Add New Client', page: 'add-client', color: 'bg-blue-500 hover:bg-blue-600', icon: Users },
            { label: 'Create Template', page: 'create-template', color: 'bg-emerald-500 hover:bg-emerald-600', icon: FileText },
            { label: 'Send Campaign', page: 'send-campaign', color: 'bg-indigo-500 hover:bg-indigo-600', icon: Send },
            { label: 'View History', page: 'campaign-history', color: 'bg-orange-500 hover:bg-orange-600', icon: TrendingUp },
          ].map(({ label, page, color, icon: Icon }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`flex items-center gap-1.5 px-3 py-1.5 ${color} text-white text-[12px] font-medium rounded-lg transition-colors duration-150 shadow-sm`}
            >
              <Icon size={13} strokeWidth={2.2} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
