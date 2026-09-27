import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RoleSelectionView: React.FC = () => {
  const { setCurrentScreen, setSelectedRoleForAuth } = useAuth();

  const handleSelectRole = (role: 'PLAYER' | 'ADMIN') => {
    setSelectedRoleForAuth(role);
    if (role === 'PLAYER') {
      setCurrentScreen('player_login');
    } else {
      setCurrentScreen('admin_login');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-950 text-white select-none">
      {/* Top Header */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-lime-400 font-semibold mb-3">
          <span>Official Tagum City Platform</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-white">
          Welcome to PicklePlay
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          "Play. Compete. Connect."
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="my-auto space-y-4 py-4">
        <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold text-center">
          Select Your Role to Continue
        </p>

        {/* 🏓 PLAYER CARD */}
        <div className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-lime-500/50 overflow-hidden transition-all shadow-lg hover:shadow-lime-500/10 flex flex-col justify-between">
          {/* Place Visual Header */}
          <div className="relative h-20 w-full overflow-hidden bg-slate-950">
            <img
              src="/src/assets/images/pickleplay_login_player_1790514630037.jpg"
              alt="Player Court Action"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            <div className="absolute top-2.5 right-3">
              <span className="text-[10px] text-lime-400 font-bold bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-lime-500/30">
                Compete & Book
              </span>
            </div>
            <div className="absolute bottom-1.5 left-4 flex items-center gap-2">
              <span className="text-xl">🏓</span>
              <h2 className="text-base font-bold text-white font-display">PLAYER</h2>
            </div>
          </div>

          <div className="p-4 pt-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              Reserve courts, join games, and climb the leaderboard.
            </p>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-lime-400" />
              <span>Verified Match Results & Live Rankings</span>
            </div>

            <button
              onClick={() => handleSelectRole('PLAYER')}
              className="mt-3.5 w-full h-10 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-lime-400/15"
            >
              <span>Continue as Player</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 🏢 COURT ADMIN CARD */}
        <div className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 overflow-hidden transition-all shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between">
          {/* Place Visual Header */}
          <div className="relative h-20 w-full overflow-hidden bg-slate-950">
            <img
              src="/src/assets/images/pickleplay_login_admin_1790514646650.jpg"
              alt="Tagum Pickleball Facility Place"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            <div className="absolute top-2.5 right-3">
              <span className="text-[10px] text-amber-400 font-bold bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/30">
                Facility Owner
              </span>
            </div>
            <div className="absolute bottom-1.5 left-4 flex items-center gap-2">
              <span className="text-xl">🏢</span>
              <h2 className="text-base font-bold text-white font-display">COURT ADMIN</h2>
            </div>
          </div>

          <div className="p-4 pt-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              Manage your court, reservations, players, and official match scores.
            </p>
            <div className="mt-2 text-[10px] text-amber-300/80 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              <span>Sole Authorized Scoring Authority</span>
            </div>

            <button
              onClick={() => handleSelectRole('ADMIN')}
              className="mt-3.5 w-full h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-amber-400/15"
            >
              <span>Continue as Admin</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
