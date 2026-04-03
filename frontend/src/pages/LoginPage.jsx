import { useState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
const technologiesLogo = new URL('../../logo/TECHNOLOGIES.svg', import.meta.url).href;

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@iceberg.io', password: 'admin123' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const result = await onLogin(form);
    setSubmitting(false);
    if (result?.error) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.08),transparent_20%),linear-gradient(180deg,#f8fbff_0%,#f2f5fb_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="hidden rounded-[36px] bg-[linear-gradient(180deg,#0f172a_0%,#151c35_58%,#1e1b4b_100%)] p-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)] lg:block">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-pink-100">
            <img src={technologiesLogo} alt="Technologies logo" className="h-5 w-5 object-contain" />
            Iceberg Marketing Portal
          </div>
          <h1 className="pt-8 text-[42px] font-semibold leading-tight tracking-[-0.04em]">Manage clients, templates, and campaigns from one workspace.</h1>
          <div className="mt-10 grid gap-4">
            {[
              'Track active client records before each campaign send.',
              'Build reusable templates with live previews and sample data.',
              'Review campaign history, opens, and delivery activity.',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-[14px] leading-6 text-slate-200 backdrop-blur-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="app-panel rounded-[36px] p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white p-3 shadow-sm">
              <img src={technologiesLogo} alt="Technologies logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900">Login</p>
              <p className="text-[13px] text-slate-500">Use your portal account to continue.</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="surface-input w-full rounded-2xl px-11 py-3.5 text-[14px] text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Password</label>
              <div className="relative">
                <LockKeyhole size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="surface-input w-full rounded-2xl px-11 py-3.5 text-[14px] text-slate-700"
                />
              </div>
            </div>

            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>}

            <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_18px_34px_rgba(99,102,241,0.26)] disabled:opacity-60">
              {submitting ? 'Signing in...' : 'Login'}
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
