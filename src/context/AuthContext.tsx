import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AdminProfile,
  AuthUser,
  Booking,
  Court,
  MatchRecord,
  NotificationItem,
  OpenGame,
  PlayerProfile,
  RankingHistoryItem,
  SkillLevel,
  UserRole,
  ActivityLog,
} from '../types';
import {
  DEMO_ADMIN,
  DEMO_COURTS,
  DEMO_MATCHES,
  DEMO_NOTIFICATIONS,
  DEMO_OPEN_GAMES,
  DEMO_PLAYER,
  DEMO_PLAYERS_LEADERBOARD,
  DEMO_RANKING_HISTORY,
  DEMO_ACTIVITY_LOGS,
} from '../data/demoData';

export type ScreenState =
  | 'splash'
  | 'role_select'
  | 'player_login'
  | 'player_register'
  | 'admin_login'
  | 'admin_register'
  | 'player_app'
  | 'admin_app';

export type PlayerTab = 'home' | 'courts' | 'rankings' | 'bookings' | 'profile';
export type AdminTab = 'dashboard' | 'bookings' | 'scoring' | 'players' | 'profile';

interface AuthContextType {
  // Screen / navigation
  currentScreen: ScreenState;
  setCurrentScreen: (screen: ScreenState) => void;
  playerTab: PlayerTab;
  setPlayerTab: (tab: PlayerTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  
  // Auth state
  currentUser: AuthUser | null;
  userRole: UserRole | null;
  selectedRoleForAuth: UserRole | null;
  setSelectedRoleForAuth: (role: UserRole | null) => void;

  // Actions
  loginAsPlayer: (email: string, pass: string) => { success: boolean; error?: string };
  loginAsAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  registerPlayer: (data: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    skillLevel: SkillLevel;
    password: string;
  }) => { success: boolean; error?: string };
  registerAdmin: (data: {
    ownerName: string;
    facilityName: string;
    email: string;
    phone: string;
    courtAddress: string;
    password: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  switchRoleSelection: () => void;

  // App data & Admin Official scoring operations
  courts: Court[];
  matches: MatchRecord[];
  leaderboard: PlayerProfile[];
  rankingHistory: RankingHistoryItem[];
  bookings: Booking[];
  openGames: OpenGame[];
  notifications: NotificationItem[];
  activityLogs: ActivityLog[];
  activeToast: NotificationItem | null;
  dismissToast: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  triggerDemoNotification: () => void;

  // Real actions
  createBooking: (courtId: string, date: string, startTime: string, endTime: string) => { success: boolean; error?: string; booking?: Booking };
  cancelBooking: (bookingId: string) => { success: boolean; error?: string };
  joinOpenGame: (gameId: string) => { success: boolean; error?: string };
  
  // ADMIN ONLY: Score submission & verification (Player has NO access to this)
  submitOfficialMatchScore: (
    matchId: string,
    scoreA: number,
    scoreB: number
  ) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [selectedRoleForAuth, setSelectedRoleForAuth] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const [playerTab, setPlayerTab] = useState<PlayerTab>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Application Data States
  const [courts, setCourts] = useState<Court[]>(DEMO_COURTS);
  const [matches, setMatches] = useState<MatchRecord[]>(DEMO_MATCHES);
  const [leaderboard, setLeaderboard] = useState<PlayerProfile[]>(DEMO_PLAYERS_LEADERBOARD);
  const [rankingHistory, setRankingHistory] = useState<RankingHistoryItem[]>(DEMO_RANKING_HISTORY);
  const [openGames, setOpenGames] = useState<OpenGame[]>(DEMO_OPEN_GAMES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEMO_NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(DEMO_ACTIVITY_LOGS);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  const dismissToast = () => setActiveToast(null);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const triggerDemoNotification = () => {
    const isPlayer = userRole === 'PLAYER';
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser?.id || 'all',
      title: isPlayer ? '🔥 Ladder Points Boost!' : '⚡ New Booking Request',
      message: isPlayer
        ? 'Great game! You gained +25 ranking points from the Tagum City Weekly Ladder.'
        : 'Player Alex Villarosa just reserved Court 1 for 6:00 PM tonight.',
      type: isPlayer ? 'RANKING' : 'BOOKING',
      read: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast(newNotif);
  };
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 'book_01',
      courtId: 'court_01',
      courtName: 'Court 1 - Championship Blue',
      facilityName: 'Tagum Pickleball Center',
      playerId: DEMO_PLAYER.id,
      playerName: DEMO_PLAYER.fullName,
      playerPhone: DEMO_PLAYER.phone,
      date: '2026-09-30',
      startTime: '05:00 PM',
      endTime: '06:00 PM',
      totalPrice: 150,
      status: 'CONFIRMED',
      createdAt: '2026-09-27 08:30:00',
    },
  ]);

