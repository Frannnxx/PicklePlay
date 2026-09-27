import React, { useState } from 'react';
import { ArrowLeft, Building2, User, Mail, Lock, Phone, MapPin, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminRegisterView: React.FC = () => {
  const { setCurrentScreen, registerAdmin } = useAuth();

  const [ownerName, setOwnerName] = useState('');
  const [facilityName, setFacilityName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+63 9');
  const [courtAddress, setCourtAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!ownerName || !facilityName || !email || !phone || !courtAddress || !password) {
      setErrorMessage('Please fill in all required facility credentials.');
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

    const res = registerAdmin({
      ownerName,
      facilityName,
      email,
      phone,
      courtAddress,
      password,
    });

    if (!res.success) {
      setErrorMessage(res.error || 'Court registration failed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none overflow-y-auto">
      {/* Top Banner Image with Place Visual */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-slate-900">
        <img
          src="/src/assets/images/pickleplay_login_admin_1790514646650.jpg"
          alt="Tagum Pickleball Facility"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-black/30" />

        <div className="absolute top-3 left-4 z-10">
          <button
            onClick={() => setCurrentScreen('admin_login')}
            className="inline-flex items-center gap-1.5 text-xs text-white/90 hover:text-white bg-slate-950/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        </div>

        <div className="absolute bottom-2.5 left-4">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
            Authorized Court Venue
          </span>
          <h1 className="text-lg font-black font-display text-white mt-0.5">Register Facility & Admin</h1>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-slate-400 -mt-2 mb-4">
          Authorized court managers in Tagum City can list courts, oversee bookings, and submit verified scores.
        </p>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-3.5 pb-6">
        {/* Owner / Manager Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Owner / Facility Manager Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="e.g. Dante Tagum"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Facility Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Pickleball Court / Facility Name</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder="e.g. Tagum Pickleball Center"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Administrator Work Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. manager@tagumpickleball.ph"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Contact / Inquiry Mobile Number</label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Court Address */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Facility Address in Tagum City</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={courtAddress}
              onChange={(e) => setCourtAddress(e.target.value)}
              placeholder="e.g. Purok 4, Mankilam, Tagum City"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-slate-300">Account Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
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
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-sm text-white placeholder-slate-600 outline-none"
              required
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Scoring Authority:</strong> By registering as Court Admin, you are granted authorization to verify match scores for your facility. Every score confirmation writes an unalterable audit log.
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all cursor-pointer pt-0"
        >
          <span>Complete Facility Registration</span>
        </button>
      </form>
      </div>
    </div>
  );
};
