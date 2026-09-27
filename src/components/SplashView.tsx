import React from 'react';
import { ArrowRight, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SplashView: React.FC = () => {
  const { setCurrentScreen } = useAuth();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-white select-none relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagum City Marker */}
      <div className="pt-4 flex flex-col items-center text-center">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-lime-400/90 bg-lime-950/60 border border-lime-500/30 px-3 py-1 rounded-full">
          Tagum City Capstone Project
        </span>
      </div>

      {/* Hero Visual & Branding */}
      <div className="my-auto flex flex-col items-center text-center px-2">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-lime-500 to-emerald-400 p-0.5 shadow-2xl shadow-lime-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center relative overflow-hidden">
              {/* Ball lines pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:8px_8px] opacity-25"></div>
              <span className="text-4xl select-none">🏓</span>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700/80 rounded-full p-1.5 shadow-md">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-display uppercase">
          PICKLE<span className="text-lime-400">PLAY</span>
        </h1>
        
        <p className="mt-2 text-base font-semibold text-slate-300 tracking-wide">
          Play. Compete. Connect.
        </p>

        <p className="mt-3 text-xs text-slate-400 max-w-xs leading-relaxed">
          Court Reservation, Verified Player Ranking & Management System for Tagum City
        </p>
      </div>

      {/* Bottom CTA */}
      <div className="pb-6 w-full flex flex-col items-center gap-3">
        <button
          onClick={() => setCurrentScreen('role_select')}
          className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span>Official Scoring</span>
          <span>·</span>
          <span>Real-time Ladder</span>
          <span>·</span>
          <span>Instant Booking</span>
        </div>
      </div>
    </div>
  );
};
