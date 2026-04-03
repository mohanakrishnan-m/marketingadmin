import { useState, useRef, useEffect } from 'react';
import { FileText, Save, Eye, EyeOff, ArrowLeft, Bold, Italic, Underline, List, Link, AtSign } from 'lucide-react';

const EMPTY_TEMPLATE = { name: '', subject: '', content: '' };

const VARIABLES = ['{{name}}', '{{email}}', '{{company}}'];

function RichEditor({ value, onChange }) {
  const ref = useRef(null);

  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    ref.current?.focus();
    triggerChange();
  };

  const triggerChange = () => {
    setTimeout(() => {
      if (ref.current) onChange(ref.current.innerHTML);
    }, 0);
  };

  const insertVar = (v) => {
    const sel = window.getSelection();
    if (sel.rangeCount) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const node = document.createTextNode(v);
      range.insertNode(node);
      range.setStartAfter(node);
      range.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      ref.current.innerHTML += v;
    }
    triggerChange();
  };

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-indigo-300 transition-colors duration-150">
      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-100">
        {[
          { icon: Bold, cmd: 'bold', title: 'Bold' },
          { icon: Italic, cmd: 'italic', title: 'Italic' },
          { icon: Underline, cmd: 'underline', title: 'Underline' },
        ].map(({ icon: Icon, cmd, title }) => (
          <button
            key={cmd}
            type="button"
            title={title}
            onClick={() => exec(cmd)}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-100"
          >
            <Icon size={13} />
          </button>
        ))}
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button
          type="button"
          title="Bullet List"
          onClick={() => exec('insertUnorderedList')}
          className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-100"
        >
          <List size={13} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <span className="text-[10.5px] font-medium text-gray-400 mr-1 whitespace-nowrap">Insert:</span>
        {VARIABLES.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => insertVar(v)}
            title={`Insert ${v}`}
            className="text-[10.5px] font-mono font-bold px-1.5 py-0.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded transition-colors duration-100 whitespace-nowrap"
          >
            {v}
          </button>
        ))}
      </div>
      {/* Editable area */}
      <div
        ref={ref}
        contentEditable
        onInput={triggerChange}
        className="rich-editor min-h-[200px] px-3 py-2.5 text-[12.5px] text-gray-700 leading-relaxed focus:outline-none"
        style={{ lineHeight: 1.75 }}
        data-placeholder="Write your email content here..."
      />
    </div>
  );
}

function PreviewPane({ subject, content }) {
  const preview = content
    .replace(/\{\{name\}\}/g, '<strong>John Doe</strong>')
    .replace(/\{\{email\}\}/g, 'john@company.com')
    .replace(/\{\{company\}\}/g, '<strong>Acme Corp</strong>');

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <div className="px-4 py-2.5 border-b border-gray-50 flex items-center gap-2">
        <Eye size={13} className="text-gray-400" />
        <span className="text-[12.5px] font-semibold text-gray-700">Live Preview</span>
        <span className="text-[10.5px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-medium ml-auto">Sample data</span>
      </div>
      <div className="p-4">
        {/* Email mock */}
        <div className="border border-gray-100 rounded-lg overflow-hidden text-[12px]">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 w-12 shrink-0 text-[11px]">From:</span>
              <span className="text-gray-600">noreply@iceberg.io</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 w-12 shrink-0 text-[11px]">To:</span>
              <span className="text-gray-600">john@company.com</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-gray-400 w-12 shrink-0 text-[11px]">Subject:</span>
              <span className="text-gray-800 font-medium leading-snug">
                {(subject || 'Your subject line')
                  .replace(/\{\{name\}\}/g, 'John Doe')
                  .replace(/\{\{company\}\}/g, 'Acme Corp')
                  .replace(/\{\{email\}\}/g, 'john@company.com')}
              </span>
            </div>
          </div>
          <div className="px-4 py-3">
            {content ? (
              <div
                className="text-gray-700 leading-relaxed text-[12.5px] prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            ) : (
              <div className="py-6 text-center">
                <p className="text-[12px] text-gray-400">Your email content will appear here</p>
              </div>
            )}
          </div>
          <div className="bg-gray-50 border-t border-gray-100 px-4 py-2.5 text-center">
            <p className="text-[10.5px] text-gray-400">© 2026 Iceberg Marketing Portal · Unsubscribe</p>
          </div>
        </div>
      </div>
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
    if (!form.content || form.content === '<br>') e.content = 'Email content is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setTimeout(() => {
      if (isEdit) {
        setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? { ...form, id: editingTemplate.id } : t)));
        addToast('Template updated', 'success');
      } else {
        setTemplates((prev) => [...prev, { ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] }]);
        addToast('Template saved successfully', 'success');
      }
      setSaving(false);
      onNavigate('view-templates');
    }, 400);
  };

  const setField = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('view-templates')}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={14} />
          </button>
          <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
            <FileText size={14} className="text-emerald-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">{isEdit ? 'Edit Template' : 'Create Template'}</h2>
            <p className="text-[11px] text-gray-400">Supports {VARIABLES.join(', ')} variables</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={`grid gap-4 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-2xl'}`}>
          {/* Editor */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-[12.5px] font-semibold text-gray-700">Template Editor</p>
            </div>
            <div className="p-4 space-y-3.5">
              {/* Template Name */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                  Template Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  placeholder="e.g. Welcome Email"
                  className={`w-full px-3 py-2 text-[12.5px] border rounded-lg transition-all duration-150 focus:border-indigo-300
                    ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                  Subject Line <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setField('subject', e.target.value)}
                  placeholder="e.g. Welcome to {{company}}, {{name}}!"
                  className={`w-full px-3 py-2 text-[12.5px] border rounded-lg transition-all duration-150 focus:border-indigo-300
                    ${errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.subject && <p className="text-[11px] text-red-500 mt-1">{errors.subject}</p>}
              </div>

              {/* Content */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                  Email Content <span className="text-red-400">*</span>
                </label>
                <RichEditor
                  key={isEdit ? editingTemplate?.id : 'new'}
                  value={form.content}
                  onChange={(v) => setField('content', v)}
                />
                {errors.content && <p className="text-[11px] text-red-500 mt-1">{errors.content}</p>}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {saving
                    ? <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Save size={13} />
                  }
                  {isEdit ? 'Update Template' : 'Save Template'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('view-templates')}
                  className="px-4 py-2 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Preview pane */}
          {showPreview && <PreviewPane subject={form.subject} content={form.content} />}
        </div>
      </form>
    </div>
  );
}
