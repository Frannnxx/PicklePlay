import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Users,
  CheckCircle2,
  ChevronRight,
  Shield,
  Activity,
  Plus,
  Compass,
  Award,
  BookOpen,
  User,
  Search,
  Filter,
  Bell,
} from 'lucide-react';
import { useAuth, PlayerTab } from '../context/AuthContext';
import { PlayerProfile } from '../types';
import { NotificationModal } from './NotificationModal';

export const PlayerDashboardView: React.FC = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const {
    currentUser,
    playerTab,
    setPlayerTab,
    leaderboard,
    courts,
    matches,
    rankingHistory,
    bookings,
    openGames,
    notifications,
    createBooking,
    cancelBooking,
    joinOpenGame,
  } = useAuth();

  const userNotifications = notifications.filter(
    (n) => !n.userId || n.userId === 'all' || (currentUser && n.userId === currentUser.id)
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const player = (currentUser as PlayerProfile) || {
    id: 'player_francis_12',
    fullName: 'Francis Pascual',
    rank: 12,
    rankingPoints: 1250,
    weeklyChange: 35,
    wins: 18,
    losses: 4,
    winRate: 81.8,
    currentStreak: 4,
    skillLevel: 'Advanced',
    phone: '+63 928 444 1928',
    email: 'player@pickleplay.demo',
  };

  // Find next rank target
  const targetRankNumber = Math.max(1, player.rank - 1);
  const nextRankPlayer = leaderboard.find((p) => p.rank === targetRankNumber);
  const nextTargetPoints = nextRankPlayer ? nextRankPlayer.rankingPoints : player.rankingPoints + 50;
  const pointsNeeded = Math.max(0, nextTargetPoints - player.rankingPoints);
  const progressPercent = Math.min(100, Math.max(10, Math.round(((player.rankingPoints - 1000) / (nextTargetPoints - 1000 || 1)) * 100)));

  // Selected Court for booking modal
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState<string>('06:00 PM');
  const [bookingDate, setBookingDate] = useState<string>('2026-10-01');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string>('');
  const [bookingErrorMsg, setBookingErrorMsg] = useState<string>('');

  // Search in leaderboard
  const [searchQuery, setSearchQuery] = useState('');

  const handleBookingSubmit = (courtId: string) => {
    setBookingSuccessMsg('');
    setBookingErrorMsg('');
    const res = createBooking(courtId, bookingDate, bookingTime, `${parseInt(bookingTime) + 1}:00 PM`);
    if (res.success) {
      setBookingSuccessMsg(`Court booked successfully for ${bookingDate} at ${bookingTime}!`);
      setTimeout(() => setSelectedCourtId(null), 1400);
    } else {
      setBookingErrorMsg(res.error || 'Failed to book.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white min-h-full">
      {/* Scrollable Main Body */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* ===================== TAB: HOME ===================== */}
        {playerTab === 'home' && (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-[11px] font-semibold text-lime-400 tracking-wider uppercase">
                  Tagum City Pickleball Ladder
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                  Good morning, {player.fullName.split(' ')[0]} 👋
                </h1>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="relative p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-lime-500/50 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-lime-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-lime-400 text-slate-950 font-black text-[9px] shadow-sm ring-2 ring-slate-950">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <div className="relative">
                  <img
                    src={player.avatarUrl || '/src/assets/images/pickleplay_login_player_1790514630037.jpg'}
                    alt={player.fullName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-lime-400 shadow-md shadow-lime-400/20"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-400 border-2 border-slate-950 rounded-full"></span>
                </div>
              </div>
            </div>

            {/* Motivational Banner / Security Note */}
            <div className="relative overflow-hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 shadow-sm">
              <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
                <img
                  src="/src/assets/images/tagum_court_premier_1790513660497.jpg"
                  alt="Tagum Court"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-lime-950/90 border border-lime-500/40 flex items-center justify-center">
                  <Shield className="w-3 h-3 text-lime-400 shrink-0" />
                </div>
                <span>Verified Match Results · Read-Only Player Ledger</span>
              </div>
              <span className="relative z-10 text-[10px] text-slate-400 font-mono bg-slate-950/70 border border-slate-800 px-1.5 py-0.5 rounded">Anti-Bias v1.0</span>
            </div>

            {/* 🏆 PLAYER RANKING CARD (Prompt Section 9 & 10) */}
            <div className="relative rounded-3xl bg-slate-900 border border-lime-500/40 p-5 shadow-2xl shadow-lime-950/30 overflow-hidden">
              {/* Background Court Texture / Picture */}
              <img
                src="/src/assets/images/pickleplay_app_hero_1790513641375.jpg"
                alt="Tagum Pickleball Arena"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center opacity-25 mix-blend-luminosity pointer-events-none scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40 pointer-events-none" />
              <div className="absolute top-0 right-0 w-44 h-44 bg-lime-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3.5">
                    {/* Player Avatar Photo */}
                    <div className="relative shrink-0">
                      <img
                        src="/src/assets/images/pickleplay_login_player_1790514630037.jpg"
                        alt={player.fullName}
                        referrerPolicy="no-referrer"
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-lime-400 shadow-lg shadow-lime-400/25"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-slate-950 text-lime-400 border border-lime-500/50 rounded-full px-1.5 py-0.2 text-[9px] font-black">
                        PRO
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                        YOUR CURRENT STANDING
                      </span>
                      <div className="flex items-baseline gap-2.5 mt-0.5">
                        <span className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
                          #{player.rank}
                        </span>
                        <div>
                          <div className="text-lg font-bold font-display text-lime-400 tabular-nums">
                            {player.rankingPoints.toLocaleString()} <span className="text-xs text-lime-300/80 font-normal">pts</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>+{player.weeklyChange} this week</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm backdrop-blur-md">
                      <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{player.currentStreak} Streak</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium">Tagum Div 1</span>
                  </div>
                </div>

                {/* Progress to Next Rank (Prompt Section 11) */}
                <div className="mt-4 pt-3.5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 text-[11px]">
                      <span>You're {pointsNeeded > 0 ? pointsNeeded : 50} pts away from Rank #{targetRankNumber}</span>
                      <span className="text-amber-400">🔥</span>
                    </span>
                    <span className="text-[11px] font-mono text-lime-400 tabular-nums font-bold">
                      {player.rankingPoints} / {nextTargetPoints}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-950/80 border border-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-lime-500 via-lime-400 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-sm shadow-lime-400/50"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 font-medium">
                    <span className="text-emerald-400 font-semibold">+25 pts / Win</span>
                    <span>Target: {nextRankPlayer ? nextRankPlayer.fullName : 'Top 10'}</span>
                    <span className="text-rose-400 font-semibold">-10 pts / Loss</span>
                  </div>
                </div>

                {/* Player Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-800/80 text-center">
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Wins</span>
                    <p className="text-base font-bold text-white font-display tabular-nums mt-0.5">{player.wins}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Losses</span>
                    <p className="text-base font-bold text-slate-300 font-display tabular-nums mt-0.5">{player.losses}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-sm">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Win Rate</span>
                    <p className="text-base font-bold text-lime-400 font-display tabular-nums mt-0.5">{player.winRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons with visual picture backdrops */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPlayerTab('courts')}
                className="relative h-28 rounded-2xl border border-slate-800 hover:border-lime-500/50 overflow-hidden text-left transition-all p-3 flex flex-col justify-between group cursor-pointer shadow-md"
              >
                <img
                  src="/src/assets/images/tagum_court_premier_1790513660497.jpg"
                  alt="Reserve Court"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

                <div className="relative z-10 w-7 h-7 rounded-lg bg-lime-950/80 border border-lime-500/40 text-lime-400 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-white group-hover:text-lime-300 block">
                    Reserve Court
                  </span>
                  <span className="text-[10px] text-lime-400 font-medium">From ₱150/hr</span>
                </div>
              </button>

              <button
                onClick={() => setPlayerTab('rankings')}
                className="relative h-28 rounded-2xl border border-slate-800 hover:border-amber-500/50 overflow-hidden text-left transition-all p-3 flex flex-col justify-between group cursor-pointer shadow-md"
              >
                <img
                  src="/src/assets/images/pickleplay_login_player_1790514630037.jpg"
                  alt="Leaderboard"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

                <div className="relative z-10 w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Trophy className="w-3.5 h-3.5" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-white group-hover:text-amber-300 block">
                    Leaderboard
                  </span>
                  <span className="text-[10px] text-amber-400 font-medium">Tagum Top 20</span>
                </div>
              </button>

              <button
                onClick={() => setPlayerTab('bookings')}
                className="relative h-28 rounded-2xl border border-slate-800 hover:border-emerald-500/50 overflow-hidden text-left transition-all p-3 flex flex-col justify-between group cursor-pointer shadow-md"
              >
                <img
                  src="/src/assets/images/pickleplay_app_hero_1790513641375.jpg"
                  alt="Open Games"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />

                <div className="relative z-10 w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="relative z-10">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                    Open Games
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">{openGames.length} open slots</span>
                </div>
              </button>
            </div>

            {/* Recent Verified Match Results (Read-Only) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  <span>Verified Match History</span>
                </h3>
                <span className="text-[10px] text-slate-500">Official Admin Records</span>
              </div>

              <div className="space-y-2">
                {matches.filter((m) => m.status === 'VERIFIED').slice(0, 3).map((m) => {
                  const isPlayerA = m.playerA.id === player.id;
                  const isWinner = m.winnerId === player.id;
                  const opponent = isPlayerA ? m.playerB : m.playerA;
                  const myScore = isPlayerA ? m.scoreA : m.scoreB;
                  const oppScore = isPlayerA ? m.scoreB : m.scoreA;

                  const opponentAvatar =
                    opponent.avatarUrl ||
                    (opponent.name.includes('Daniel')
                      ? '/src/assets/images/player_avatar_daniel_1790516418797.jpg'
                      : opponent.name.includes('Kim')
                      ? '/src/assets/images/player_avatar_kim_1790516437418.jpg'
                      : '/src/assets/images/player_avatar_daniel_1790516418797.jpg');

                  return (
                    <div
                      key={m.id}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 flex items-center justify-between shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        {/* Opponent Picture with Outcome Badge Overlay */}
                        <div className="relative shrink-0">
                          <img
                            src={opponentAvatar}
                            alt={opponent.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-xl object-cover border border-slate-700 shadow-md"
                          />
                          <span
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shadow-sm ${
                              isWinner
                                ? 'bg-emerald-400 text-slate-950 ring-2 ring-slate-900'
                                : 'bg-rose-500 text-white ring-2 ring-slate-900'
                            }`}
                          >
                            {isWinner ? 'W' : 'L'}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white">vs. {opponent.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({m.matchNumber})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{m.courtName}</span>
                            <span>·</span>
                            <span>{m.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-white font-mono tabular-nums">
                          {myScore} - {oppScore}
                        </div>
                        <div className="text-[10px] font-semibold">
                          {isWinner ? (
                            <span className="text-emerald-400">+25 pts</span>
                          ) : (
                            <span className="text-rose-400">-10 pts</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Open Games Promo Card (Prompt Section 23) */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md">
              <div className="relative h-24 w-full overflow-hidden bg-slate-950">
                <img
                  src="/src/assets/images/pickleplay_app_hero_1790513641375.jpg"
                  alt="Tagum Pickleball Open Game"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                <div className="absolute top-2.5 left-3">
                  <span className="text-[10px] text-lime-400 font-bold bg-slate-950/80 px-2 py-0.5 rounded-full border border-lime-500/30">
                    Pickup Game at Tagum Center
                  </span>
                </div>
              </div>
              <div className="p-3.5 flex items-center justify-between -mt-4 relative z-10">
                <div>
                  <h4 className="text-sm font-bold text-white">Friday Sunset Scrimmage</h4>
                  <p className="text-[11px] text-slate-400">Court 2 · 3/4 Players Joined</p>
                </div>
                <button
                  onClick={() => setPlayerTab('bookings')}
                  className="px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-lime-400/20 cursor-pointer"
                >
                  Join Game
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: COURTS (RESERVATION) ===================== */}
        {playerTab === 'courts' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-lime-400 uppercase tracking-wider">
                Tagum City Facilities
              </span>
              <h1 className="text-xl font-black font-display text-white">Court Reservation</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Official tournament courts with floodlights and spectator zones.
              </p>
            </div>

            {/* Courts List */}
            <div className="space-y-4">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg transition-all hover:border-slate-700"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                    <img
                      src={court.image}
                      alt={court.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/90 text-white border border-slate-700 backdrop-blur-md">
                        {court.indoor ? 'Covered Arena' : 'Outdoor'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white">{court.name}</h3>
                        <p className="text-xs text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-lime-400" />
                          <span>{court.location}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-lime-400 font-display">₱{court.pricePerHour}</span>
                        <span className="text-[10px] text-slate-400 block">/ hour</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-400">
                      {court.amenities.map((item, idx) => (
                        <span key={idx} className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                        <span>Hours: {court.openHours}</span>
                      </div>
                      <button
                        onClick={() => setSelectedCourtId(court.id)}
                        className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-lime-400/20 cursor-pointer"
                      >
                        Reserve Court
                      </button>
                    </div>

                    {/* Booking Panel if selected */}
                    {selectedCourtId === court.id && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-lime-500/30 space-y-3 animate-fadeIn">
                        <h4 className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Select Reservation Slot</span>
                          <button
                            onClick={() => setSelectedCourtId(null)}
                            className="text-[10px] text-slate-400 hover:text-white"
                          >
                            Close
                          </button>
                        </h4>

                        {bookingSuccessMsg && (
                          <div className="p-2 rounded-lg bg-emerald-950 text-emerald-300 text-xs font-medium">
                            {bookingSuccessMsg}
                          </div>
                        )}
                        {bookingErrorMsg && (
                          <div className="p-2 rounded-lg bg-rose-950 text-rose-300 text-xs font-medium">
                            {bookingErrorMsg}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Date</label>
                            <input
                              type="date"
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-xs outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Time Slot</label>
                            <select
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-white text-xs outline-none"
                            >
                              <option value="04:00 PM">04:00 PM - 05:00 PM</option>
                              <option value="05:00 PM">05:00 PM - 06:00 PM</option>
                              <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                              <option value="07:00 PM">07:00 PM - 08:00 PM</option>
                              <option value="08:00 PM">08:00 PM - 09:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2">
                          <span className="text-slate-400">Rate: ₱{court.pricePerHour}/hr</span>
                          <button
                            onClick={() => handleBookingSubmit(court.id)}
                            className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-xs shadow-md shadow-lime-400/20 cursor-pointer"
                          >
                            Confirm Reservation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: RANKINGS (LEADERBOARD) ===================== */}
        {playerTab === 'rankings' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-lime-400 uppercase tracking-wider">
                Official Tagum City Ladder
              </span>
              <h1 className="text-xl font-black font-display text-white">Player Rankings</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Calculated automatically from verified match results. Read-only for players.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Tagum players..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-lime-400"
              />
            </div>

            {/* Top 3 Podium Cards */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              {leaderboard.slice(0, 3).map((topPlayer, index) => {
                const medals = ['🥇', '🥈', '🥉'];
                const borders = [
                  'border-amber-400/50 bg-gradient-to-b from-amber-950/40 to-slate-900',
                  'border-slate-400/40 bg-gradient-to-b from-slate-800/40 to-slate-900',
                  'border-amber-700/40 bg-gradient-to-b from-amber-950/20 to-slate-900',
                ];

                const avatar =
                  topPlayer.avatarUrl ||
                  (index === 0
                    ? '/src/assets/images/podium_player_jico_1790516824327.jpg'
                    : index === 1
                    ? '/src/assets/images/pickleplay_login_player_1790514630037.jpg'
                    : '/src/assets/images/player_avatar_kim_1790516437418.jpg');

                return (
                  <div
                    key={topPlayer.id}
                    className={`rounded-2xl border p-2.5 flex flex-col items-center justify-between min-h-[148px] relative overflow-hidden shadow-md ${borders[index]}`}
                  >
                    <div className="flex flex-col items-center w-full">
                      <div className="relative mb-1 mt-0.5">
                        <img
                          src={avatar}
                          alt={topPlayer.fullName}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border-2 border-white/20 shadow-sm"
                        />
                        <span className="absolute -bottom-1 -right-1 text-xs select-none">
                          {medals[index]}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate max-w-full">{topPlayer.fullName.split(' ')[0]}</h4>
                      <span className="text-[10px] text-slate-400 truncate max-w-full">{topPlayer.skillLevel}</span>
                    </div>
                    <div className="w-full pt-1.5 border-t border-white/5 mt-1">
                      <div className="text-xs font-bold text-lime-400 font-display tabular-nums">
                        {topPlayer.rankingPoints}
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {topPlayer.wins}W · {topPlayer.losses}L
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                All Ranked Players ({leaderboard.length})
              </span>

              <div className="space-y-1.5">
                {leaderboard
                  .filter((p) => p.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => {
                    const isCurrent = p.id === player.id;
                    const avatar =
                      p.avatarUrl ||
                      (p.fullName.includes('Joshua')
                        ? '/src/assets/images/podium_player_jico_1790516824327.jpg'
                        : p.fullName.includes('Alex') || p.fullName.includes('Francis')
                        ? '/src/assets/images/pickleplay_login_player_1790514630037.jpg'
                        : p.fullName.includes('Jezel') || p.fullName.includes('Kim')
                        ? '/src/assets/images/player_avatar_kim_1790516437418.jpg'
                        : '/src/assets/images/player_avatar_daniel_1790516418797.jpg');

                    return (
                      <div
                        key={p.id}
                        className={`p-2.5 sm:p-3 rounded-2xl border transition-all flex items-center justify-between ${
                          isCurrent
                            ? 'bg-lime-950/40 border-lime-500/50 shadow-md shadow-lime-950/30'
                            : 'bg-slate-900 border-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 text-center font-display font-black text-xs tabular-nums ${
                              p.rank <= 3 ? 'text-amber-400' : isCurrent ? 'text-lime-400' : 'text-slate-400'
                            }`}
                          >
                            #{p.rank}
                          </span>
                          <img
                            src={avatar}
                            alt={p.fullName}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{p.fullName}</span>
                              {isCurrent && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-lime-400 text-slate-950">
                                  YOU
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {p.wins} Wins · {p.losses} Losses · {p.winRate}% Win Rate
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-lime-400 font-display tabular-nums block">
                            {p.rankingPoints.toLocaleString()} pts
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {p.weeklyChange >= 0 ? `+${p.weeklyChange}` : p.weeklyChange} wk
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: BOOKINGS & OPEN GAMES ===================== */}
        {playerTab === 'bookings' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-lime-400 uppercase tracking-wider">
                My Court Schedules
              </span>
              <h1 className="text-xl font-black font-display text-white">Bookings & Games</h1>
            </div>

            {/* My Active Bookings */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                My Reservations ({bookings.filter((b) => b.playerId === player.id).length})
              </h3>

              {bookings.filter((b) => b.playerId === player.id).length === 0 ? (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400">
                  You haven't reserved a court yet.
                </div>
              ) : (
                bookings
                  .filter((b) => b.playerId === player.id)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{b.courtName}</span>
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
                        <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2">
                          <span>{b.date}</span>
                          <span>·</span>
                          <span>{b.startTime} - {b.endTime}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">₱{b.totalPrice} · Tagum Center</div>
                      </div>

                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/40 px-2.5 py-1 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ))
              )}
            </div>

            {/* Open Pickup Games */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Find a Game in Tagum
                  </h3>
                  <p className="text-[11px] text-slate-500">Join pickup matches organized by local players</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {openGames.map((game) => {
                  const hasJoined = game.playerIds.includes(player.id);
                  return (
                    <div
                      key={game.id}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">
                            {game.skillLevel} Level
                          </span>
                          <h4 className="text-sm font-bold text-white">{game.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {game.courtName} · {game.date} ({game.time})
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-white font-mono">
                            {game.currentPlayers}/{game.maxPlayers}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {game.slotsAvailable} slots left
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-[10px] text-slate-400">Host: {game.hostName}</span>
                        <button
                          disabled={hasJoined || game.slotsAvailable === 0}
                          onClick={() => joinOpenGame(game.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                            hasJoined
                              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                              : 'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20'
                          }`}
                        >
                          {hasJoined ? 'Joined ✓' : 'Join Game'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: PROFILE ===================== */}
        {playerTab === 'profile' && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="text-center pt-2">
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-lime-400 mx-auto flex items-center justify-center text-3xl font-display font-black text-lime-400 shadow-xl">
                {player.fullName.charAt(0)}
              </div>
              <h2 className="text-lg font-bold text-white mt-3">{player.fullName}</h2>
              <span className="text-xs text-lime-400 font-semibold bg-lime-950/60 px-2.5 py-0.5 rounded-full border border-lime-500/30 inline-block mt-1">
                {player.skillLevel} · Tagum Player
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Current Rank</span>
                <span className="font-bold text-white font-display">#{player.rank} in Tagum</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Ladder Points</span>
                <span className="font-bold text-lime-400 font-mono">{player.rankingPoints} pts</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Win / Loss Record</span>
                <span className="font-bold text-white">{player.wins} Wins · {player.losses} Losses</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Win Rate</span>
                <span className="font-bold text-emerald-400 font-mono">{player.winRate}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Email</span>
                <span className="font-mono text-slate-300">{player.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Phone</span>
                <span className="font-mono text-slate-300">{player.phone}</span>
              </div>
            </div>

            {/* Ranking Points History (Prompt Section 18) */}
            <div className="space-y-2 pt-1">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Ranking History Audit
              </h3>
              <div className="space-y-2">
                {rankingHistory.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">vs. {item.opponentName}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.reason} · {item.oldPoints} → {item.newPoints} pts
                      </div>
                    </div>
                    <div
                      className={`font-mono font-bold ${
                        item.pointsChange >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.pointsChange >= 0 ? `+${item.pointsChange}` : item.pointsChange} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              🛡️ <strong>Fairness Policy:</strong> Player scores cannot be altered directly. All rankings are automatically determined upon official Court Admin match verification.
            </div>
          </div>
        )}
      </div>

      {/* ===================== FIXED MOBILE BOTTOM TAB BAR ===================== */}
      {/* Pattern 1 from mobile guidelines: Fixed bottom container with 4-5 tabs */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 z-30 px-2 py-1">
        <div className="grid grid-cols-5 items-center h-14">
          <button
            onClick={() => setPlayerTab('home')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              playerTab === 'home' ? 'text-lime-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-1">Home</span>
          </button>

          <button
            onClick={() => setPlayerTab('courts')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              playerTab === 'courts' ? 'text-lime-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-1">Courts</span>
          </button>

          <button
            onClick={() => setPlayerTab('rankings')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              playerTab === 'rankings' ? 'text-lime-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px] mt-1">Rankings</span>
          </button>

          <button
            onClick={() => setPlayerTab('bookings')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              playerTab === 'bookings' ? 'text-lime-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-1">Bookings</span>
          </button>

          <button
            onClick={() => setPlayerTab('profile')}
            className={`flex flex-col items-center justify-center h-full transition-colors cursor-pointer ${
              playerTab === 'profile' ? 'text-lime-400 font-bold' : 'text-slate-400 hover:text-slate-200'
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
