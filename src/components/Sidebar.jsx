import { useState } from 'react';
import {
  LayoutDashboard, Users, UserPlus, Mail, FileText,
  Send, History, Settings, ChevronDown, ChevronRight,
  ChevronLeft, Snowflake,
} from 'lucide-react';

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

export default function Sidebar({ isOpen, currentPage, onNavigate }) {
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
        sidebar-transition flex flex-col bg-white border-r border-gray-100 h-full shrink-0 overflow-hidden
        ${isOpen ? 'w-[224px]' : 'w-[60px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3.5 border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0 shadow-sm">
          <Snowflake size={16} className="text-white" strokeWidth={2.5} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0'
          }`}
        >
          <p className="text-[13px] font-bold text-gray-900 whitespace-nowrap leading-tight">Iceberg</p>
          <p className="text-[10px] text-indigo-400 whitespace-nowrap font-medium tracking-wide uppercase">
            Marketing Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isItemActive = isActive(item.id) || isParentActive(item);
          const isExp = expanded[item.id];

          return (
            <div key={item.id}>
              {/* Parent item */}
              <button
                onClick={() => handleNav(item)}
                title={!isOpen ? item.label : undefined}
                className={`
                  w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150 group
                  ${isItemActive && !item.children
                    ? `${item.activeBg} text-gray-900`
                    : isParentActive(item)
                    ? `${item.activeBg} text-gray-900`
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <Icon
                  size={16}
                  className={`shrink-0 ${isItemActive || isParentActive(item) ? item.iconColor : 'text-gray-400 group-hover:' + item.iconColor}`}
                  strokeWidth={isItemActive || isParentActive(item) ? 2.2 : 1.8}
                />
                <span
                  className={`text-[12.5px] font-medium flex-1 whitespace-nowrap overflow-hidden transition-all duration-300 ${
                    isOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0'
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
                  style={{ maxHeight: isExp ? `${item.children.length * 44}px` : '0px' }}
                >
                  <div className="ml-3 pl-3 border-l border-gray-100 mt-0.5 mb-0.5 space-y-0.5">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon;
                      const childActive = isActive(child.id);
                      return (
                        <button
                          key={child.id}
                          onClick={() => onNavigate(child.id)}
                          className={`
                            w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all duration-150
                            ${childActive
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }
                          `}
                        >
                          <div
                            className={`w-1 h-1 rounded-full shrink-0 ${childActive ? 'bg-indigo-500' : 'bg-gray-300'}`}
                          />
                          <span className="text-[12px] font-medium whitespace-nowrap">{child.label}</span>
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
      <div className="shrink-0 border-t border-gray-100 px-2 py-2.5">
        <div
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-150 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-indigo-600">A</span>
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-[11.5px] font-semibold text-gray-800 whitespace-nowrap">Admin User</p>
            <p className="text-[10px] text-gray-400 whitespace-nowrap">admin@iceberg.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
