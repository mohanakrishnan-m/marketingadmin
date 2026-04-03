import { useState } from 'react';
import { Settings, User, Bell, Mail, Shield, Save, Check } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'email', label: 'Email Config', icon: Mail },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
];

function ToggleSwitch({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div>
        <p className="text-[14px] font-medium text-slate-900">{label}</p>
        <p className="pt-1 text-[12px] leading-5 text-slate-500">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition-all duration-200 ${
          checked
            ? 'border-indigo-500 bg-indigo-500 shadow-[0_8px_18px_rgba(99,102,241,0.25)]'
            : 'border-slate-200 bg-slate-200'
        }`}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_8px_rgba(15,23,42,0.18)] transition-all duration-200 ${
            checked ? 'left-[25px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage({ addToast }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@iceberg.io',
    company: 'Iceberg Marketing',
    phone: '+91 98200 00000',
    timezone: 'Asia/Kolkata',
  });

  const [emailConfig, setEmailConfig] = useState({
    senderName: 'Iceberg Marketing',
    senderEmail: 'noreply@iceberg.io',
    replyTo: 'support@iceberg.io',
    smtpHost: 'smtp.iceberg.io',
    smtpPort: '587',
    footerText: 'Iceberg Marketing Portal 2026. All rights reserved.',
  });

  const [notifs, setNotifs] = useState({
    campaignSent: true,
    clientAdded: true,
    openRateAlert: false,
    weeklyReport: true,
    systemAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: '60',
    loginAlerts: true,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      addToast('Settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const InputField = ({ label, value, onChange, type = 'text', span = 1 }) => (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="app-panel overflow-hidden rounded-[30px]">
        <div className="grid gap-4 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_24%)] p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
              <Settings size={20} />
            </div>
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em] leading-tight text-slate-900 sm:text-[28px]">Portal settings</h2>
              <p className="hidden pt-2 text-[14px] leading-6 text-slate-500 sm:block">
                Configure sender identity, campaign notifications, and access controls for the marketing workspace.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <div className="app-panel rounded-[30px] p-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left ${
                activeTab === id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-white/70'
              }`}
            >
              <Icon size={16} />
              <span className="text-[13px] font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="app-panel overflow-hidden rounded-[30px]">
          {activeTab === 'profile' && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Profile settings</p>
                <p className="text-[12px] text-slate-500">Update the owner details shown across the portal and campaign footer.</p>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <div className="sm:col-span-2 flex items-center gap-4 rounded-[26px] border border-slate-200/80 bg-white/85 p-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-indigo-500 to-violet-500 text-[18px] font-semibold text-white">A</div>
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900">{profile.name}</p>
                    <p className="text-[12px] text-slate-500">{profile.email}</p>
                  </div>
                </div>
                <InputField label="Full Name" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} />
                <InputField label="Email Address" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} type="email" />
                <InputField label="Company Name" value={profile.company} onChange={(v) => setProfile((p) => ({ ...p, company: v }))} />
                <InputField label="Phone Number" value={profile.phone} onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} />
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
                  >
                    {['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'email' && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Email configuration</p>
                <p className="text-[12px] text-slate-500">Control sender identity, reply routing, and SMTP setup.</p>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <InputField label="Sender Name" value={emailConfig.senderName} onChange={(v) => setEmailConfig((e) => ({ ...e, senderName: v }))} />
                <InputField label="Sender Email" value={emailConfig.senderEmail} onChange={(v) => setEmailConfig((e) => ({ ...e, senderEmail: v }))} />
                <InputField label="Reply-To Email" value={emailConfig.replyTo} onChange={(v) => setEmailConfig((e) => ({ ...e, replyTo: v }))} />
                <InputField label="SMTP Host" value={emailConfig.smtpHost} onChange={(v) => setEmailConfig((e) => ({ ...e, smtpHost: v }))} />
                <InputField label="SMTP Port" value={emailConfig.smtpPort} onChange={(v) => setEmailConfig((e) => ({ ...e, smtpPort: v }))} />
                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Footer Text</label>
                  <textarea
                    value={emailConfig.footerText}
                    onChange={(e) => setEmailConfig((cfg) => ({ ...cfg, footerText: e.target.value }))}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Notification preferences</p>
                <p className="text-[12px] text-slate-500">Choose which campaign and system events should trigger alerts.</p>
              </div>
              <div className="p-5 sm:p-6">
                <ToggleSwitch checked={notifs.campaignSent} onChange={(v) => setNotifs((n) => ({ ...n, campaignSent: v }))} label="Campaign sent" desc="Notify when a delivery run finishes successfully." />
                <ToggleSwitch checked={notifs.clientAdded} onChange={(v) => setNotifs((n) => ({ ...n, clientAdded: v }))} label="New client added" desc="Alert the team when a new business is added to the portal." />
                <ToggleSwitch checked={notifs.openRateAlert} onChange={(v) => setNotifs((n) => ({ ...n, openRateAlert: v }))} label="Low open rate alert" desc="Send a notification when opens drop under the expected campaign target." />
                <ToggleSwitch checked={notifs.weeklyReport} onChange={(v) => setNotifs((n) => ({ ...n, weeklyReport: v }))} label="Weekly report" desc="Receive the weekly summary for send volume and audience response." />
                <ToggleSwitch checked={notifs.systemAlerts} onChange={(v) => setNotifs((n) => ({ ...n, systemAlerts: v }))} label="System alerts" desc="Get access, delivery, and security system notices." />
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Security controls</p>
                <p className="text-[12px] text-slate-500">Protect account access and define sign-in session rules.</p>
              </div>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-[26px] border border-slate-200/80 bg-white/85 px-5 py-2">
                  <ToggleSwitch checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} label="Two-factor authentication" desc="Require an extra verification step when signing in." />
                  <ToggleSwitch checked={security.loginAlerts} onChange={(v) => setSecurity((s) => ({ ...s, loginAlerts: v }))} label="Login alerts" desc="Notify this account when a new session starts." />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Session Timeout</label>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
                  >
                    {['15', '30', '60', '120', '240'].map((v) => (
                      <option key={v} value={v}>{v} minutes</option>
                    ))}
                  </select>
                </div>
                <div className="rounded-[26px] border border-slate-200/80 bg-white/85 p-5">
                  <p className="text-[14px] font-semibold text-slate-900">Password update</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <InputField label="Current Password" value={passwords.current} onChange={(v) => setPasswords((p) => ({ ...p, current: v }))} type="password" />
                    <InputField label="New Password" value={passwords.next} onChange={(v) => setPasswords((p) => ({ ...p, next: v }))} type="password" />
                    <InputField label="Confirm Password" value={passwords.confirm} onChange={(v) => setPasswords((p) => ({ ...p, confirm: v }))} type="password" span={2} />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end border-t border-slate-100 px-5 py-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.28)]"
            >
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : saved ? (
                <Check size={15} />
              ) : (
                <Save size={15} />
              )}
              {saved ? 'Saved' : saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
