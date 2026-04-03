import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, User, Settings, X } from 'lucide-react';

export default function Navbar({ sidebarOpen, onToggleSidebar, pageTitle, pageSubtitle }) {
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
    { id: 3, text: '"Spring Promo" open rate 72% 🎉', time: '3h ago', dot: 'bg-orange-400' },
  ];

  return (
    <header className="h-[52px] bg-white border-b border-gray-100 px-4 flex items-center gap-3 shrink-0 z-20">
      {/* Toggle */}
      <button
        onClick={onToggleSidebar}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150 shrink-0"
        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <Menu size={16} />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2 min-w-0 mr-auto">
        <h1 className="text-[14px] font-semibold text-gray-900 whitespace-nowrap">{pageTitle}</h1>
        {pageSubtitle && (
          <>
            <span className="text-gray-200 shrink-0">/</span>
            <span className="text-[12px] text-gray-400 truncate">{pageSubtitle}</span>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative hidden sm:flex items-center">
        <Search size={13} className="absolute left-2.5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search..."
          className="w-48 pl-8 pr-7 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-300 transition-all duration-150 placeholder:text-gray-400"
        />
        {searchVal && (
          <button onClick={() => setSearchVal('')} className="absolute right-2 text-gray-400 hover:text-gray-600">
            <X size={11} />
          </button>
        )}
      </div>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button
          onClick={() => { setNotifOpen((v) => !v); setDropdownOpen(false); }}
          className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors duration-150"
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-10 w-72 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-gray-800">Notifications</span>
              <span className="text-[10px] text-indigo-500 cursor-pointer hover:underline font-medium">Mark all read</span>
            </div>
            <div className="divide-y divide-gray-50">
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors duration-100">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div className="min-w-0">
                      <p className="text-[12px] text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User dropdown */}
      <div className="relative" ref={dropRef}>
        <button
          onClick={() => { setDropdownOpen((v) => !v); setNotifOpen(false); }}
          className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-150"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">A</span>
          </div>
          <span className="text-[12px] font-medium text-gray-700 hidden sm:block">Admin</span>
          <ChevronDown
            size={12}
            className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
            <div className="px-3 py-2 border-b border-gray-50">
              <p className="text-[12px] font-semibold text-gray-800">Admin User</p>
              <p className="text-[10.5px] text-gray-400">admin@iceberg.io</p>
            </div>
            {[
              { icon: User, label: 'Profile' },
              { icon: Settings, label: 'Settings' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-gray-600 hover:bg-gray-50 transition-colors duration-100"
              >
                <Icon size={13} className="text-gray-400" />
                {label}
              </button>
            ))}
            <div className="border-t border-gray-50 mt-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-red-500 hover:bg-red-50 transition-colors duration-100">
                <LogOut size={13} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
