import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FileCode2, Save, Eye, EyeOff, ArrowLeft, Sparkles, LayoutPanelTop,
  Upload, Code2, Wand2, FileText,
} from 'lucide-react';

const EMPTY_TEMPLATE = { name: '', subject: '', content: '' };

function buildPreviewDoc(subject, html) {
  const source = html?.trim() || '';
  if (!source) return '';
  if (/<html[\s>]/i.test(source)) return source;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${subject || 'Email Preview'}</title>
  </head>
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;">
    ${source}
  </body>
</html>`;
}

function HtmlEditor({ value, onChange, onImport }) {
  const fileInputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onImport(String(reader.result || ''));
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
      <div className="surface-input overflow-hidden rounded-[26px] bg-white/90 shadow-sm focus-within:border-pink-200">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-3 py-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-pink-600">
          <Code2 size={13} />
          HTML Editor
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 hover:bg-slate-50"
        >
          <Upload size={14} />
          Upload HTML
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".html,.htm,.txt"
          onChange={handleFile}
          className="hidden"
        />
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder="Paste or write full HTML here..."
        className="min-h-[420px] w-full resize-none border-0 bg-white px-5 py-4 font-mono text-[13px] leading-7 text-slate-700 outline-none"
      />
    </div>
  );
}

function PreviewPane({ subject, content }) {
  const previewDoc = useMemo(() => buildPreviewDoc(subject, content), [subject, content]);

  return (
    <div className="app-panel flex h-full flex-col overflow-hidden rounded-[30px]">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
          <Eye size={18} />
        </div>
        <div>
          <p className="text-[16px] font-semibold tracking-[-0.02em] text-slate-900">Live HTML preview</p>
          <p className="text-[12px] text-slate-500">Render uploaded or pasted HTML exactly as a preview document.</p>
        </div>
      </div>

      <div className="flex-1 p-5">
        <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Subject line</p>
            <p className="pt-1 text-[14px] font-semibold text-slate-900">{subject || 'Email Preview'}</p>
          </div>

          <div className="flex-1 bg-white">
            {previewDoc ? (
              <iframe
                title="Email HTML preview"
                srcDoc={previewDoc}
                className="h-full min-h-[560px] w-full border-0 bg-white"
              />
            ) : (
              <div className="flex h-full min-h-[560px] items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-6 py-6">
                <div className="text-center">
                  <p className="text-[14px] font-medium text-slate-500">HTML preview will appear here</p>
                  <p className="pt-1 text-[12px] text-slate-400">Upload an HTML file or paste HTML code into the editor.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, copy }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Icon size={18} />
      </div>
      <p className="pt-3 text-[14px] font-semibold text-slate-900">{title}</p>
      <p className="pt-1 text-[12px] leading-5 text-slate-500">{copy}</p>
    </div>
  );
}

export default function CreateTemplatePage({ templates, setTemplates, onNavigate, addToast, editingTemplate }) {
  const isEdit = !!editingTemplate;
  const [form, setForm] = useState(isEdit ? { ...editingTemplate } : EMPTY_TEMPLATE);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(isEdit ? { ...editingTemplate } : EMPTY_TEMPLATE);
    setErrors({});
  }, [editingTemplate, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Template name is required';
    if (!form.subject.trim()) e.subject = 'Subject line is required';
    if (!form.content.trim()) e.content = 'HTML content is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setTimeout(() => {
      if (isEdit) {
        setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? { ...form, id: editingTemplate.id } : t)));
        addToast('Template updated', 'success');
        setSaving(false);
        onNavigate('view-templates');
      } else {
        const newTemplateId = Date.now();
        setTemplates((prev) => [...prev, { ...form, id: newTemplateId, createdAt: new Date().toISOString().split('T')[0] }]);
        addToast('Template saved successfully', 'success');
        setSaving(false);
        onNavigate('send-campaign', { templateId: newTemplateId, step: 2 });
      }
    }, 400);
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const importHtml = (html) => {
    setField('content', html);
    addToast('HTML imported into editor', 'success');
  };

  return (
    <div className="min-h-full space-y-5">
      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="grid gap-5 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_24%)] px-5 py-5 sm:px-7 sm:py-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onNavigate('view-templates')}
              className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:-translate-y-0.5 hover:bg-white hover:text-slate-700"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 text-white shadow-[0_14px_28px_rgba(244,114,182,0.22)]">
                <FileCode2 size={18} strokeWidth={2.2} />
              </div>
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-600">
                  <Sparkles size={12} />
                  HTML email editor
                </div>
                <h2 className="text-[22px] font-semibold tracking-[-0.03em] leading-tight text-slate-900 sm:text-[28px]">
                  {isEdit ? 'Edit template' : 'Create template'}
                </h2>
                <p className="hidden pt-1 text-[14px] leading-6 text-slate-500 sm:block">
                  Paste full HTML, upload existing email files, and preview the result directly inside the portal.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
            >
              {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`grid min-h-[calc(100vh-16rem)] gap-5 ${showPreview ? 'xl:grid-cols-[1.12fr_0.88fr]' : 'grid-cols-1'}`}>
          <div className="app-panel flex h-full flex-col overflow-hidden rounded-[30px]">
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                <LayoutPanelTop size={18} />
              </div>
              <div>
                <p className="text-[16px] font-semibold tracking-[-0.02em] text-slate-900">HTML source editor</p>
                <p className="text-[12px] text-slate-500">Upload, paste, edit, and save raw HTML email templates.</p>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
              <div className="grid gap-5">
                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Template Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      placeholder="Promo Email HTML"
                      className={`w-full rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 shadow-sm ${
                        errors.name ? 'border border-red-300 bg-red-50/80' : 'surface-input focus:border-pink-200'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Subject Line <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setField('subject', e.target.value)}
                      placeholder="Weekend offer for your subscribers"
                      className={`w-full rounded-2xl px-4 py-3.5 text-[14px] text-slate-700 shadow-sm ${
                        errors.subject ? 'border border-red-300 bg-red-50/80' : 'surface-input focus:border-pink-200'
                      }`}
                    />
                    {errors.subject && <p className="text-[11px] text-red-500">{errors.subject}</p>}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <InsightCard icon={Upload} title="Upload HTML" copy="Import `.html`, `.htm`, or `.txt` templates directly into the editor." />
                  <InsightCard icon={Code2} title="Raw source" copy="Edit full markup including tables, forms, inline styles, and embeds." />
                  <InsightCard icon={Wand2} title="Live render" copy="Preview the actual HTML output in a real iframe-based preview." />
                </div>

                <div className="space-y-2">
                  <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                    HTML Content <span className="text-red-400">*</span>
                  </label>
                  <HtmlEditor value={form.content} onChange={(v) => setField('content', v)} onImport={importHtml} />
                  {errors.content && <p className="text-[11px] text-red-500">{errors.content}</p>}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('view-templates')}
                  className="rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_18px_34px_rgba(99,102,241,0.26)] disabled:opacity-60"
                >
                  {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={15} />}
                  {isEdit ? 'Update Template' : 'Save Template'}
                </button>
              </div>
            </div>
          </div>

          {showPreview && <PreviewPane subject={form.subject} content={form.content} />}
        </div>
      </form>
    </div>
  );
}
