import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, AlertCircle, Building2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginView: React.FC = () => {
  const { setCurrentScreen, loginAsAdmin } = useAuth();
  const [email, setEmail] = useState('admin@pickleplay.demo');
  const [password, setPassword] = useState('Admin123!');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your administrator email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = loginAsAdmin(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-white select-none overflow-y-auto">
      {/* Top Banner Image with Place / Facility Visual */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/pickleplay_login_admin_1790514646650.jpg"
          alt="Tagum Pickleball Facility"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

        {/* Back Button on top of image */}
        <div className="absolute top-3 left-4 z-10">
          <button
            onClick={() => setCurrentScreen('role_select')}
            className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-slate-950/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Roles</span>
          </button>
        </div>

        {/* Place marker badge on image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block mb-1">
              Facility Management Portal
            </span>
            <h1 className="text-xl font-black font-display text-white">Court Admin Login</h1>
          </div>
          <span className="text-2xl select-none">🏢</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-400 -mt-1 mb-2">
          Authorized court managers: Manage court schedules, reservations, and submit official scores.
        </p>

        {/* Form Card */}
        <form onSubmit={handleLogin} className="space-y-3.5 py-1">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Security badge */}
        <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Restricted Portal: Admin Role & Facility Access Enforced</span>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Court Manager Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pickleplay.demo"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-600 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <span className="text-[10px] text-slate-500">Security Clearance Required</span>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm text-white placeholder-slate-600 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all cursor-pointer mt-2"
        >
          <span>Admin Login</span>
        </button>

        {/* Quick Demo Fill Helper */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@pickleplay.demo');
              setPassword('Admin123!');
            }}
            className="text-[11px] text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Use Demo Admin (Coach Dante / Tagum Pickleball Center)</span>
          </button>
        </div>
      </form>

      {/* Bottom Switch to Register Court */}
      <div className="pt-4 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400 mb-2">Are you a new Tagum facility owner?</p>
        <button
          onClick={() => setCurrentScreen('admin_register')}
          className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Register Court Facility</span>
        </button>
      </div>
      </div>
    </div>
  );
};