  // Handle splash transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('role_select');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const loginAsPlayer = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Security check: Check if an Admin email is being used on Player portal
    if (cleanEmail === DEMO_ADMIN.email.toLowerCase()) {
      return {
        success: false,
        error: 'This account is registered as an Admin. Please use Admin Login.',
      };
    }

    if (cleanEmail === DEMO_PLAYER.email.toLowerCase() || cleanEmail === 'player@pickleplay.demo' || cleanEmail.includes('player')) {
      setCurrentUser(DEMO_PLAYER);
      setUserRole('PLAYER');
      setCurrentScreen('player_app');
      return { success: true };
    }

    // Check if player exists in leaderboard list
    const found = leaderboard.find((p) => p.email.toLowerCase() === cleanEmail);
    if (found) {
      setCurrentUser(found);
      setUserRole('PLAYER');
      setCurrentScreen('player_app');
      return { success: true };
    }

    // Generic match for demo convenience
    if (cleanEmail && pass.length >= 4) {
      const newPlayer: PlayerProfile = {
        id: `player_${Date.now()}`,
        fullName: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '+63 900 000 0000',
        dateOfBirth: '2000-01-01',
        skillLevel: 'Beginner',
        rank: leaderboard.length + 1,
        rankingPoints: 1000,
        weeklyChange: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        currentStreak: 0,
        role: 'PLAYER',
      };
      setLeaderboard((prev) => [...prev, newPlayer]);
      setCurrentUser(newPlayer);
      setUserRole('PLAYER');
      setCurrentScreen('player_app');
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  };

  const loginAsAdmin = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Security check: Check if a Player email is being used on Admin portal
    if (cleanEmail === DEMO_PLAYER.email.toLowerCase() || leaderboard.some((p) => p.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'This account is registered as a Player. Please use Player Login.',
      };
    }

    if (cleanEmail === DEMO_ADMIN.email.toLowerCase() || cleanEmail === 'admin@pickleplay.demo' || cleanEmail.includes('admin')) {
      setCurrentUser(DEMO_ADMIN);
      setUserRole('ADMIN');
      setCurrentScreen('admin_app');
      return { success: true };
    }

