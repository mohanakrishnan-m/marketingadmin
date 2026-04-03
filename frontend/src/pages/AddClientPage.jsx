import { useState, useEffect } from 'react';
import {
  UserPlus, ArrowLeft, Save, Sparkles,
  Building2, Phone, Mail, Briefcase, User, Plus, X,
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const EMPTY = {
  businessName: '', contactName: '', whatsapp: '', email: '', category: '', customCategory: '', categories: [],
};

function sanitizeBusinessName(value) {
  return value.slice(0, 100);
}

function sanitizeContactName(value) {
  return value.slice(0, 100);
}

function sanitizeWhatsapp(value) {
  return value.replace(/\D/g, '').slice(0, 15);
}

function sanitizeEmail(value) {
  const cleaned = value.replace(/[^A-Za-z0-9@._-]/g, '').slice(0, 100);
  const firstAt = cleaned.indexOf('@');
  if (firstAt === -1) return cleaned;
  const beforeAt = cleaned.slice(0, firstAt + 1);
  const afterAt = cleaned.slice(firstAt + 1).replace(/@/g, '');
  return `${beforeAt}${afterAt}`;
}

function InputField({
  label, id, type = 'text', placeholder, value, onChange, error, icon: Icon, inputMode, maxLength,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label} <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        {Icon && <Icon size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          inputMode={inputMode}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full rounded-2xl ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 text-[14px] text-slate-700 shadow-sm ${
            error ? 'border border-red-300 bg-red-50/80' : 'surface-input focus:border-pink-200'
          }`}
        />
      </div>
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

export default function AddClientPage({ clients, setClients, onNavigate, addToast, editingClient }) {
  const isEdit = !!editingClient;
  const [form, setForm] = useState(isEdit ? { ...editingClient } : EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && editingClient) {
      const categoryList = Array.isArray(editingClient.category)
        ? editingClient.category
        : editingClient.category
          ? [editingClient.category]
          : [];
      setForm({
        ...editingClient,
        category: '',
        customCategory: '',
        categories: categoryList,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editingClient, isEdit]);

  const validate = () => {
    const e = {};

    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    else if (form.businessName.length > 100) e.businessName = 'Business name must be 100 characters or less';

    if (!form.contactName.trim()) e.contactName = 'Contact name is required';
    else if (form.contactName.length > 100) e.contactName = 'Contact name must be 100 characters or less';

    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required';
    else if (!/^\d{1,15}$/.test(form.whatsapp)) e.whatsapp = 'WhatsApp number must contain only digits and be at most 15 digits';

    if (!form.email.trim()) e.email = 'Email is required';
    else if (form.email.length > 100) e.email = 'Email address must be 100 characters or less';
    else if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email)) e.email = 'Enter a valid email address';

    if (form.categories.length === 0) e.category = 'Add at least one category';
    else if (form.categories.length > 5) e.category = 'Maximum 5 categories allowed';

    if (form.category === 'Other') {
      if (!form.customCategory.trim()) e.customCategory = 'Enter a custom category';
      else if (form.customCategory.trim().length > 100) e.customCategory = 'Custom category must be 100 characters or less';
    }
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
      const payload = {
        businessName: form.businessName,
        contactName: form.contactName,
        whatsapp: form.whatsapp,
        email: form.email,
        category: form.categories,
      };

      if (isEdit) {
        setClients((prev) => prev.map((c) => (c.id === editingClient.id ? { ...payload, id: editingClient.id } : c)));
        addToast('Client updated successfully', 'success');
      } else {
        setClients((prev) => [...prev, { ...payload, id: Date.now() }]);
        addToast('Client added successfully', 'success');
      }
      setSaving(false);
      onNavigate('all-clients');
    }, 400);
  };

  const updateField = (key, sanitizer) => (e) => {
    const nextValue = sanitizer ? sanitizer(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [key]: nextValue }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const addCategory = () => {
    const baseValue = form.category === 'Other' ? form.customCategory.trim() : form.category.trim();
    if (!baseValue) {
      setErrors((prev) => ({
        ...prev,
        [form.category === 'Other' ? 'customCategory' : 'category']: 'Choose a category to add',
      }));
      return;
    }

    if (form.categories.length >= 5) {
      setErrors((prev) => ({ ...prev, category: 'Maximum 5 categories allowed' }));
      return;
    }

    if (form.categories.some((item) => item.toLowerCase() === baseValue.toLowerCase())) {
      setErrors((prev) => ({ ...prev, category: 'Category already added' }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, baseValue],
      category: '',
      customCategory: '',
    }));
    setErrors((prev) => ({ ...prev, category: '', customCategory: '' }));
  };

  const removeCategory = (categoryToRemove) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item !== categoryToRemove),
    }));
    setErrors((prev) => ({ ...prev, category: '' }));
  };

  return (
    <div className="mx-auto max-w-6xl">
      <form onSubmit={handleSubmit} className="app-panel overflow-hidden rounded-[32px]">
        <div className="border-b border-slate-100/80 px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={() => onNavigate('all-clients')}
                className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:-translate-y-0.5 hover:text-slate-700"
              >
                <ArrowLeft size={16} />
              </button>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-500 via-violet-500 to-indigo-500 text-white shadow-[0_14px_28px_rgba(244,114,182,0.22)]">
                  <UserPlus size={18} strokeWidth={2.2} />
                </div>
                <div>
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-pink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-pink-600">
                    <Sparkles size={12} />
                    Client intake
                  </div>
                  <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[30px]">
                    {isEdit ? 'Edit client' : 'Add client'}
                  </h2>
                  <p className="pt-2 text-[14px] leading-6 text-slate-500">
                    Save the main business and contact details before assigning templates and campaign audiences.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
              <div className="rounded-2xl border border-pink-100 bg-pink-50/50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Status</p>
                <p className="pt-1 text-[14px] font-medium text-slate-700">{isEdit ? 'Editing record' : 'New record'}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Section</p>
                <p className="pt-1 text-[14px] font-medium text-slate-700">Client details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-2">
          <InputField
            label="Business Name"
            id="businessName"
            placeholder="Nova Retail Co."
            value={form.businessName}
            onChange={updateField('businessName', sanitizeBusinessName)}
            error={errors.businessName}
            icon={Building2}
            maxLength={100}
          />
          <InputField
            label="Contact Name"
            id="contactName"
            placeholder="Arjun Mehta"
            value={form.contactName}
            onChange={updateField('contactName', sanitizeContactName)}
            error={errors.contactName}
            icon={User}
            maxLength={100}
          />
          <InputField
            label="WhatsApp Number"
            id="whatsapp"
            type="text"
            placeholder="919820011234"
            value={form.whatsapp}
            onChange={updateField('whatsapp', sanitizeWhatsapp)}
            error={errors.whatsapp}
            icon={Phone}
            inputMode="numeric"
            maxLength={15}
          />
          <InputField
            label="Email Address"
            id="email"
            type="text"
            placeholder="arjun@company.com"
            value={form.email}
            onChange={updateField('email', sanitizeEmail)}
            error={errors.email}
            icon={Mail}
            inputMode="email"
            maxLength={100}
          />
          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="category" className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Categories <span className="text-red-400">*</span>
            </label>
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <div className="relative">
                <Briefcase size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  id="category"
                  value={form.category}
                  onChange={updateField('category')}
                  className={`w-full appearance-none rounded-2xl py-3.5 pl-12 pr-4 text-[14px] text-slate-700 shadow-sm ${
                    errors.category ? 'border border-red-300 bg-red-50/80' : 'surface-input focus:border-pink-200'
                  }`}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={addCategory}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px] font-medium text-slate-700 hover:bg-slate-50"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
            {errors.category && <p className="text-[11px] text-red-500">{errors.category}</p>}
          </div>

          {form.category === 'Other' && (
            <div className="space-y-2 lg:col-span-2">
              <div className="relative">
                <Briefcase size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="customCategory"
                  type="text"
                  value={form.customCategory}
                  onChange={updateField('customCategory', sanitizeBusinessName)}
                  maxLength={100}
                  placeholder="Enter custom category and click Add"
                  className={`w-full rounded-2xl py-3.5 pl-12 pr-4 text-[14px] text-slate-700 shadow-sm ${
                    errors.customCategory ? 'border border-red-300 bg-red-50/80' : 'surface-input focus:border-pink-200'
                  }`}
                />
              </div>
              {errors.customCategory && <p className="text-[11px] text-red-500">{errors.customCategory}</p>}
            </div>
          )}

          <div className="space-y-2 lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              {form.categories.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-2 text-[12px] font-semibold text-violet-700">
                  {item}
                  <button type="button" onClick={() => removeCategory(item)} className="text-violet-500 hover:text-violet-700">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {form.categories.length === 0 && (
                <p className="text-[12px] text-slate-400">Add up to 5 categories for this client.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100/80 px-5 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-7">
          <button
            type="button"
            onClick={() => onNavigate('all-clients')}
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
            {isEdit ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </form>
    </div>
  );
}
