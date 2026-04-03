import { useState } from 'react';
import { Send, ChevronRight, Check, FileText, Users, Rocket, Search, AlertCircle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Select Template', icon: FileText },
  { id: 2, label: 'Select Clients', icon: Users },
  { id: 3, label: 'Review & Send', icon: Rocket },
];

export default function SendCampaignPage({ clients, templates, setCampaigns, onNavigate, addToast }) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedClients, setSelectedClients] = useState([]);
  const [campaignName, setCampaignName] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const template = templates.find((t) => t.id === Number(selectedTemplate));
  const filteredClients = clients.filter(
    (c) =>
      c.businessName.toLowerCase().includes(clientSearch.toLowerCase()) ||
      c.contactName.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const toggleClient = (id) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleAll = () => {
    setSelectedClients(
      selectedClients.length === filteredClients.length ? [] : filteredClients.map((c) => c.id)
    );
  };

  const canStep2 = selectedTemplate !== '';
  const canStep3 = selectedClients.length > 0;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      const newCampaign = {
        id: Date.now(),
        name: campaignName.trim() || `Campaign - ${template?.name}`,
        template: template?.name || '',
        recipients: selectedClients.length,
        sent: selectedClients.length,
        opened: Math.floor(selectedClients.length * (0.5 + Math.random() * 0.35)),
        status: 'Sent',
        sentAt: new Date().toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }),
      };
      setCampaigns((prev) => [...prev, newCampaign]);
      setSending(false);
      setSent(true);
      addToast(`Campaign sent to ${selectedClients.length} clients!`, 'success');
    }, 1800);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
          <Check size={28} className="text-emerald-500" strokeWidth={2.5} />
        </div>
        <div className="text-center">
          <h2 className="text-[16px] font-bold text-gray-900">Campaign Sent!</h2>
          <p className="text-[12.5px] text-gray-500 mt-1">
            Your campaign was sent to <strong>{selectedClients.length}</strong> clients successfully.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setStep(1); setSelectedTemplate(''); setSelectedClients([]); setCampaignName(''); setSent(false); }}
            className="px-4 py-2 text-[12px] font-medium border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Send Another
          </button>
          <button
            onClick={() => onNavigate('campaign-history')}
            className="px-4 py-2 text-[12px] font-medium bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            View History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Send size={14} className="text-indigo-500" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Send Campaign</h2>
          <p className="text-[11px] text-gray-400">Complete all 3 steps to send your campaign</p>
        </div>
      </div>

      {/* Steps progress */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex-1 flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-200
                      ${done ? 'bg-emerald-500' : active ? 'bg-indigo-500' : 'bg-gray-100'}`}
                  >
                    {done
                      ? <Check size={13} className="text-white" strokeWidth={2.5} />
                      : <Icon size={13} className={active ? 'text-white' : 'text-gray-400'} />
                    }
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className={`text-[11.5px] font-semibold leading-none ${active ? 'text-gray-900' : done ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Step {s.id}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${step > s.id ? 'bg-emerald-300' : 'bg-gray-100'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Step 1: Select Template */}
        {step === 1 && (
          <div>
            <div className="px-5 py-3 border-b border-gray-50">
              <p className="text-[13px] font-semibold text-gray-800">Step 1: Select Email Template</p>
              <p className="text-[11.5px] text-gray-400 mt-0.5">Choose a template to use for this campaign</p>
            </div>
            <div className="p-5 space-y-3">
              {/* Campaign name */}
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">Campaign Name <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g. April Promotions"
                  className="w-full px-3 py-2 text-[12.5px] border border-gray-200 rounded-lg focus:border-indigo-300 transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-2">Choose Template <span className="text-red-400">*</span></label>
                {templates.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-[12.5px] text-gray-500">No templates available.</p>
                    <button onClick={() => onNavigate('create-template')} className="mt-2 text-[12px] text-indigo-500 hover:underline">
                      Create a template first →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {templates.map((t) => (
                      <label
                        key={t.id}
                        className={`flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-all duration-150 hover:border-indigo-200 hover:bg-indigo-50/30
                          ${String(t.id) === String(selectedTemplate) ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200'}`}
                      >
                        <input
                          type="radio"
                          name="template"
                          value={t.id}
                          checked={String(t.id) === String(selectedTemplate)}
                          onChange={() => setSelectedTemplate(String(t.id))}
                          className="mt-0.5 accent-indigo-500"
                        />
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-gray-800">{t.name}</p>
                          <p className="text-[11.5px] text-gray-500 truncate">{t.subject}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-50 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!canStep2}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[12px] font-semibold rounded-lg transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Select Clients */}
        {step === 2 && (
          <div>
            <div className="px-5 py-3 border-b border-gray-50">
              <p className="text-[13px] font-semibold text-gray-800">Step 2: Select Recipients</p>
              <p className="text-[11.5px] text-gray-400 mt-0.5">{selectedClients.length} of {clients.length} clients selected</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-xs">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    placeholder="Search clients..."
                    className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-gray-50 border border-gray-200 rounded-lg focus:border-indigo-300 transition-all placeholder:text-gray-400"
                  />
                </div>
                <button
                  onClick={toggleAll}
                  className="text-[12px] font-medium text-indigo-500 hover:text-indigo-700 whitespace-nowrap transition-colors"
                >
                  {selectedClients.length === filteredClients.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50 max-h-[320px] overflow-y-auto">
                {filteredClients.map((c) => {
                  const checked = selectedClients.includes(c.id);
                  return (
                    <label
                      key={c.id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100
                        ${checked ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleClient(c.id)}
                        className="w-3.5 h-3.5 rounded accent-indigo-500"
                      />
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-indigo-600">{c.businessName.charAt(0)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-gray-800 truncate">{c.businessName}</p>
                        <p className="text-[11px] text-gray-400 truncate">{c.email}</p>
                      </div>
                      <span className="text-[10.5px] text-gray-400 shrink-0">{c.category}</span>
                    </label>
                  );
                })}
              </div>

              {selectedClients.length === 0 && (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                  <AlertCircle size={13} />
                  <p className="text-[11.5px] font-medium">Select at least one client to continue</p>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canStep3}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[12px] font-semibold rounded-lg transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Send */}
        {step === 3 && (
          <div>
            <div className="px-5 py-3 border-b border-gray-50">
              <p className="text-[13px] font-semibold text-gray-800">Step 3: Review & Send</p>
              <p className="text-[11.5px] text-gray-400 mt-0.5">Confirm your campaign details before sending</p>
            </div>
            <div className="p-5 space-y-3">
              {/* Summary cards */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Campaign', value: campaignName || `Campaign - ${template?.name}`, icon: Rocket, color: 'bg-indigo-50 text-indigo-600' },
                  { label: 'Template', value: template?.name, icon: FileText, color: 'bg-emerald-50 text-emerald-600' },
                  { label: 'Recipients', value: `${selectedClients.length} clients`, icon: Users, color: 'bg-blue-50 text-blue-600' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className={`w-6 h-6 rounded-md ${color} flex items-center justify-center mb-1.5`}>
                      <Icon size={12} />
                    </div>
                    <p className="text-[10.5px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                    <p className="text-[12.5px] font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>

              {/* Template preview */}
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-[11.5px] font-semibold text-gray-600">Subject: {template?.subject}</p>
                </div>
                <div
                  className="px-4 py-3 text-[12.5px] text-gray-600 leading-relaxed max-h-28 overflow-y-auto prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: (template?.content || '')
                      .replace(/\{\{name\}\}/g, '<em>{{name}}</em>')
                      .replace(/\{\{company\}\}/g, '<em>{{company}}</em>')
                      .replace(/\{\{email\}\}/g, '<em>{{email}}</em>'),
                  }}
                />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <button onClick={() => setStep(2)} className="text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors">
                ← Back
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-1.5 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-[12.5px] font-semibold rounded-lg transition-colors shadow-sm"
              >
                {sending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} strokeWidth={2.2} />
                    Send Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
