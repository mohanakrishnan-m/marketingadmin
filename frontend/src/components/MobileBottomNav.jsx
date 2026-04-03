import { LayoutDashboard, Users, FileText, Send, Settings } from 'lucide-react';

const ITEMS = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard, match: ['dashboard'] },
  { id: 'all-clients', label: 'Clients', icon: Users, match: ['all-clients', 'add-client'] },
  { id: 'view-templates', label: 'Templates', icon: FileText, match: ['view-templates', 'create-template'] },
  { id: 'send-campaign', label: 'Campaigns', icon: Send, match: ['send-campaign', 'campaign-history'] },
  { id: 'settings', label: 'Settings', icon: Settings, match: ['settings'] },
];

export default function MobileBottomNav({ currentPage, onNavigate }) {
  return (
    <div className="app-glass fixed inset-x-3 bottom-3 z-40 rounded-[26px] border-white/70 px-2 py-2 lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {ITEMS.map(({ id, label, icon: Icon, match }) => {
          const active = match.includes(currentPage);
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2.5 ${
                active ? 'bg-indigo-500 text-white shadow-[0_12px_22px_rgba(99,102,241,0.28)]' : 'text-slate-500 hover:bg-white/70'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] font-semibold tracking-[0.02em]">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
