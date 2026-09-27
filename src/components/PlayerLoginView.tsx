import React, { useState } from 'react';
import { ArrowLeft, Lock, Mail, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PlayerLoginView: React.FC = () => {
  const { setCurrentScreen, loginAsPlayer } = useAuth();
  const [email, setEmail] = useState('player@pickleplay.demo');
  const [password, setPassword] = useState('Player123!');
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');

    if (!email) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const res = loginAsPlayer(email, password);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed.');
    }
  };

  const handleForgotPassword = () => {
    setInfoMessage('Password reset instructions sent to your email (Demo: Use Player123!)');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-950 text-white select-none overflow-y-auto">
      {/* Top Banner Image with Place / Court Visual */}
      <div className="relative h-44 w-full shrink-0 overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/pickleplay_login_player_1790514630037.jpg"
          alt="PicklePlay Tagum City Court"
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
            <span className="text-[10px] font-bold text-lime-400 bg-lime-950/80 border border-lime-500/30 px-2 py-0.5 rounded-full inline-block mb-1">
              Tagum City Courts
            </span>
            <h1 className="text-xl font-black font-display text-white">Player Login</h1>
          </div>
          <span className="text-2xl select-none">🏓</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <p className="text-xs text-slate-400 -mt-1 mb-2">
          Sign in to view your verified rank and book courts across Tagum City.
        </p>

        {/* Form Card */}
        <form onSubmit={handleLogin} className="space-y-3.5 py-1">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {infoMessage && (
          <div className="p-3 rounded-xl bg-lime-950/80 border border-lime-500/50 text-lime-200 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed font-medium">{infoMessage}</div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@pickleplay.demo"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white placeholder-slate-600 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[11px] text-lime-400 hover:text-lime-300 transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm text-white placeholder-slate-600 outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 active:scale-[0.98] transition-all cursor-pointer mt-2"
        >
          <span>Login</span>
        </button>

        {/* Quick Demo Fill Helper */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('player@pickleplay.demo');
              setPassword('Player123!');
            }}
            className="text-[11px] text-slate-400 hover:text-lime-400 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-lime-400" />
            <span>Use Demo Player Account (Francis Pascual)</span>
          </button>
        </div>
      </form>

      {/* Bottom Switch to Register */}
      <div className="pt-4 border-t border-slate-800/80 text-center">
        <p className="text-xs text-slate-400 mb-2">New to PicklePlay in Tagum City?</p>
        <button
          onClick={() => setCurrentScreen('player_register')}
          className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs flex items-center justify-center transition-all cursor-pointer"
        >
          Create Player Account
        </button>
      </div>
      </div>
    </div>
  );
};
