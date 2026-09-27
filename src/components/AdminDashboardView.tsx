import React, { useState } from 'react';
import {
  Building2,
  Users,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Activity,
  History,
  TrendingUp,
  Settings,
  ChevronRight,
  User,
  ArrowRight,
  Bell,
} from 'lucide-react';
import { useAuth, AdminTab } from '../context/AuthContext';
import { AdminProfile, MatchRecord } from '../types';
import { NotificationModal } from './NotificationModal';

export const AdminDashboardView: React.FC = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const {
    currentUser,
    adminTab,
    setAdminTab,
    matches,
    leaderboard,
    bookings,
    activityLogs,
    notifications,
    submitOfficialMatchScore,
  } = useAuth();

  const userNotifications = notifications.filter(
    (n) => !n.userId || n.userId === 'all' || (currentUser && n.userId === currentUser.id)
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const admin = (currentUser as AdminProfile) || {
    id: 'admin_tagum_01',
    ownerName: 'Dante "Coach Dan" Tagum',
    facilityName: 'Tagum Pickleball Center',
    courtAddress: 'Purok 4, Mankilam, Tagum City',
    email: 'admin@pickleplay.demo',
    phone: '+63 917 555 8821',
  };

  // State for scoring workflow
  const [activeScoringMatch, setActiveScoringMatch] = useState<MatchRecord | null>(null);
  const [scoreA, setScoreA] = useState<number>(11);
  const [scoreB, setScoreB] = useState<number>(7);
  const [isConfirmingScore, setIsConfirmingScore] = useState<boolean>(false);
  const [scoreSuccessMsg, setScoreSuccessMsg] = useState<string>('');
  const [scoreErrorMsg, setScoreErrorMsg] = useState<string>('');

  const pendingMatches = matches.filter((m) => m.status === 'WAITING_SCORE');
  const completedMatches = matches.filter((m) => m.status === 'VERIFIED');

  const handleOpenScoreModal = (match: MatchRecord) => {
    setActiveScoringMatch(match);
    setScoreA(11);
    setScoreB(7);
    setIsConfirmingScore(false);
    setScoreSuccessMsg('');
    setScoreErrorMsg('');
  };

  const handleConfirmOfficialScore = () => {
    if (!activeScoringMatch) return;
    setScoreErrorMsg('');

    const res = submitOfficialMatchScore(activeScoringMatch.id, scoreA, scoreB);
    if (res.success) {
      setScoreSuccessMsg(
        `Official score recorded! Points updated (+25 / -10) and audit log written.`
      );
      setTimeout(() => {
        setActiveScoringMatch(null);
        setIsConfirmingScore(false);
      }, 1500);
    } else {
      setScoreErrorMsg(res.error || 'Failed to submit score.');
    }
  };

  const currentWinner = scoreA > scoreB ? activeScoringMatch?.playerA : activeScoringMatch?.playerB;
  const currentLoser = scoreA > scoreB ? activeScoringMatch?.playerB : activeScoringMatch?.playerA;

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white min-h-full">
      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* ===================== TAB: DASHBOARD ===================== */}
        {adminTab === 'dashboard' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Facility Place Hero Banner */}
            <div className="relative h-32 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
              <img
                src="/src/assets/images/pickleplay_login_admin_1790514646650.jpg"
                alt={admin.facilityName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute top-2.5 right-3 flex items-center gap-1.5 z-10">
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="p-1.5 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-slate-700/80 text-amber-400 backdrop-blur-md transition-all cursor-pointer relative"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[15px] h-[15px] px-1 rounded-full bg-amber-400 text-slate-950 font-black text-[8px] shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                  Active Facility
                </span>
              </div>
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                <div>
                  <h1 className="text-base font-black font-display text-white">
                    {admin.facilityName}
                  </h1>
                  <p className="text-[11px] text-slate-300">
                    {admin.courtAddress}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Mgr: {admin.ownerName.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Security Audit Badge */}
            <div className="p-2.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Authorized Official Scoring Authority</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">TAGUM SECURE</span>
            </div>

            {/* Facility Summary Metrics (Prompt Section 25) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Metric 1: Total Players with community photo background */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden p-3.5 flex flex-col justify-between shadow-sm">
                <img
                  src="/src/assets/images/tagum_players_community_1790517424546.jpg"
                  alt="Tagum Pickleball Players"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Players</span>
                  <div className="flex -space-x-1.5">
                    <img
                      src="/src/assets/images/podium_player_jico_1790516824327.jpg"
                      alt="Player"
                      className="w-4 h-4 rounded-full object-cover border border-slate-900"
                    />
                    <img
                      src="/src/assets/images/pickleplay_login_player_1790514630037.jpg"
                      alt="Player"
                      className="w-4 h-4 rounded-full object-cover border border-slate-900"
                    />
                    <img
                      src="/src/assets/images/player_avatar_kim_1790516437418.jpg"
                      alt="Player"
                      className="w-4 h-4 rounded-full object-cover border border-slate-900"
                    />
                  </div>
                </div>
                <div className="relative z-10 mt-2">
                  <p className="text-2xl font-black font-display text-white tabular-nums">48</p>
                  <span className="text-[10px] text-lime-400 mt-0.5 block font-medium">+6 new this week</span>
                </div>
              </div>

              {/* Metric 2: Today's Bookings with court photo background */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden p-3.5 flex flex-col justify-between shadow-sm">
                <img
                  src="/src/assets/images/tagum_court_premier_1790513660497.jpg"
                  alt="Today's Court Bookings"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Today's Bookings</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.2 rounded">LIVE</span>
                </div>
                <div className="relative z-10 mt-2">
                  <p className="text-2xl font-black font-display text-white tabular-nums">6</p>
                  <span className="text-[10px] text-slate-300 mt-0.5 block font-medium">Courts 1, 2 & 3</span>
                </div>
              </div>

              {/* Metric 3: Court Utilization with venue photo background */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden p-3.5 flex flex-col justify-between shadow-sm">
                <img
                  src="/src/assets/images/rotary_sports_complex_1790513678036.jpg"
                  alt="Court Utilization"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Utilization</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded">HIGH</span>
                </div>
                <div className="relative z-10 mt-2">
                  <p className="text-2xl font-black font-display text-emerald-400 tabular-nums">75%</p>
                  <span className="text-[10px] text-slate-300 mt-0.5 block font-medium">Peak: 4PM - 9PM</span>
                </div>
              </div>

              {/* Metric 4: Completed Matches with tournament photo background */}
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden p-3.5 flex flex-col justify-between shadow-sm">
                <img
                  src="/src/assets/images/pickleplay_app_hero_1790513641375.jpg"
                  alt="Completed Matches"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Completed</span>
                  <span className="text-[9px] font-bold text-lime-400 bg-lime-950/80 border border-lime-500/30 px-1.5 py-0.2 rounded">AUDITED</span>
                </div>
                <div className="relative z-10 mt-2">
                  <p className="text-2xl font-black font-display text-white tabular-nums">{completedMatches.length + 22}</p>
                  <span className="text-[10px] text-slate-300 mt-0.5 block font-medium">Official records</span>
                </div>
              </div>

              {/* Metric 5: Pending Scores - Attention Required with referee image background */}
              <div className="col-span-2 sm:col-span-2 relative rounded-2xl overflow-hidden border border-amber-500/50 p-4 flex items-center justify-between shadow-lg shadow-amber-950/30">
                <img
                  src="/src/assets/images/admin_scoring_referee_1790517410837.jpg"
                  alt="Official Match Scoring Desk"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-40 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-amber-950/60 pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider bg-amber-950/90 border border-amber-500/40 px-2 py-0.5 rounded-full">
                      Action Required
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <p className="text-2xl font-black font-display text-amber-400 tabular-nums">
                      {pendingMatches.length}
                    </p>
                    <span className="text-xs text-white font-bold">Pending Official Scores</span>
                  </div>
                  <span className="text-[10px] text-slate-300 block mt-0.5">
                    Players are waiting for verified ladder points & ranking
                  </span>
                </div>
                <button
                  onClick={() => setAdminTab('scoring')}
                  className="relative z-10 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-400/30 cursor-pointer shrink-0"
                >
                  Score Now
                </button>
              </div>
            </div>

            {/* Quick Scoring Queue Preview */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Matches Awaiting Score ({pendingMatches.length})
                </h3>
                <button
                  onClick={() => setAdminTab('scoring')}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2">
                {pendingMatches.map((match) => {
                  const avatarA =
                    match.playerA.avatarUrl ||
                    (match.playerA.name.includes('Alex')
                      ? '/src/assets/images/pickleplay_login_player_1790514630037.jpg'
                      : '/src/assets/images/player_avatar_kim_1790516437418.jpg');
                  const avatarB =
                    match.playerB.avatarUrl ||
                    (match.playerB.name.includes('Mark') || match.playerB.name.includes('Daniel')
                      ? '/src/assets/images/player_avatar_daniel_1790516418797.jpg'
                      : '/src/assets/images/podium_player_jico_1790516824327.jpg');

                  const courtThumb = match.courtName.toLowerCase().includes('rotary')
                    ? '/src/assets/images/rotary_sports_complex_1790513678036.jpg'
                    : '/src/assets/images/tagum_court_premier_1790513660497.jpg';

                  return (
                    <div
                      key={match.id}
                      className="relative overflow-hidden p-3 sm:p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 flex items-center justify-between shadow-sm transition-all"
                    >
                      {/* Subtle court backdrop */}
                      <img
                        src={courtThumb}
                        alt={match.courtName}
                        referrerPolicy="no-referrer"
                        className="absolute right-0 top-0 w-44 h-full object-cover opacity-15 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900 to-transparent pointer-events-none" />

                      <div className="relative z-10 flex items-center gap-3">
                        {/* Court thumbnail & Dual Player Avatars */}
                        <div className="relative shrink-0 flex items-center">
                          <img
                            src={courtThumb}
                            alt="Court Venue"
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-sm"
                          />
                          <div className="absolute -bottom-1 -right-1 flex -space-x-1.5 bg-slate-950/80 rounded-full p-0.5">
                            <img
                              src={avatarA}
                              alt={match.playerA.name}
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded-full object-cover border border-slate-900"
                            />
                            <img
                              src={avatarB}
                              alt={match.playerB.name}
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded-full object-cover border border-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-white">
                              {match.playerA.name.split(' ')[0]} vs. {match.playerB.name.split(' ')[0]}
                            </span>
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 border border-amber-500/40 px-1.5 py-0.2 rounded font-bold">
                              {match.matchNumber}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1.5 font-medium">
                            <span className="text-lime-400">{match.courtName}</span>
                            <span>·</span>
                            <span className="text-slate-400">{match.time}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenScoreModal(match)}
                        className="relative z-10 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/20 cursor-pointer shrink-0"
                      >
                        Enter Score
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity Log Preview (Prompt Section 29) */}
            <div className="space-y-2 pt-2">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-lime-400" />
                <span>Audit & Activity Trail</span>
              </h3>

              <div className="space-y-2">
                {activityLogs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-amber-400">{log.action}</span>
                      <span className="text-slate-500">{log.createdAt.split('T')[0] || log.createdAt}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{log.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: SCORING (PROMPT SECTIONS 13, 14, 15, 16, 26) ===================== */}
        {adminTab === 'scoring' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Official Match Verification
              </span>
              <h1 className="text-xl font-black font-display text-white">Match Scoring</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Sole authorized scoring gateway. Submitted scores automatically compute ladder rankings.
              </p>
            </div>

            {/* Pending Matches Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Pending Scores ({pendingMatches.length})
                </h3>
              </div>

              {pendingMatches.length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  All matches are up to date. No pending scores awaiting verification.
                </div>
              ) : (
                pendingMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded">
                          {m.matchNumber}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">
                          {m.playerA.name} <span className="text-slate-400">vs</span> {m.playerB.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {m.courtName} · {m.date} ({m.time})
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30">
                        Waiting for Score
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] text-slate-400">
                        Ranks: #{m.playerA.rank} vs #{m.playerB.rank}
                      </span>
                      <button
                        onClick={() => handleOpenScoreModal(m)}
                        className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/20 cursor-pointer"
                      >
                        Enter Score
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Completed Verified Matches */}
            <div className="space-y-2.5 pt-3">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Completed & Verified Matches ({completedMatches.length})
              </h3>

              <div className="space-y-2">
                {completedMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{m.matchNumber}</span>
                        <span className="text-[10px] text-slate-500">· {m.courtName}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        <strong className="text-emerald-400 font-semibold">
                          {m.winnerId === m.playerA.id ? m.playerA.name : m.playerB.name}
                        </strong>{' '}
                        def. {m.loserId === m.playerA.id ? m.playerA.name : m.playerB.name}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Verified by {m.verifiedByAdminName}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white font-mono tabular-nums">
                        {m.scoreA} - {m.scoreB}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Official Result ✓</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: BOOKINGS ===================== */}
        {adminTab === 'bookings' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Court Schedules
              </span>
              <h1 className="text-xl font-black font-display text-white">Facility Bookings</h1>
            </div>

            <div className="space-y-2.5">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-white">{b.courtName}</span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Booked by: <strong className="text-slate-200">{b.playerName}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">Contact: {b.playerPhone}</p>
                    </div>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-300">
                      {b.date} · {b.startTime} - {b.endTime}
                    </span>
                    <span className="font-bold text-amber-400 font-mono">₱{b.totalPrice}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: PLAYERS & RANKINGS ===================== */}
        {adminTab === 'players' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Official Roster
              </span>
              <h1 className="text-xl font-black font-display text-white">Registered Players</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Fairness Rule: Rankings are calculated from match results and cannot be edited manually.
              </p>
            </div>

            <div className="space-y-2">
              {leaderboard.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 text-center font-display font-black text-sm text-amber-400 tabular-nums">
                      #{p.rank}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{p.fullName}</h4>
                      <p className="text-[10px] text-slate-400">
                        {p.skillLevel} · {p.wins} Wins · {p.losses} Losses
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-lime-400 font-display tabular-nums block">
                      {p.rankingPoints.toLocaleString()} pts
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{p.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: PROFILE ===================== */}
        {adminTab === 'profile' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="text-center pt-2">
              <div className="w-20 h-20 rounded-2xl bg-slate-800 border-2 border-amber-400 mx-auto flex items-center justify-center text-3xl font-display font-black text-amber-400 shadow-xl">
                🏢
              </div>
              <h2 className="text-lg font-bold text-white mt-3">{admin.facilityName}</h2>
              <span className="text-xs text-amber-400 font-semibold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 inline-block mt-1">
                Authorized Court Facility
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Owner / Manager</span>
                <span className="font-bold text-white">{admin.ownerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Facility Address</span>
                <span className="font-semibold text-slate-200">{admin.courtAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Email</span>
                <span className="font-mono text-slate-300">{admin.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Mobile Hotline</span>
                <span className="font-mono text-slate-300">{admin.phone}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
              ⚖️ <strong>Audit Trail Notice:</strong> Every score recorded by this account writes a cryptographically signed activity log in the Tagum City Pickleball Ledger.
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL: ENTER OFFICIAL SCORE (PROMPT SECTIONS 14 & 15) ===================== */}
      {activeScoringMatch && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-5 space-y-4 shadow-2xl animate-scaleUp">
            {!isConfirmingScore ? (
              /* Step 1: Input Score */
              <>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">
                      {activeScoringMatch.matchNumber}
                    </span>
                    <h3 className="text-base font-black font-display text-white">Enter Official Match Score</h3>
                  </div>
                  <button
                    onClick={() => setActiveScoringMatch(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div><strong>Court:</strong> {activeScoringMatch.courtName}</div>
                  <div><strong>Schedule:</strong> {activeScoringMatch.date} at {activeScoringMatch.time}</div>
                </div>

                {/* Score Input Fields */}
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Player A: {activeScoringMatch.playerA.name}
                      </span>
                      <span className="text-[10px] text-slate-400">Rank #{activeScoringMatch.playerA.rank}</span>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={scoreA}
                        onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
                        className="w-full h-11 text-center font-display font-black text-xl bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 tabular-nums"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Player B: {activeScoringMatch.playerB.name}
                      </span>
                      <span className="text-[10px] text-slate-400">Rank #{activeScoringMatch.playerB.rank}</span>
                    </div>
                    <div className="w-20">
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={scoreB}
                        onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
                        className="w-full h-11 text-center font-display font-black text-xl bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-amber-400 tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {scoreA === scoreB && (
                  <p className="text-[11px] text-rose-400 text-center">
                    Pickleball matches cannot end in a draw. Please input winning score.
                  </p>
                )}

                <button
                  disabled={scoreA === scoreB}
                  onClick={() => setIsConfirmingScore(true)}
                  className="w-full h-12 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Submit Official Result</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              /* Step 2: Verification (Prompt Section 15) */
              <>
                <div className="text-center pb-2 border-b border-slate-800">
                  <span className="text-2xl mb-1 inline-block">⚖️</span>
                  <h3 className="text-base font-black font-display text-white">Score Verification</h3>
                  <p className="text-xs text-amber-400 mt-1 font-semibold">
                    Are you sure this score is correct?
                  </p>
                </div>

                {scoreErrorMsg && (
                  <div className="p-2.5 rounded-xl bg-rose-950 text-rose-300 text-xs">
                    {scoreErrorMsg}
                  </div>
                )}

                {scoreSuccessMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-semibold">
                    {scoreSuccessMsg}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <div className="flex items-center justify-around font-display font-black text-2xl tabular-nums">
                    <div>
                      <span className="text-xs text-slate-400 font-normal block font-sans">
                        {activeScoringMatch.playerA.name}
                      </span>
                      <span className={scoreA > scoreB ? 'text-lime-400' : 'text-slate-400'}>{scoreA}</span>
                    </div>
                    <span className="text-slate-600">-</span>
                    <div>
                      <span className="text-xs text-slate-400 font-normal block font-sans">
                        {activeScoringMatch.playerB.name}
                      </span>
                      <span className={scoreB > scoreA ? 'text-lime-400' : 'text-slate-400'}>{scoreB}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Winner: </span>
                    <strong className="text-lime-400 font-bold">{currentWinner?.name}</strong>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Calculated: Winner receives <strong>+25 pts</strong> · Loser receives <strong>-10 pts</strong>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleConfirmOfficialScore}
                    className="w-full h-12 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-lime-400/20 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Official Result</span>
                  </button>

                  <button
                    onClick={() => setIsConfirmingScore(false)}
                    className="w-full h-9 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                  >
                    Edit Score
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===================== FIXED MOBILE BOTTOM TAB BAR FOR ADMIN ===================== */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 z-30 px-2 py-1">
        <div className="grid grid-cols-5 items-center h-14">
          <button
            onClick={() => setAdminTab('dashboard')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              adminTab === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] mt-1">Dashboard</span>
          </button>

          <button
            onClick={() => setAdminTab('bookings')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              adminTab === 'bookings' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-1">Bookings</span>
          </button>

          <button
            onClick={() => setAdminTab('scoring')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer relative ${
              adminTab === 'scoring' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-5 h-5" />
            <span className="text-[10px] mt-1">Scoring</span>
            {pendingMatches.length > 0 && (
              <span className="absolute top-2 right-4 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-950"></span>
            )}
          </button>

          <button
            onClick={() => setAdminTab('players')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              adminTab === 'players' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-1">Players</span>
          </button>

          <button
            onClick={() => setAdminTab('profile')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              adminTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1">Profile</span>
          </button>
        </div>
      </nav>

      {/* In-app Notification Modal */}
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </div>
  );
};
