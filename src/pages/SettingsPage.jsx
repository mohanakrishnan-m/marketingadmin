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
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-[12.5px] font-medium text-gray-800">{label}</p>
        {desc && <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ml-4 mt-0.5 ${checked ? 'bg-indigo-500' : 'bg-gray-200'}`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
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
    footerText: '© 2026 Iceberg Marketing Portal. All rights reserved.',
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

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      addToast('Settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2000);
    }, 600);
  };

  const InputField = ({ label, value, onChange, type = 'text', placeholder, span = 1 }) => (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <label className="block text-[12px] font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-[12.5px] border border-gray-200 rounded-lg focus:border-indigo-300 transition-all duration-150 bg-white"
      />
    </div>
  );

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center">
          <Settings size={14} className="text-gray-500" />
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-gray-900">Settings</h2>
          <p className="text-[11px] text-gray-400">Manage your account and portal preferences</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Tab sidebar */}
        <div className="w-40 shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-1.5 space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors duration-150
                  ${activeTab === id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
              >
                <Icon size={13} className={activeTab === id ? 'text-indigo-500' : 'text-gray-400'} />
                <span className="text-[12px] font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Profile */}
            {activeTab === 'profile' && (
              <>
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[13px] font-semibold text-gray-800">Profile Settings</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">Update your personal and company information</p>
                </div>
                <div className="p-5 space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shrink-0">
                      <span className="text-[16px] font-bold text-white">A</span>
                    </div>
                    <div>
                      <p className="text-[12.5px] font-semibold text-gray-800">{profile.name}</p>
                      <p className="text-[11px] text-gray-400">{profile.email}</p>
                    </div>
                    <button className="ml-auto text-[11.5px] text-indigo-500 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                      Change Photo
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Full Name" value={profile.name} onChange={(v) => setProfile((p) => ({ ...p, name: v }))} placeholder="Admin User" />
                    <InputField label="Email Address" value={profile.email} onChange={(v) => setProfile((p) => ({ ...p, email: v }))} type="email" placeholder="admin@iceberg.io" />
                    <InputField label="Company Name" value={profile.company} onChange={(v) => setProfile((p) => ({ ...p, company: v }))} placeholder="Iceberg Marketing" />
                    <InputField label="Phone Number" value={profile.phone} onChange={(v) => setProfile((p) => ({ ...p, phone: v }))} placeholder="+91 98200 00000" />
                    <div className="sm:col-span-2">
                      <label className="block text-[12px] font-semibold text-gray-700 mb-1">Timezone</label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                        className="w-full px-3 py-2 text-[12.5px] border border-gray-200 rounded-lg focus:border-indigo-300 transition-all bg-white"
                      >
                        {['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map((tz) => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email Config */}
            {activeTab === 'email' && (
              <>
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[13px] font-semibold text-gray-800">Email Configuration</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">Configure sender details and SMTP settings</p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Sender Name" value={emailConfig.senderName} onChange={(v) => setEmailConfig((e) => ({ ...e, senderName: v }))} placeholder="Company Name" />
                    <InputField label="Sender Email" value={emailConfig.senderEmail} onChange={(v) => setEmailConfig((e) => ({ ...e, senderEmail: v }))} placeholder="noreply@company.com" />
                    <InputField label="Reply-To Email" value={emailConfig.replyTo} onChange={(v) => setEmailConfig((e) => ({ ...e, replyTo: v }))} placeholder="support@company.com" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <InputField label="SMTP Host" value={emailConfig.smtpHost} onChange={(v) => setEmailConfig((e) => ({ ...e, smtpHost: v }))} placeholder="smtp.company.com" />
                      </div>
                      <InputField label="Port" value={emailConfig.smtpPort} onChange={(v) => setEmailConfig((e) => ({ ...e, smtpPort: v }))} placeholder="587" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">Email Footer Text</label>
                    <textarea
                      value={emailConfig.footerText}
                      onChange={(e) => setEmailConfig((cfg) => ({ ...cfg, footerText: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 text-[12.5px] border border-gray-200 rounded-lg focus:border-indigo-300 transition-all resize-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <>
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[13px] font-semibold text-gray-800">Notification Preferences</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">Choose what you want to be notified about</p>
                </div>
                <div className="px-5 py-3">
                  <ToggleSwitch checked={notifs.campaignSent} onChange={(v) => setNotifs((n) => ({ ...n, campaignSent: v }))} label="Campaign Sent" desc="Get notified when a campaign is delivered" />
                  <ToggleSwitch checked={notifs.clientAdded} onChange={(v) => setNotifs((n) => ({ ...n, clientAdded: v }))} label="New Client Added" desc="Alert when a new client is registered" />
                  <ToggleSwitch checked={notifs.openRateAlert} onChange={(v) => setNotifs((n) => ({ ...n, openRateAlert: v }))} label="Low Open Rate Alert" desc="Notify when open rate drops below 20%" />
                  <ToggleSwitch checked={notifs.weeklyReport} onChange={(v) => setNotifs((n) => ({ ...n, weeklyReport: v }))} label="Weekly Report" desc="Receive a weekly campaign performance summary" />
                  <ToggleSwitch checked={notifs.systemAlerts} onChange={(v) => setNotifs((n) => ({ ...n, systemAlerts: v }))} label="System Alerts" desc="Important system and security notifications" />
                </div>
              </>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <>
                <div className="px-5 py-3.5 border-b border-gray-50">
                  <p className="text-[13px] font-semibold text-gray-800">Security Settings</p>
                  <p className="text-[11.5px] text-gray-400 mt-0.5">Manage authentication and access control</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                    <ToggleSwitch checked={security.twoFactor} onChange={(v) => setSecurity((s) => ({ ...s, twoFactor: v }))} label="Two-Factor Authentication" desc="Add an extra layer of security to your account" />
                    <ToggleSwitch checked={security.loginAlerts} onChange={(v) => setSecurity((s) => ({ ...s, loginAlerts: v }))} label="Login Alerts" desc="Get notified of new sign-ins to your account" />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">Session Timeout (minutes)</label>
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}
                      className="w-full px-3 py-2 text-[12.5px] border border-gray-200 rounded-lg focus:border-indigo-300 bg-white"
                    >
                      {['15', '30', '60', '120', '240'].map((v) => (
                        <option key={v} value={v}>{v} minutes</option>
                      ))}
                    </select>
                  </div>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-[12.5px] font-semibold text-gray-700 mb-2">Change Password</p>
                    <div className="space-y-2.5">
                      {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                        <div key={label}>
                          <label className="block text-[12px] text-gray-600 mb-1">{label}</label>
                          <input type="password" placeholder="••••••••" className="w-full px-3 py-2 text-[12.5px] border border-gray-200 rounded-lg focus:border-indigo-300 transition-all max-w-xs" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Save button */}
            <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/40 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-[12px] font-semibold rounded-lg transition-colors shadow-sm"
              >
                {saving ? (
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : saved ? (
                  <Check size={13} />
                ) : (
                  <Save size={13} />
                )}
                {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
