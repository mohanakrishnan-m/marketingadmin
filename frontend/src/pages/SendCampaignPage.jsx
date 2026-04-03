import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Send, ChevronRight, Check, FileText, Users,
  Rocket, Search, AlertCircle, Sparkles, CalendarClock, MailCheck,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Template', icon: FileText },
  { id: 2, label: 'Recipients', icon: Users },
  { id: 3, label: 'Review', icon: Rocket },
];

function getPrimaryCategory(category) {
  return Array.isArray(category) ? category[0] || 'Uncategorized' : category || 'Uncategorized';
}

function StepBadge({ step, currentStep }) {
  const done = currentStep > step.id;
  const active = currentStep === step.id;
  const Icon = step.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
        done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
      }`}>
        {done ? <Check size={18} /> : <Icon size={18} />}
      </div>
      <div>
        <p className={`text-[13px] font-semibold ${active || done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
        <p className="text-[11px] text-slate-400">Step {step.id}</p>
      </div>
    </div>
  );
}

export default function SendCampaignPage({ clients, templates, sendCampaign, onNavigate, addToast }) {
  const location = useLocation();
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
    setSelectedClients((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelectedClients(selectedClients.length === filteredClients.length ? [] : filteredClients.map((c) => c.id));
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await sendCampaign({
        name: campaignName.trim() || `Campaign - ${template?.name}`,
        templateId: template?.id,
        clientIds: selectedClients,
      });
      setSending(false);
      setSent(true);
      addToast(`Campaign sent to ${selectedClients.length} clients!`, 'success');
    } catch (error) {
      setSending(false);
      addToast(error.message || 'Unable to send campaign.', 'error');
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const templateId = params.get('templateId');
    const nextStep = params.get('step');

    if (templateId && templates.some((item) => String(item.id) === templateId)) {
      setSelectedTemplate(templateId);
    }

    if (nextStep) {
      const parsed = Number(nextStep);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 3) {
        setStep(parsed);
      }
    }
  }, [location.search, templates]);

  if (sent) {
    return (
      <div className="app-panel flex min-h-[70vh] flex-col items-center justify-center rounded-[30px] px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-emerald-50 text-emerald-600">
          <MailCheck size={30} />
        </div>
        <h2 className="pt-5 text-[28px] font-semibold tracking-[-0.03em] text-slate-900">Campaign sent successfully</h2>
        <p className="max-w-lg pt-3 text-[14px] leading-6 text-slate-500">
          Your campaign has been delivered to {selectedClients.length} selected clients and is now available in campaign history for reporting.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => { setStep(1); setSelectedTemplate(''); setSelectedClients([]); setCampaignName(''); setSent(false); }}
            className="rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-[13px] font-medium text-slate-600"
          >
            Launch another campaign
          </button>
          <button
            onClick={() => onNavigate('campaign-history')}
            className="rounded-2xl bg-indigo-600 px-5 py-3 text-[13px] font-semibold text-white"
          >
            Open campaign history
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="grid gap-5 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)] p-5 sm:p-7 xl:grid-cols-[1fr_auto] xl:items-center">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_12px_28px_rgba(99,102,241,0.24)]">
              <Send size={20} />
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-700">
                <Sparkles size={12} />
                Campaign launch
              </div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] leading-tight text-slate-900 sm:text-[28px]">Send campaign</h2>
              <p className="hidden pt-2 text-[14px] leading-6 text-slate-500 sm:block">
                Move from template selection to audience targeting and final review in one guided flow.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((item) => (
              <StepBadge key={item.id} step={item} currentStep={step} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="app-panel overflow-hidden rounded-[30px]">
          {step === 1 && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Choose the campaign message</p>
                <p className="text-[12px] text-slate-500">Pick a saved template and name this send for reporting.</p>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="space-y-2">
                  <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="April retail reminder push"
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
                  />
                </div>
                {templates.length === 0 ? (
                  <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
                    <p className="text-[14px] font-medium text-slate-700">No templates are available yet.</p>
                    <button onClick={() => onNavigate('create-template')} className="mt-3 text-[13px] font-medium text-indigo-600 hover:underline">
                      Create the first campaign template
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {templates.map((t) => (
                      <label
                        key={t.id}
                        className={`cursor-pointer rounded-[26px] border p-4 transition-all ${
                          String(t.id) === String(selectedTemplate)
                            ? 'border-indigo-300 bg-indigo-50/70'
                            : 'border-slate-200/80 bg-white/85 hover:border-indigo-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="template"
                            value={t.id}
                            checked={String(t.id) === String(selectedTemplate)}
                            onChange={() => setSelectedTemplate(String(t.id))}
                            className="mt-1 accent-indigo-600"
                          />
                          <div>
                            <p className="text-[14px] font-semibold text-slate-900">{t.name}</p>
                            <p className="pt-1 text-[12px] text-slate-500">{t.subject}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Select recipients</p>
                <p className="text-[12px] text-slate-500">Search, select, and confirm the businesses included in this send.</p>
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative w-full sm:max-w-sm">
                    <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      placeholder="Search client name or contact"
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/90 py-3 pl-11 pr-4 text-[13px] text-slate-700"
                    />
                  </div>
                  <button onClick={toggleAll} className="rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[12px] font-medium text-slate-600">
                    {selectedClients.length === filteredClients.length ? 'Clear selection' : 'Select all visible'}
                  </button>
                </div>
                <div className="max-h-[460px] space-y-3 overflow-y-auto">
                  {filteredClients.map((client) => {
                    const checked = selectedClients.includes(client.id);
                    return (
                      <label
                        key={client.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-[24px] border px-4 py-4 ${
                          checked ? 'border-indigo-300 bg-indigo-50/70' : 'border-slate-200/80 bg-white/85 hover:border-indigo-200'
                        }`}
                      >
                        <input type="checkbox" checked={checked} onChange={() => toggleClient(client.id)} className="accent-indigo-600" />
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-[13px] font-semibold text-indigo-700">
                          {client.businessName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold text-slate-900">{client.businessName}</p>
                          <p className="truncate text-[12px] text-slate-500">{client.email}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">{getPrimaryCategory(client.category)}</span>
                      </label>
                    );
                  })}
                </div>
                {selectedClients.length === 0 && (
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-medium text-amber-700">
                    <AlertCircle size={14} />
                    Select at least one client to continue.
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Review before delivery</p>
                <p className="text-[12px] text-slate-500">Check the campaign setup before the send begins.</p>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Campaign', value: campaignName || `Campaign - ${template?.name}`, icon: Rocket, tone: 'bg-indigo-50 text-indigo-700' },
                    { label: 'Template', value: template?.name, icon: FileText, tone: 'bg-emerald-50 text-emerald-700' },
                    { label: 'Recipients', value: `${selectedClients.length} clients`, icon: Users, tone: 'bg-blue-50 text-blue-700' },
                  ].map(({ label, value, icon: Icon, tone }) => (
                    <div key={label} className="rounded-[24px] border border-slate-200/80 bg-white/85 p-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone}`}>
                        <Icon size={18} />
                      </div>
                      <p className="pt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                      <p className="pt-1 text-[13px] font-semibold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-[26px] border border-slate-200/80 bg-white">
                  <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-400">Subject line</p>
                    <p className="pt-1 text-[14px] font-semibold text-slate-900">{template?.subject}</p>
                  </div>
                  <div
                    className="prose prose-sm max-w-none px-5 py-5 text-[14px] leading-7 text-slate-700"
                    dangerouslySetInnerHTML={{
                      __html: (template?.content || '')
                        .replace(/\{\{name\}\}/g, '<em>John Doe</em>')
                        .replace(/\{\{company\}\}/g, '<em>Acme Corp</em>')
                        .replace(/\{\{email\}\}/g, '<em>john@acme.com</em>'),
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className={`rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-[13px] font-medium text-slate-600 ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={(step === 1 && !selectedTemplate) || (step === 2 && selectedClients.length === 0)}
                className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-[13px] font-semibold text-white disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)] disabled:opacity-60"
              >
                {sending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    Send Campaign
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-5">
          <div className="app-panel rounded-[30px] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CalendarClock size={18} />
              </div>
              <div>
                <p className="text-[16px] font-semibold text-slate-900">Recommended launch flow</p>
                <p className="text-[12px] text-slate-500">Use the same order for repeatable campaign quality.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {[
                'Pick a template that matches the audience and the current offer.',
                'Select only the client list that should receive this version.',
                'Review the subject line and placeholders before delivery.',
                'Send, then monitor opens and schedule a resend if needed.',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 text-[13px] leading-6 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="app-panel rounded-[30px] p-5 sm:p-6">
            <p className="text-[16px] font-semibold text-slate-900">Current send summary</p>
            <div className="mt-4 space-y-3 text-[13px] text-slate-600">
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3">Selected template: {template?.name || 'Not chosen yet'}</div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3">Recipient count: {selectedClients.length}</div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3">Campaign label: {campaignName || 'Will default to template name'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
