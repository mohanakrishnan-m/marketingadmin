import { useState } from 'react';
import { UserPlus, Search, Pencil, Trash2, Users, Phone, Mail, Tag, ChevronUp, ChevronDown } from 'lucide-react';

const CATEGORY_COLORS = {
  Retail: 'bg-violet-50 text-violet-600',
  Technology: 'bg-blue-50 text-blue-600',
  'Food & Beverage': 'bg-orange-50 text-orange-600',
  Finance: 'bg-emerald-50 text-emerald-700',
  Fashion: 'bg-pink-50 text-pink-600',
  Healthcare: 'bg-cyan-50 text-cyan-600',
  Logistics: 'bg-amber-50 text-amber-600',
  Education: 'bg-indigo-50 text-indigo-600',
  'Real Estate': 'bg-rose-50 text-rose-600',
  Other: 'bg-gray-100 text-gray-500',
};

export default function ClientsPage({ clients, setClients, onNavigate, addToast }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('businessName');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.businessName.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const av = a[sortKey] || '';
      const bv = b[sortKey] || '';
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const confirmDelete = (id) => setDeleteId(id);
  const doDelete = () => {
    setClients((prev) => prev.filter((c) => c.id !== deleteId));
    addToast('Client deleted successfully', 'success');
    setDeleteId(null);
  };

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronUp size={11} className="text-gray-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} className="text-indigo-400" />
      : <ChevronDown size={11} className="text-indigo-400" />;
  };

  const TH = ({ label, col, className = '' }) => (
    <th
      onClick={() => handleSort(col)}
      className={`px-3 py-2.5 text-left cursor-pointer select-none group ${className}`}
    >
      <div className="flex items-center gap-1">
        <span className="text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide group-hover:text-gray-700 transition-colors">
          {label}
        </span>
        <SortIcon col={col} />
      </div>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
            <Users size={14} className="text-violet-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Clients</h2>
            <p className="text-[11px] text-gray-400">{clients.length} total clients</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('add-client')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors duration-150 shadow-sm"
        >
          <UserPlus size={13} strokeWidth={2.2} />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-indigo-300 transition-all duration-150 placeholder:text-gray-400"
            />
          </div>
          {search && (
            <span className="text-[11px] text-gray-400">{filtered.length} found</span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50/70">
              <tr>
                <TH label="Business Name" col="businessName" />
                <TH label="Contact Name" col="contactName" />
                <TH label="WhatsApp" col="whatsapp" />
                <TH label="Email" col="email" />
                <TH label="Category" col="category" />
                <th className="px-3 py-2.5 text-right">
                  <span className="text-[11.5px] font-semibold text-gray-500 uppercase tracking-wide">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users size={18} className="text-gray-400" />
                      </div>
                      <p className="text-[13px] font-medium text-gray-500">No clients found</p>
                      <p className="text-[11.5px] text-gray-400">
                        {search ? 'Try a different search term' : 'Add your first client to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr key={client.id} className="table-row-hover transition-colors duration-100 group">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-indigo-600">
                            {client.businessName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-[12.5px] font-medium text-gray-800">{client.businessName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="text-[12px] text-gray-600">{client.contactName}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Phone size={11} className="text-emerald-400 shrink-0" />
                        <span className="text-[12px] text-gray-600">{client.whatsapp}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Mail size={11} className="text-blue-400 shrink-0" />
                        <span className="text-[12px] text-gray-600 truncate max-w-[160px]">{client.email}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          CATEGORY_COLORS[client.category] || 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Tag size={9} />
                        {client.category}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                          onClick={() => onNavigate('edit-client', client)}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-100"
                        >
                          <Pencil size={11} />
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(client.id)}
                          className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors duration-100"
                        >
                          <Trash2 size={11} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/40">
            <p className="text-[11px] text-gray-400">
              Showing {filtered.length} of {clients.length} clients
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-full max-w-sm">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-1">Delete Client</h3>
            <p className="text-[12.5px] text-gray-500 mb-4">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-3 py-1.5 text-[12px] font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
