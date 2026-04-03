import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, LockKeyhole, Mail, User } from 'lucide-react';
const technologiesLogo = new URL('../../logo/TECHNOLOGIES.svg', import.meta.url).href;

export default function SignupPage({ onSignup }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', password: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const result = onSignup(form);
    if (result?.error) setError(result.error);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.12),transparent_26%),linear-gradient(180deg,#f8fbff_0%,#f2f5fb_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.96fr_1.04fr]">
        <div className="app-panel rounded-[36px] p-6 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white p-3 shadow-sm">
              <img src={technologiesLogo} alt="Technologies logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-[24px] font-semibold tracking-[-0.03em] text-slate-900">Create account</p>
              <p className="text-[13px] text-slate-500">Set up a new portal login for your marketing workspace.</p>
            </div>
          </div>

          <form onSubmit={submit} className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Full Name</label>
              <div className="relative">
                <User size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-2xl border border-slate-200/80 bg-white px-11 py-3.5 text-[14px] text-slate-700" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Company</label>
              <div className="relative">
                <Building2 size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="w-full rounded-2xl border border-slate-200/80 bg-white px-11 py-3.5 text-[14px] text-slate-700" />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Email</label>
              <div className="relative">
                <Mail size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-2xl border border-slate-200/80 bg-white px-11 py-3.5 text-[14px] text-slate-700" />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-500">Password</label>
              <div className="relative">
                <LockKeyhole size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full rounded-2xl border border-slate-200/80 bg-white px-11 py-3.5 text-[14px] text-slate-700" />
              </div>
            </div>

            {error && <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">{error}</div>}

            <button type="submit" className="sm:col-span-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500 px-5 py-3.5 text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(217,70,239,0.24)]">
              Create account
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="pt-5 text-[13px] text-slate-500">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Login here</Link>
          </p>
        </div>

        <div className="hidden rounded-[36px] bg-white/75 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.12)] lg:block">
          <div className="inline-flex items-center gap-3 rounded-full bg-pink-50 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-pink-600">
            Portal access
          </div>
          <h1 className="pt-8 text-[40px] font-semibold leading-tight tracking-[-0.04em] text-slate-900">Start with a proper login and keep every route accessible by URL.</h1>
          <div className="mt-10 grid gap-4">
            {[
              'Use direct links for clients, templates, campaigns, and settings.',
              'Keep sign-in and sign-up separate from the protected portal shell.',
              'Make the portal feel like a real product, not a single local demo page.',
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200/80 bg-white/85 px-5 py-4 text-[14px] leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