    return { success: false, error: 'Invalid admin credentials or facility unauthorized.' };
  };

  const registerPlayer = (data: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    skillLevel: SkillLevel;
    password: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (cleanEmail === DEMO_ADMIN.email.toLowerCase()) {
      return { success: false, error: 'Email already registered as an Admin.' };
    }
    if (leaderboard.some((p) => p.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'A player with this email already exists.' };
    }

    const newPlayer: PlayerProfile = {
      id: `player_${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      skillLevel: data.skillLevel,
      rank: leaderboard.length + 1,
      rankingPoints: 1000,
      weeklyChange: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      currentStreak: 0,
      role: 'PLAYER',
    };

    setLeaderboard((prev) => [...prev, newPlayer]);
    setCurrentUser(newPlayer);
    setUserRole('PLAYER');
    setCurrentScreen('player_app');
    return { success: true };
  };

  const registerAdmin = (data: {
    ownerName: string;
    facilityName: string;
    email: string;
    phone: string;
    courtAddress: string;
    password: string;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (cleanEmail === DEMO_PLAYER.email.toLowerCase() || leaderboard.some((p) => p.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Email already registered as a Player.' };
    }

    const newAdmin: AdminProfile = {
      id: `admin_${Date.now()}`,
      ownerName: data.ownerName,
      facilityName: data.facilityName,
      email: data.email,
      phone: data.phone,
      courtAddress: data.courtAddress,
      businessNumber: `TPC-NEW-${Date.now().toString().slice(-4)}`,
      role: 'ADMIN',
    };

    setCurrentUser(newAdmin);
    setUserRole('ADMIN');
    setCurrentScreen('admin_app');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    setCurrentScreen('role_select');
  };

  const switchRoleSelection = () => {
    setSelectedRoleForAuth(null);
    setCurrentScreen('role_select');
  };

  // Player booking
  const createBooking = (courtId: string, date: string, startTime: string, endTime: string) => {
    if (!currentUser || userRole !== 'PLAYER') {
      return { success: false, error: 'Only logged-in players can create reservations.' };
    }

    const court = courts.find((c) => c.id === courtId);
    if (!court) {
      return { success: false, error: 'Court not found.' };
    }

    // Check for double booking
    const conflict = bookings.find(
      (b) =>
        b.courtId === courtId &&
        b.date === date &&
        b.startTime === startTime &&
        b.status === 'CONFIRMED'
    );

    if (conflict) {
      return { success: false, error: 'This time slot is already booked. Please choose another.' };
    }

    const newBooking: Booking = {
      id: `book_${Date.now()}`,
      courtId: court.id,
      courtName: court.name,
      facilityName: court.facilityName,
      playerId: currentUser.id,
      playerName: (currentUser as PlayerProfile).fullName,
      playerPhone: (currentUser as PlayerProfile).phone,
      date,
      startTime,
      endTime,
      totalPrice: court.pricePerHour,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Add notification
    const playerNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: currentUser.id,
      title: 'Booking Confirmed!',
      message: `Your reservation for ${court.name} on ${date} (${startTime} - ${endTime}) is confirmed.`,
      type: 'BOOKING',
      read: false,
      createdAt: 'Just now',
    };
    setNotifications((prev) => [playerNotif, ...prev]);
    setActiveToast(playerNotif);

    // Activity log
    const log: ActivityLog = {
      id: `act_${Date.now()}`,
      userId: currentUser.id,
      userName: (currentUser as PlayerProfile).fullName,
      userRole: 'PLAYER',
      action: 'BOOKING_CREATED',
      description: `Player booked ${court.name} for ${date} (${startTime} - ${endTime}).`,
      createdAt: new Date().toISOString(),
    };
    setActivityLogs((prev) => [log, ...prev]);

    return { success: true, booking: newBooking };
  };

  const cancelBooking = (bookingId: string) => {
    if (!currentUser) return { success: false, error: 'Unauthorized.' };
    
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          // Verify ownership or admin
          if (userRole === 'PLAYER' && b.playerId !== currentUser.id) {
            return b;
          }
          return { ...b, status: 'CANCELLED' };
        }
        return b;
      })
    );
    return { success: true };
  };

  const joinOpenGame = (gameId: string) => {
    if (!currentUser || userRole !== 'PLAYER') {
      return { success: false, error: 'Must be logged in as a player.' };
    }
    const playerId = currentUser.id;

    let success = false;
    let errorMsg = '';

    setOpenGames((prev) =>
      prev.map((g) => {
        if (g.id === gameId) {
          if (g.playerIds.includes(playerId)) {
            errorMsg = 'You have already joined this game.';
            return g;
          }
          if (g.currentPlayers >= g.maxPlayers) {
            errorMsg = 'This game is already full.';
            return g;
          }
          success = true;
          return {
            ...g,
            currentPlayers: g.currentPlayers + 1,
            slotsAvailable: g.slotsAvailable - 1,
            playerIds: [...g.playerIds, playerId],
          };
        }
        return g;
      })
    );

    if (success) {
      return { success: true };
    }
    return { success: false, error: errorMsg || 'Unable to join game.' };
  };

  // ADMIN SCORING ENGINE:
  // Strictly verifies caller has role === 'ADMIN'
  // Calculates: WIN = +25, LOSS = -10
  // Updates player stats (wins, losses, winRate)
  // Re-sorts leaderboard
  // Creates audit record and ranking history
  const submitOfficialMatchScore = (matchId: string, scoreA: number, scoreB: number) => {
    if (!currentUser || userRole !== 'ADMIN') {
      return {
        success: false,
        error: 'Forbidden: Only verified Court Administrators can submit official match scores.',
      };
    }

    if (scoreA === scoreB) {
      return { success: false, error: 'Pickleball matches cannot end in a tie. One player must reach winning points.' };
    }

    const match = matches.find((m) => m.id === matchId);
    if (!match) {
      return { success: false, error: 'Match record not found.' };
    }

    const admin = currentUser as AdminProfile;
    const isPlayerAWinner = scoreA > scoreB;
    const winner = isPlayerAWinner ? match.playerA : match.playerB;
    const loser = isPlayerAWinner ? match.playerB : match.playerA;

    const winnerScore = isPlayerAWinner ? scoreA : scoreB;
    const loserScore = isPlayerAWinner ? scoreB : scoreA;

    const pointsGain = 25;
    const pointsDeduction = 10;

    // Update match record
    const updatedMatch: MatchRecord = {
      ...match,
      scoreA,
      scoreB,
      winnerId: winner.id,
      loserId: loser.id,
      pointsExchanged: pointsGain,
      status: 'VERIFIED',
      verifiedByAdminId: admin.id,
      verifiedByAdminName: admin.ownerName,
      verifiedAt: new Date().toISOString(),
      notes: `Official result verified by ${admin.facilityName} (${admin.ownerName})`,
    };

    setMatches((prev) => prev.map((m) => (m.id === matchId ? updatedMatch : m)));

    // Update Leaderboard with ranking service logic
    setLeaderboard((prev) => {
      const updated = prev.map((p) => {
        if (p.id === winner.id) {
          const newWins = p.wins + 1;
          const totalGames = newWins + p.losses;
          const newPoints = p.rankingPoints + pointsGain;
          return {
            ...p,
            wins: newWins,
            rankingPoints: newPoints,
            weeklyChange: p.weeklyChange + pointsGain,
            winRate: Math.round((newWins / totalGames) * 1000) / 10,
            currentStreak: p.currentStreak + 1,
          };
        }
        if (p.id === loser.id) {
          const newLosses = p.losses + 1;
          const totalGames = p.wins + newLosses;
          const newPoints = Math.max(0, p.rankingPoints - pointsDeduction);
          return {
            ...p,
            losses: newLosses,
            rankingPoints: newPoints,
            weeklyChange: p.weeklyChange - pointsDeduction,
            winRate: Math.round((p.wins / totalGames) * 1000) / 10,
            currentStreak: 0,
          };
        }
        return p;
      });

      // Re-sort ranking based on points descending
      updated.sort((a, b) => b.rankingPoints - a.rankingPoints);

      // Re-assign ranks 1..N
      return updated.map((p, idx) => ({ ...p, rank: idx + 1 }));
    });

    // Update active player profile if current session is that player
    if (currentUser.id === winner.id) {
      const p = currentUser as PlayerProfile;
      setCurrentUser({
        ...p,
        rankingPoints: p.rankingPoints + pointsGain,
        wins: p.wins + 1,
        weeklyChange: p.weeklyChange + pointsGain,
        currentStreak: p.currentStreak + 1,
      });
    } else if (currentUser.id === loser.id) {
      const p = currentUser as PlayerProfile;
      setCurrentUser({
        ...p,
        rankingPoints: Math.max(0, p.rankingPoints - pointsDeduction),
        losses: p.losses + 1,
        weeklyChange: p.weeklyChange - pointsDeduction,
        currentStreak: 0,
      });
    }

    // Record ranking history for both players
    const winnerHistory: RankingHistoryItem = {
      id: `rh_${Date.now()}_win`,
      playerId: winner.id,
      playerName: winner.name,
      matchId: match.id,
      opponentName: loser.name,
      oldPoints: winner.rankingPoints,
      pointsChange: pointsGain,
      newPoints: winner.rankingPoints + pointsGain,
      reason: 'WIN',
      createdAt: new Date().toISOString(),
    };

    const loserHistory: RankingHistoryItem = {
      id: `rh_${Date.now()}_loss`,
      playerId: loser.id,
      playerName: loser.name,
      matchId: match.id,
      opponentName: winner.name,
      oldPoints: loser.rankingPoints,
      pointsChange: -pointsDeduction,
      newPoints: Math.max(0, loser.rankingPoints - pointsDeduction),
      reason: 'LOSS',
      createdAt: new Date().toISOString(),
    };

    setRankingHistory((prev) => [winnerHistory, loserHistory, ...prev]);

    // Send notifications to both players
    const winNotif: NotificationItem = {
      id: `notif_w_${Date.now()}`,
      userId: winner.id,
      title: '🎉 Match Victory Confirmed!',
      message: `Admin ${admin.ownerName} verified your official win against ${loser.name} (${winnerScore}-${loserScore}). You gained +${pointsGain} ranking points!`,
      type: 'RANKING',
      read: false,
      createdAt: 'Just now',
    };

    const lossNotif: NotificationItem = {
      id: `notif_l_${Date.now()}`,
      userId: loser.id,
      title: 'Official Match Result Recorded',
      message: `Admin ${admin.ownerName} recorded match result against ${winner.name} (${loserScore}-${winnerScore}). (-${pointsDeduction} points). Keep grinding!`,
      type: 'MATCH',
      read: false,
      createdAt: 'Just now',
    };

    setNotifications((prev) => [winNotif, lossNotif, ...prev]);
    if (currentUser.id === winner.id) {
      setActiveToast(winNotif);
    } else if (currentUser.id === loser.id) {
      setActiveToast(lossNotif);
    } else if (userRole === 'ADMIN') {
      setActiveToast({
        id: `notif_adm_${Date.now()}`,
        userId: admin.id,
        title: 'Score Confirmed & Audited',
        message: `Match ${match.matchNumber} result recorded: ${winner.name} def. ${loser.name} (${winnerScore}-${loserScore}).`,
        type: 'MATCH',
        read: false,
        createdAt: 'Just now',
      });
    }

    // Activity log for auditing
    const scoreLog: ActivityLog = {
      id: `act_${Date.now()}_score`,
      userId: admin.id,
      userName: admin.ownerName,
      userRole: 'ADMIN',
      action: 'ADMIN_CONFIRMED_RESULT',
      description: `Official score confirmed for ${match.matchNumber}: ${winner.name} (${winnerScore}) def. ${loser.name} (${loserScore}). Points: +${pointsGain}/-${pointsDeduction}.`,
      matchId: match.id,
      createdAt: new Date().toISOString(),
    };

    setActivityLogs((prev) => [scoreLog, ...prev]);

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        playerTab,
        setPlayerTab,
        adminTab,
        setAdminTab,
        currentUser,
        userRole,
        selectedRoleForAuth,
        setSelectedRoleForAuth,
        loginAsPlayer,
        loginAsAdmin,
        registerPlayer,
        registerAdmin,
        logout,
        switchRoleSelection,
        courts,
        matches,
        leaderboard,
        rankingHistory,
        bookings,
        openGames,
        notifications,
        activityLogs,
        activeToast,
        dismissToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        triggerDemoNotification,
        createBooking,
        cancelBooking,
        joinOpenGame,
        submitOfficialMatchScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
