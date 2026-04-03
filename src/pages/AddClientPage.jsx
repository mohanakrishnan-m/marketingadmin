import { useState, useEffect } from 'react';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

const EMPTY = { businessName: '', contactName: '', whatsapp: '', email: '', category: '' };

export default function AddClientPage({ clients, setClients, onNavigate, addToast, editingClient }) {
  const isEdit = !!editingClient;
  const [form, setForm] = useState(isEdit ? { ...editingClient } : EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(isEdit ? { ...editingClient } : EMPTY);
    setErrors({});
  }, [editingClient, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.businessName.trim()) e.businessName = 'Business name is required';
    if (!form.contactName.trim()) e.contactName = 'Contact name is required';
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.category) e.category = 'Select a category';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setTimeout(() => {
      if (isEdit) {
        setClients((prev) => prev.map((c) => (c.id === editingClient.id ? { ...form, id: editingClient.id } : c)));
        addToast('Client updated successfully', 'success');
      } else {
        const newClient = { ...form, id: Date.now() };
        setClients((prev) => [...prev, newClient]);
        addToast('Client added successfully', 'success');
      }
      setSaving(false);
      onNavigate('all-clients');
    }, 400);
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: '' })); },
  });

  const InputField = ({ label, id, type = 'text', placeholder, fieldKey, icon: Icon }) => (
    <div>
      <label htmlFor={id} className="block text-[12px] font-semibold text-gray-700 mb-1">
        {label} <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        {Icon && <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...field(fieldKey)}
          className={`w-full ${Icon ? 'pl-9' : 'pl-3'} pr-3 py-2 text-[12.5px] border rounded-lg transition-all duration-150 focus:border-indigo-300
            ${errors[fieldKey] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:bg-white'}`}
        />
      </div>
      {errors[fieldKey] && <p className="text-[11px] text-red-500 mt-1">{errors[fieldKey]}</p>}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('all-clients')}
          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-100 rounded-lg flex items-center justify-center">
            <UserPlus size={14} className="text-violet-500" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">{isEdit ? 'Edit Client' : 'Add Client'}</h2>
            <p className="text-[11px] text-gray-400">{isEdit ? 'Update client information' : 'Register a new client'}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <p className="text-[12.5px] font-semibold text-gray-700">Client Information</p>
        </div>

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Business Name" id="businessName" placeholder="e.g. Nova Retail Co." fieldKey="businessName" />
          <InputField label="Contact Name" id="contactName" placeholder="e.g. Arjun Mehta" fieldKey="contactName" />
          <InputField label="WhatsApp Number" id="whatsapp" placeholder="+91 98200 11234" fieldKey="whatsapp" />
          <InputField label="Email Address" id="email" type="email" placeholder="arjun@company.com" fieldKey="email" />
          <div className="sm:col-span-2">
            <label htmlFor="category" className="block text-[12px] font-semibold text-gray-700 mb-1">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="category"
              {...field('category')}
              className={`w-full px-3 py-2 text-[12.5px] border rounded-lg transition-all duration-150 focus:border-indigo-300 bg-white appearance-none cursor-pointer
                ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-[11px] text-red-500 mt-1">{errors.category}</p>}
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-gray-50 bg-gray-50/40 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onNavigate('all-clients')}
            className="px-4 py-1.5 text-[12px] font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-[12px] font-medium rounded-lg transition-colors shadow-sm"
          >
            {saving ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={13} />
            )}
            {isEdit ? 'Save Changes' : 'Add Client'}
          </button>
        </div>
      </form>
    </div>
  );
}
