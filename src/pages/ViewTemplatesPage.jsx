import { useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Eye, Search, Calendar } from 'lucide-react';

export default function ViewTemplatesPage({ templates, setTemplates, onNavigate, addToast }) {
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const doDelete = () => {
    setTemplates((prev) => prev.filter((t) => t.id !== deleteId));
    addToast('Template deleted', 'success');
    setDeleteId(null);
  };

  const getExcerpt = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').slice(0, 100) + '...';
  };

  const COLORS = [
    'from-indigo-400 to-indigo-600',
    'from-emerald-400 to-emerald-600',
    'from-violet-400 to-violet-600',
    'from-orange-400 to-orange-600',
    'from-pink-400 to-pink-600',
    'from-cyan-400 to-cyan-600',
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Email Templates</h2>
            <p className="text-[11px] text-gray-400">{templates.length} templates saved</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('create-template')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus size={13} strokeWidth={2.5} />
          New Template
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-gray-200 rounded-lg focus:border-indigo-300 transition-all duration-150 placeholder:text-gray-400"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm py-14 flex flex-col items-center gap-2">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <FileText size={18} className="text-gray-400" />
          </div>
          <p className="text-[13px] font-medium text-gray-500">No templates found</p>
          <p className="text-[11.5px] text-gray-400">
            {search ? 'Try a different search term' : 'Create your first email template'}
          </p>
          {!search && (
            <button
              onClick={() => onNavigate('create-template')}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 text-white text-[12px] font-medium rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <Plus size={13} /> Create Template
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((t, i) => (
            <div
              key={t.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
            >
              {/* Color bar */}
              <div className={`h-1.5 bg-gradient-to-r ${COLORS[i % COLORS.length]}`} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-semibold text-gray-900 truncate">{t.name}</h3>
                    <p className="text-[11.5px] text-gray-500 truncate mt-0.5">{t.subject}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center shrink-0`}>
                    <FileText size={13} className="text-white" />
                  </div>
                </div>

                <p className="text-[11.5px] text-gray-400 leading-relaxed line-clamp-2 mb-3">
                  {getExcerpt(t.content)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10.5px] text-gray-400">
                    <Calendar size={10} />
                    {t.createdAt}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreview(t)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                      title="Preview"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      onClick={() => onNavigate('edit-template', t)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-indigo-50 hover:text-indigo-500 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onClick={() => setDeleteId(t.id)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="text-[13px] font-bold text-gray-900">{preview.name}</h3>
                <p className="text-[11px] text-gray-400">Preview with sample data</p>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-lg font-light"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <div className="border border-gray-100 rounded-lg overflow-hidden text-[12px]">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 space-y-0.5">
                  <div className="flex gap-2"><span className="text-gray-400 w-14 shrink-0">From:</span><span>noreply@iceberg.io</span></div>
                  <div className="flex gap-2"><span className="text-gray-400 w-14 shrink-0">Subject:</span>
                    <span className="font-medium">
                      {preview.subject.replace(/\{\{name\}\}/g, 'John Doe').replace(/\{\{company\}\}/g, 'Acme Corp').replace(/\{\{email\}\}/g, 'john@acme.com')}
                    </span>
                  </div>
                </div>
                <div
                  className="px-4 py-3 text-gray-700 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: preview.content
                      .replace(/\{\{name\}\}/g, '<strong>John Doe</strong>')
                      .replace(/\{\{company\}\}/g, '<strong>Acme Corp</strong>')
                      .replace(/\{\{email\}\}/g, 'john@acme.com'),
                  }}
                />
                <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 text-center">
                  <p className="text-[10.5px] text-gray-400">© 2026 Iceberg Marketing Portal · Unsubscribe</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2 justify-end shrink-0">
              <button onClick={() => setPreview(null)} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Close
              </button>
              <button
                onClick={() => { onNavigate('edit-template', preview); setPreview(null); }}
                className="px-3 py-1.5 text-[12px] font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Edit Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 w-full max-w-sm">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-3">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <h3 className="text-[14px] font-bold text-gray-900 mb-1">Delete Template</h3>
            <p className="text-[12.5px] text-gray-500 mb-4">This template will be permanently removed. Are you sure?</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={doDelete} className="px-3 py-1.5 text-[12px] font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
