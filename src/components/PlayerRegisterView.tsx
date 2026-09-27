import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Phone, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SkillLevel } from '../types';

export const PlayerRegisterView: React.FC = () => {
  const { setCurrentScreen, registerPlayer } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('+63 9');
  const [dateOfBirth, setDateOfBirth] = useState('2001-05-20');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('Intermediate');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password || !phone || !dateOfBirth) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const res = registerPlayer({
      fullName,
      email,
      phone,
      dateOfBirth,
      skillLevel,
      password,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none overflow-y-auto">
      {/* Top Banner Image with Place Visual */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/tagum_court_premier_1790513660497.jpg"
          alt="Tagum Court Premier Arena"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30" />

        <div className="absolute top-3 left-4 z-10">
          <button
            onClick={() => setCurrentScreen('player_login')}
            className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-slate-950/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>

        <div className="absolute bottom-2.5 left-4">
          <span className="text-[10px] font-bold text-lime-400 bg-lime-950/80 px-2 py-0.5 rounded border border-lime-500/30">
            Tagum Pickleball Community
          </span>
          <h1 className="text-lg font-black font-display text-white mt-0.5">Create Player Profile</h1>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-slate-400 -mt-2 mb-4">
          Join the official Tagum City pickleball community and track your verified rank.
        </p>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-3.5 pb-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Full Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Francis Pascual"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. francis@example.com"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Mobile Phone</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Date of Birth</label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 text-sm text-white outline-none"
              required
            />
          </div>
        </div>

        {/* Skill Level Selection */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-300">Self-Assessed Skill Level</label>
          <div className="grid grid-cols-3 gap-2">
            {(['Beginner', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
              <button
                type="button"
                key={lvl}
                onClick={() => setSkillLevel(lvl)}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  skillLevel === lvl
                    ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-md shadow-lime-400/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500">
            Initial ranking points start at 1,000. Verified match results will adjust your ladder rank.
          </p>
        </div>

        {/* Password */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-lime-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
          🔒 <strong>Player Security Rule:</strong> Official scores and ladder ranks are exclusively submitted by accredited court administrators after matches.
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 active:scale-[0.98] transition-all cursor-pointer pt-0"
        >
          <span>Complete Player Registration</span>
        </button>
      </form>
      </div>
    </div>
  );
};
