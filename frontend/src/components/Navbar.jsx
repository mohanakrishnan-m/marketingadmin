import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings, X } from 'lucide-react';

export default function Navbar({
  sidebarOpen, onToggleSidebar, pageTitle, pageSubtitle, currentUser, onLogout,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const dropRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, text: 'New client "Sparkle Jewels" added', time: '5m ago', dot: 'bg-indigo-500' },
    { id: 2, text: 'Campaign "April Welcome" sent to 42 clients', time: '1h ago', dot: 'bg-emerald-500' },
    { id: 3, text: '"Spring Promo" open rate 72%', time: '3h ago', dot: 'bg-orange-400' },
  ];

  return (
    <header className="app-glass z-20 flex h-auto shrink-0 items-center gap-3 rounded-3xl px-4 py-3 sm:px-5">
      <button
        onClick={onToggleSidebar}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <Menu size={18} />
      </button>

      <div className="mr-auto min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="whitespace-nowrap text-[24px] font-bold tracking-[-0.03em] text-slate-900">{pageTitle}</h1>
        </div>
        {pageSubtitle && <p className="truncate pt-0.5 text-[14px] text-slate-500">{pageSubtitle}</p>}
      </div>

      <div className="relative hidden lg:flex items-center">
        <Search size={16} className="pointer-events-none absolute left-4 text-slate-500" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search clients, templates, campaigns..."
          className="surface-input w-[320px] rounded-2xl py-3.5 pl-11 pr-10 text-[14px] text-slate-700 shadow-none placeholder:text-slate-400 focus:border-pink-200 focus:bg-white"
        />
        {searchVal && (
          <button onClick={() => setSearchVal('')} className="absolute right-3 text-slate-400 hover:text-slate-600">
            <X size={12} />
          </button>
        )}
      </div>

      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen((v) => !v); setDropdownOpen(false); }}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
        >
          <Bell size={16} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white py-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <span className="text-[13px] font-semibold text-slate-800">Notifications</span>
              <span className="cursor-pointer text-[11px] font-medium text-violet-600 hover:underline">Mark all read</span>
            </div>
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div key={n.id} className="cursor-pointer px-5 py-4 transition-colors duration-200 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.dot}`} />
                    <div className="min-w-0">
                      <p className="text-[12.5px] leading-snug text-slate-700">{n.text}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative" ref={dropRef}>
        <button
          onClick={() => { setDropdownOpen((v) => !v); setNotifOpen(false); }}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white py-2 pl-2 pr-3 shadow-sm hover:border-slate-300 hover:bg-slate-50"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-indigo-500">
            <span className="text-[11px] font-semibold text-white">{currentUser?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
          </div>
          <span className="hidden text-[13px] font-semibold text-slate-700 sm:block">{currentUser?.name?.split(' ')[0] || 'Admin'}</span>
          <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-3xl border border-slate-200 bg-white py-2 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-100 px-4 py-3">
              <p className="text-[13px] font-semibold text-slate-800">{currentUser?.name || 'Admin User'}</p>
              <p className="text-[11px] text-slate-400">{currentUser?.email || 'admin@iceberg.io'}</p>
            </div>
            {[
              { icon: User, label: 'Profile' },
              { icon: Settings, label: 'Settings' },
            ].map(({ icon: Icon, label }) => (
              <button key={label} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-slate-600 transition-colors duration-100 hover:bg-slate-50">
                <Icon size={14} className="text-slate-400" />
                {label}
              </button>
            ))}
            <div className="mt-1 border-t border-slate-100">
              <button onClick={onLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[12.5px] text-red-500 transition-colors duration-100 hover:bg-red-50">
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
