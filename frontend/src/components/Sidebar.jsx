import { useState } from 'react';
import {
  LayoutDashboard, Users, UserPlus, Mail, FileText,
  Send, History, Settings, ChevronDown,
} from 'lucide-react';
const technologiesLogo = new URL('../../logo/TECHNOLOGIES.svg', import.meta.url).href;

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    iconColor: 'text-blue-500',
    activeBg: 'bg-blue-50',
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: Users,
    iconColor: 'text-violet-500',
    activeBg: 'bg-violet-50',
    children: [
      { id: 'all-clients', label: 'All Clients', icon: Users },
      { id: 'add-client', label: 'Add Client', icon: UserPlus },
    ],
  },
  {
    id: 'email-marketing',
    label: 'Email Marketing',
    icon: Mail,
    iconColor: 'text-emerald-500',
    activeBg: 'bg-emerald-50',
    children: [
      { id: 'create-template', label: 'Create Template', icon: FileText },
      { id: 'view-templates', label: 'View Templates', icon: FileText },
      { id: 'send-campaign', label: 'Send Campaign', icon: Send },
    ],
  },
  {
    id: 'campaign-history',
    label: 'Campaign History',
    icon: History,
    iconColor: 'text-orange-500',
    activeBg: 'bg-orange-50',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    iconColor: 'text-gray-400',
    activeBg: 'bg-gray-100',
  },
];

const CHILD_IDS = {
  'all-clients': 'clients',
  'add-client': 'clients',
  'create-template': 'email-marketing',
  'view-templates': 'email-marketing',
  'send-campaign': 'email-marketing',
};

const ICON_COLOR_MAP = {
  dashboard: 'text-indigo-600',
  clients: 'text-violet-600',
  'email-marketing': 'text-emerald-600',
  'campaign-history': 'text-orange-500',
  settings: 'text-slate-500',
};

export default function Sidebar({ isOpen, currentPage, onNavigate, currentUser }) {
  const parentId = CHILD_IDS[currentPage];
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    if (parentId) init[parentId] = true;
    return init;
  });

  const toggleSection = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNav = (item) => {
    if (item.children) {
      if (!isOpen) return;
      toggleSection(item.id);
    } else {
      onNavigate(item.id);
    }
  };

  const isActive = (id) => currentPage === id;
  const isParentActive = (item) => item.children?.some((c) => c.id === currentPage);

  return (
    <aside
      className={`
        sidebar-transition app-glass fixed inset-y-2 left-2 z-40 flex flex-col overflow-hidden rounded-[28px]
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0 lg:translate-x-0 lg:opacity-100'}
        w-[290px] lg:inset-y-0 lg:left-0 lg:relative lg:z-0 lg:opacity-100
        ${isOpen ? 'lg:w-[292px]' : 'lg:w-[88px]'}
      `}
    >
      {/* Logo */}
      <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-4 py-5">
        <div className="soft-ring flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-white p-2.5 shrink-0">
          <img src={technologiesLogo} alt="Technologies logo" className="h-full w-full object-contain" />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-w-[210px] opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          <p className="whitespace-nowrap text-[18px] font-bold tracking-[-0.03em] text-slate-900 leading-tight">Iceberg</p>
          <p className="whitespace-nowrap pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-violet-500/80">
            Marketing Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isItemActive = isActive(item.id) || isParentActive(item);
          const isExp = expanded[item.id];
          const iconColorClass = ICON_COLOR_MAP[item.id] || 'text-slate-400';

          return (
            <div key={item.id}>
              {/* Parent item */}
              <button
                onClick={() => handleNav(item)}
                title={!isOpen ? item.label : undefined}
                className={`
                  group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left duration-200
                  ${isItemActive && !item.children
                    ? 'border border-violet-100 bg-violet-50 text-slate-900 shadow-sm'
                    : isParentActive(item)
                    ? 'border border-violet-100 bg-violet-50/70 text-slate-900 shadow-sm'
                    : 'border border-transparent text-slate-500 hover:bg-white hover:text-slate-800'
                  }
                `}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${isItemActive || isParentActive(item) ? iconColorClass : 'text-slate-400 group-hover:text-slate-700'}`}
                  strokeWidth={isItemActive || isParentActive(item) ? 2.2 : 1.8}
                />
                <span
                  className={`flex-1 overflow-hidden whitespace-nowrap text-[14px] font-medium tracking-[-0.01em] transition-all duration-300 ${
                    isOpen ? 'max-w-[190px] opacity-100' : 'max-w-0 opacity-0'
                  }`}
                >
                  {item.label}
                </span>
                {item.children && isOpen && (
                  <span className="shrink-0 transition-transform duration-200" style={{ transform: isExp ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown size={13} className="text-gray-400" />
                  </span>
                )}
              </button>

              {/* Children */}
              {item.children && isOpen && (
                <div
                  className="overflow-hidden transition-all duration-250 ease-in-out"
                  style={{ maxHeight: isExp ? `${item.children.length * 56}px` : '0px' }}
                >
                  <div className="mb-1 ml-4 mt-2 space-y-1 border-l border-slate-200 pl-4">
                    {item.children.map((child) => {
                      const childActive = isActive(child.id);
                      return (
                        <button
                          key={child.id}
                          onClick={() => onNavigate(child.id)}
                          className={`
                            flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left duration-200
                            ${childActive
                              ? 'bg-gradient-to-r from-violet-50 to-pink-50 text-violet-700'
                              : 'text-slate-500 hover:bg-white hover:text-slate-800'
                            }
                          `}
                        >
                          <div
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${childActive ? 'bg-violet-600' : 'bg-slate-300'}`}
                          />
                          <span className="whitespace-nowrap text-[13px] font-medium">{child.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer toggle hint */}
      <div className="shrink-0 border-t border-slate-200 px-3 py-4">
        <div
          className={`flex items-center gap-3 rounded-[22px] bg-white px-3 py-3 transition-all duration-150 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-500">
            <span className="text-[12px] font-semibold text-white">{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="whitespace-nowrap text-[13px] font-semibold text-slate-800">{currentUser?.name || 'Admin User'}</p>
            <p className="whitespace-nowrap text-[11px] text-slate-500">{currentUser?.email || 'admin@iceberg.io'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
