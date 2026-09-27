export type UserRole = 'PLAYER' | 'ADMIN';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PlayerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  skillLevel: SkillLevel;
  avatarUrl?: string;
  rank: number;
  rankingPoints: number;
  weeklyChange: number;
  wins: number;
  losses: number;
  winRate: number; // percentage
  currentStreak: number;
  role: 'PLAYER';
}

export interface AdminProfile {
  id: string;
  ownerName: string;
  facilityName: string;
  email: string;
  phone: string;
  courtAddress: string;
  businessNumber?: string;
  logoUrl?: string;
  role: 'ADMIN';
}

export type AuthUser = PlayerProfile | AdminProfile;

export interface Court {
  id: string;
  name: string;
  facilityName: string;
  location: string;
  pricePerHour: number;
  indoor: boolean;
  surfaceType: string;
  openHours: string;
  image: string;
  amenities: string[];
  isAvailable: boolean;
}

export interface CourtSlot {
  id: string;
  courtId: string;
  startTime: string; // e.g. "4:00 PM"
  endTime: string;   // e.g. "5:00 PM"
  isAvailable: boolean;
  bookedByPlayerName?: string;
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  facilityName: string;
  playerId: string;
  playerName: string;
  playerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface MatchPlayerRef {
  id: string;
  name: string;
  rank: number;
  rankingPoints: number;
  avatarUrl?: string;
}

export interface MatchRecord {
  id: string;
  courtId: string;
  courtName: string;
  facilityName: string;
  matchNumber: string;
  date: string;
  time: string;
  playerA: MatchPlayerRef;
  playerB: MatchPlayerRef;
  scoreA?: number;
  scoreB?: number;
  winnerId?: string;
  loserId?: string;
  pointsExchanged?: number;
  status: 'WAITING_SCORE' | 'VERIFIED' | 'CANCELLED';
  verifiedByAdminId?: string;
  verifiedByAdminName?: string;
  verifiedAt?: string;
  notes?: string;
}

export interface RankingHistoryItem {
  id: string;
  playerId: string;
  playerName: string;
  matchId: string;
  opponentName: string;
  oldPoints: number;
  pointsChange: number;
  newPoints: number;
  reason: 'WIN' | 'LOSS' | 'ADMIN_CORRECTION';
  createdAt: string;
}

export interface OpenGame {
  id: string;
  title: string;
  skillLevel: SkillLevel;
  date: string;
  time: string;
  courtName: string;
  facilityName: string;
  currentPlayers: number;
  maxPlayers: number;
  hostName: string;
  hostPlayerId: string;
  playerIds: string[];
  slotsAvailable: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'MATCH' | 'RANKING' | 'SYSTEM';
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: 'ADMIN_ENTERED_SCORE' | 'ADMIN_CONFIRMED_RESULT' | 'RANKING_UPDATED' | 'BOOKING_CREATED' | 'SCORE_CORRECTION_REQUESTED';
  description: string;
  matchId?: string;
  createdAt: string;
}
