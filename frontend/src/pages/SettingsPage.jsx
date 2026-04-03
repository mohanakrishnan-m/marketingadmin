import { useEffect, useState } from 'react';
import { Settings, User, Bell, Shield, Save, Check } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
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

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  span = 1,
  placeholder = '',
}) {
  return (
    <div className={span === 2 ? 'sm:col-span-2' : ''}>
      <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
      />
    </div>
  );
}

export default function SettingsPage({ settings, saveSettings, addToast }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(settings.profile);
  const [notifs, setNotifs] = useState(settings.notifs);
  const [security, setSecurity] = useState(settings.security);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    setProfile(settings.profile);
    setNotifs(settings.notifs);
    setSecurity(settings.security);
  }, [settings]);

  const handleSave = async () => {
    if (passwords.current || passwords.next || passwords.confirm) {
      if (!passwords.current) {
        addToast('Current password is required to change your password.', 'error');
        return;
      }

      if (passwords.next !== passwords.confirm) {
        addToast('New passwords do not match.', 'error');
        return;
      }
    }

    setSaving(true);

    try {
      await saveSettings({
        profile,
        notifs,
        security: {
          ...security,
          sessionTimeout: Number(security.sessionTimeout),
          currentPassword: passwords.current || undefined,
          newPassword: passwords.next || undefined,
        },
      });

      setPasswords({ current: '', next: '', confirm: '' });
      setSaved(true);
      addToast('Settings saved successfully', 'success');
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      addToast(error.message || 'Unable to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

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
                Update your profile, notifications, and account security for the marketing workspace.
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
              type="button"
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
                <p className="text-[12px] text-slate-500">Update the owner details shown across the portal.</p>
              </div>
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <div className="flex items-center gap-4 rounded-[26px] border border-slate-200/80 bg-white/85 p-4 sm:col-span-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-indigo-500 to-violet-500 text-[18px] font-semibold text-white">
                    {(profile.name?.[0] || 'A').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-slate-900">{profile.name}</p>
                    <p className="text-[12px] text-slate-500">{profile.email}</p>
                  </div>
                </div>

                <InputField label="Full Name" value={profile.name} onChange={(value) => setProfile((prev) => ({ ...prev, name: value }))} />
                <InputField label="Email Address" value={profile.email} onChange={(value) => setProfile((prev) => ({ ...prev, email: value }))} type="email" />
                <InputField label="Company Name" value={profile.company} onChange={(value) => setProfile((prev) => ({ ...prev, company: value }))} />
                <InputField label="Phone Number" value={profile.phone} onChange={(value) => setProfile((prev) => ({ ...prev, phone: value }))} />

                <div className="sm:col-span-2">
                  <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(event) => setProfile((prev) => ({ ...prev, timezone: event.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
                  >
                    {['Asia/Kolkata', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'].map((timezone) => (
                      <option key={timezone} value={timezone}>{timezone}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Notifications</p>
                <p className="text-[12px] text-slate-500">Choose which updates should trigger alerts inside the workspace.</p>
              </div>
              <div className="p-5 sm:p-6">
                <ToggleSwitch
                  checked={notifs.campaignSent}
                  onChange={(value) => setNotifs((prev) => ({ ...prev, campaignSent: value }))}
                  label="Campaign sent confirmation"
                  desc="Show a confirmation when a campaign has been processed."
                />
                <ToggleSwitch
                  checked={notifs.clientAdded}
                  onChange={(value) => setNotifs((prev) => ({ ...prev, clientAdded: value }))}
                  label="New client alerts"
                  desc="Notify when a client is added or updated."
                />
                <ToggleSwitch
                  checked={notifs.openRateAlert}
                  onChange={(value) => setNotifs((prev) => ({ ...prev, openRateAlert: value }))}
                  label="Open-rate alerts"
                  desc="Highlight campaigns with unusually high or low engagement."
                />
                <ToggleSwitch
                  checked={notifs.weeklyReport}
                  onChange={(value) => setNotifs((prev) => ({ ...prev, weeklyReport: value }))}
                  label="Weekly summary"
                  desc="Enable the weekly marketing performance digest."
                />
                <ToggleSwitch
                  checked={notifs.systemAlerts}
                  onChange={(value) => setNotifs((prev) => ({ ...prev, systemAlerts: value }))}
                  label="System alerts"
                  desc="Receive warnings about account or delivery issues."
                />
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-[16px] font-semibold text-slate-900">Security</p>
                <p className="text-[12px] text-slate-500">Manage account protection and session behavior.</p>
              </div>
              <div className="space-y-6 p-5 sm:p-6">
                <div className="rounded-[26px] border border-slate-200/80 bg-white/85 p-5">
                  <ToggleSwitch
                    checked={security.twoFactor}
                    onChange={(value) => setSecurity((prev) => ({ ...prev, twoFactor: value }))}
                    label="Two-factor authentication"
                    desc="Require an additional verification step during sign-in."
                  />
                  <ToggleSwitch
                    checked={security.loginAlerts}
                    onChange={(value) => setSecurity((prev) => ({ ...prev, loginAlerts: value }))}
                    label="Login alerts"
                    desc="Notify when your account signs in from a new session."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Session Timeout</label>
                    <select
                      value={String(security.sessionTimeout)}
                      onChange={(event) => setSecurity((prev) => ({ ...prev, sessionTimeout: event.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3.5 text-[14px] text-slate-700"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200/80 bg-white/85 p-5">
                  <p className="text-[14px] font-semibold text-slate-900">Change password</p>
                  <p className="pt-1 text-[12px] text-slate-500">Leave these fields empty if you do not want to change your password.</p>
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <InputField
                      label="Current Password"
                      value={passwords.current}
                      onChange={(value) => setPasswords((prev) => ({ ...prev, current: value }))}
                      type="password"
                    />
                    <div />
                    <InputField
                      label="New Password"
                      value={passwords.next}
                      onChange={(value) => setPasswords((prev) => ({ ...prev, next: value }))}
                      type="password"
                    />
                    <InputField
                      label="Confirm Password"
                      value={passwords.confirm}
                      onChange={(value) => setPasswords((prev) => ({ ...prev, confirm: value }))}
                      type="password"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-5 py-3 text-[13px] font-semibold text-white shadow-[0_18px_34px_rgba(99,102,241,0.26)] disabled:opacity-60"
        >
          {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
