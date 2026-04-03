import { useState } from 'react';
import { FileText, Plus, Pencil, Trash2, Eye, Search, Calendar, MailOpen } from 'lucide-react';

function getExcerpt(html) {
  if (typeof document === 'undefined') return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  const text = div.textContent || div.innerText || '';
  return text.length > 120 ? `${text.slice(0, 120)}...` : text;
}

const COLORS = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-sky-500 to-blue-500',
  'from-orange-500 to-amber-500',
];

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

  return (
    <div className="space-y-5">
      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="grid gap-4 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_24%)] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_12px_28px_rgba(16,185,129,0.24)]">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] leading-tight text-slate-900 sm:text-[28px]">Template library</h2>
              <p className="hidden pt-2 text-[14px] leading-6 text-slate-500 sm:block">
                Review saved email drafts, open previews, and keep reusable messaging ready for promotions, launches, and follow-ups.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('create-template')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)] hover:-translate-y-0.5"
          >
            <Plus size={15} />
            New Template
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name or subject"
            className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-3 pl-11 pr-4 text-[13px] text-slate-700 shadow-sm"
          />
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[12px] text-slate-500">
          {filtered.length} templates in view
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="app-panel rounded-[30px] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FileText size={22} />
          </div>
          <p className="pt-4 text-[16px] font-semibold text-slate-900">No matching templates</p>
          <p className="pt-2 text-[13px] text-slate-500">Try another search or create a new email sequence.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((template, index) => (
            <div key={template.id} className="app-panel overflow-hidden rounded-[30px]">
              <div className={`h-28 bg-gradient-to-r ${COLORS[index % COLORS.length]} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    Email template
                  </span>
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
                    <MailOpen size={18} />
                  </div>
                </div>
                <p className="pt-5 text-[18px] font-semibold tracking-[-0.02em]">{template.name}</p>
              </div>

              <div className="p-5">
                <p className="text-[13px] font-semibold text-slate-900">{template.subject}</p>
                <p className="pt-3 text-[12px] leading-6 text-slate-500">{getExcerpt(template.content)}</p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-400">
                  <Calendar size={12} />
                  Created on {template.createdAt}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button onClick={() => setPreview(template)} className="rounded-2xl border border-slate-200/80 bg-white px-3 py-3 text-[12px] font-medium text-slate-600">Preview</button>
                  <button onClick={() => onNavigate('edit-template', template)} className="rounded-2xl border border-slate-200/80 bg-white px-3 py-3 text-[12px] font-medium text-slate-600">Edit</button>
                  <button onClick={() => setDeleteId(template.id)} className="rounded-2xl border border-red-200 bg-red-50 px-3 py-3 text-[12px] font-medium text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[2px]">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-[17px] font-semibold text-slate-900">{preview.name}</p>
                <p className="text-[12px] text-slate-500">Preview with sample recipient details</p>
              </div>
              <button onClick={() => setPreview(null)} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500">
                ×
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white">
                <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4 text-[12px] text-slate-600">
                  <div>From: noreply@iceberg.io</div>
                  <div className="pt-1">Subject: {preview.subject.replace(/\{\{name\}\}/g, 'John Doe').replace(/\{\{company\}\}/g, 'Acme Corp').replace(/\{\{email\}\}/g, 'john@acme.com')}</div>
                </div>
                <div
                  className="prose prose-sm max-w-none px-5 py-5 text-[14px] leading-7 text-slate-700"
                  dangerouslySetInnerHTML={{
                    __html: preview.content
                      .replace(/\{\{name\}\}/g, '<strong>John Doe</strong>')
                      .replace(/\{\{company\}\}/g, '<strong>Acme Corp</strong>')
                      .replace(/\{\{email\}\}/g, 'john@acme.com'),
                  }}
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setPreview(null)} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[13px] font-medium text-slate-600">
                Close
              </button>
              <button onClick={() => { onNavigate('edit-template', preview); setPreview(null); }} className="rounded-2xl bg-indigo-600 px-4 py-3 text-[13px] font-semibold text-white">
                Edit Template
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-sm rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.18)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Trash2 size={20} />
            </div>
            <h3 className="pt-4 text-[18px] font-semibold text-slate-900">Delete template</h3>
            <p className="pt-2 text-[13px] leading-6 text-slate-500">This removes the draft from your template library and future campaign selection.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[13px] font-medium text-slate-600">Cancel</button>
              <button onClick={doDelete} className="flex-1 rounded-2xl bg-red-500 px-4 py-3 text-[13px] font-semibold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
