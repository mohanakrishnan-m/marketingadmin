import { useState } from 'react';
import {
  UserPlus, Search, Pencil, Trash2, Users,
  Phone, Mail, Tag, ChevronUp, ChevronDown, Filter,
} from 'lucide-react';

const CATEGORY_COLORS = {
  Retail: 'bg-violet-50 text-violet-700',
  Technology: 'bg-blue-50 text-blue-700',
  'Food & Beverage': 'bg-orange-50 text-orange-700',
  Finance: 'bg-emerald-50 text-emerald-700',
  Fashion: 'bg-pink-50 text-pink-700',
  Healthcare: 'bg-cyan-50 text-cyan-700',
  Logistics: 'bg-amber-50 text-amber-700',
  Education: 'bg-indigo-50 text-indigo-700',
  'Real Estate': 'bg-rose-50 text-rose-700',
  Other: 'bg-slate-100 text-slate-700',
};

function getCategoryList(category) {
  return Array.isArray(category) ? category : category ? [category] : [];
}

function getCategoryText(category) {
  return getCategoryList(category).join(', ');
}

export default function ClientsPage({ clients, setClients, onNavigate, addToast }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('businessName');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.businessName.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        getCategoryText(c.category).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = sortKey === 'category' ? getCategoryText(a.category) : (a[sortKey] || '');
      const bv = sortKey === 'category' ? getCategoryText(b.category) : (b[sortKey] || '');
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const doDelete = () => {
    setClients((prev) => prev.filter((c) => c.id !== deleteId));
    addToast('Client deleted successfully', 'success');
    setDeleteId(null);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-indigo-500" />
      : <ChevronDown size={12} className="text-indigo-500" />;
  };

  const HeaderCell = ({ label, col }) => (
    <th onClick={() => handleSort(col)} className="cursor-pointer px-4 py-3 text-left">
      <div className="flex items-center gap-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
        <SortIcon col={col} />
      </div>
    </th>
  );

  return (
    <div className="space-y-5">
      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="grid gap-4 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-[0_12px_28px_rgba(99,102,241,0.24)]">
              <Users size={20} />
            </div>
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] leading-tight text-slate-900 sm:text-[28px]">Client list</h2>
              <p className="hidden pt-2 text-[14px] leading-6 text-slate-500 sm:block">
                Search and sort business records before assigning segments, templates, and campaign sends.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Active records</p>
              <p className="pt-1 text-[20px] font-semibold text-slate-900">{clients.length}</p>
            </div>
            <button
              onClick={() => onNavigate('add-client')}
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)] hover:-translate-y-0.5"
            >
              <UserPlus size={15} />
              Add Client
            </button>
          </div>
        </div>
      </div>

      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by business, contact, email or category"
              className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-3 pl-11 pr-4 text-[13px] text-slate-700"
            />
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[12px] text-slate-500">
            <Filter size={14} />
            {filtered.length} matching clients
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[920px]">
            <thead className="bg-slate-50/80">
              <tr>
                <HeaderCell label="Business" col="businessName" />
                <HeaderCell label="Contact" col="contactName" />
                <HeaderCell label="WhatsApp" col="whatsapp" />
                <HeaderCell label="Email" col="email" />
                <HeaderCell label="Category" col="category" />
                <th className="px-4 py-3 text-right">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-[13px] text-slate-500">
                    No client records matched this search.
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr key={client.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-[13px] font-semibold text-indigo-700">
                          {client.businessName.charAt(0)}
                        </div>
                        <span className="text-[13px] font-semibold text-slate-900">{client.businessName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[13px] text-slate-600">{client.contactName}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[13px] text-slate-600">
                        <Phone size={13} className="text-emerald-500" />
                        {client.whatsapp}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-[13px] text-slate-600">
                        <Mail size={13} className="text-blue-500" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        {getCategoryList(client.category).map((item) => (
                          <span key={item} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${CATEGORY_COLORS[item] || CATEGORY_COLORS.Other}`}>
                            <Tag size={10} />
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onNavigate('edit-client', client)} className="rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50">
                          <span className="inline-flex items-center gap-1.5"><Pencil size={12} /> Edit</span>
                        </button>
                        <button onClick={() => setDeleteId(client.id)} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-medium text-red-600 hover:bg-red-100">
                          <span className="inline-flex items-center gap-1.5"><Trash2 size={12} /> Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 lg:hidden">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center text-[13px] text-slate-500">
              No client records matched this search.
            </div>
          ) : (
            filtered.map((client) => (
              <div key={client.id} className="rounded-[26px] border border-slate-200/80 bg-white/90 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-900">{client.businessName}</p>
                    <p className="pt-1 text-[12px] text-slate-500">{client.contactName}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {getCategoryList(client.category).map((item) => (
                      <span key={item} className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${CATEGORY_COLORS[item] || CATEGORY_COLORS.Other}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-[12px] text-slate-600">
                  <div className="flex items-center gap-2"><Phone size={13} className="text-emerald-500" /> {client.whatsapp}</div>
                  <div className="flex items-center gap-2"><Mail size={13} className="text-blue-500" /> {client.email}</div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button onClick={() => onNavigate('edit-client', client)} className="rounded-2xl border border-slate-200/80 bg-white px-3 py-3 text-[12px] font-medium text-slate-600">
                    Edit Client
                  </button>
                  <button onClick={() => setDeleteId(client.id)} className="rounded-2xl border border-red-200 bg-red-50 px-3 py-3 text-[12px] font-medium text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>
            <h3 className="pt-4 text-[18px] font-semibold text-slate-900">Delete client record</h3>
            <p className="pt-2 text-[13px] leading-6 text-slate-500">
              This will remove the client from your active marketing list and future campaign selection.
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[13px] font-medium text-slate-600">
                Cancel
              </button>
              <button onClick={doDelete} className="flex-1 rounded-2xl bg-red-500 px-4 py-3 text-[13px] font-semibold text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
