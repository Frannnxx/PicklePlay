import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trophy,
  Calendar,
  Sparkles,
  Trash2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    userRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    triggerDemoNotification,
    setPlayerTab,
    setAdminTab,
  } = useAuth();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'RANKING' | 'MATCH' | 'BOOKING'>('ALL');

  if (!isOpen) return null;

  // Filter for current user or general notifications
  const userNotifications = notifications.filter(
    (n) => !n.userId || n.userId === 'all' || (currentUser && n.userId === currentUser.id)
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const filteredList = userNotifications.filter((n) => {
    if (activeFilter === 'UNREAD') return !n.read;
    if (activeFilter === 'RANKING') return n.type === 'RANKING';
    if (activeFilter === 'MATCH') return n.type === 'MATCH';
    if (activeFilter === 'BOOKING') return n.type === 'BOOKING';
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'RANKING':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'MATCH':
        return <Zap className="w-4 h-4 text-lime-400" />;
      case 'BOOKING':
        return <Calendar className="w-4 h-4 text-sky-400" />;
      case 'SYSTEM':
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getBadgeStyle = (type: NotificationItem['type']) => {
    switch (type) {
      case 'RANKING':
        return 'bg-amber-950/70 border-amber-500/30 text-amber-300';
      case 'MATCH':
        return 'bg-lime-950/70 border-lime-500/30 text-lime-300';
      case 'BOOKING':
        return 'bg-sky-950/70 border-sky-500/30 text-sky-300';
      case 'SYSTEM':
      default:
        return 'bg-emerald-950/70 border-emerald-500/30 text-emerald-300';
    }
  };

  const handleActionClick = (n: NotificationItem) => {
    markNotificationAsRead(n.id);
    onClose();
    if (n.type === 'RANKING') {
      if (userRole === 'PLAYER') setPlayerTab('rankings');
      else setAdminTab('players');
    } else if (n.type === 'BOOKING') {
      if (userRole === 'PLAYER') setPlayerTab('bookings');
      else setAdminTab('bookings');
    } else if (n.type === 'MATCH') {
      if (userRole === 'PLAYER') setPlayerTab('home');
      else setAdminTab('scoring');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-lime-950/80 border border-lime-500/40 text-lime-400 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-black text-[10px]">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Tagum City Pickleball Updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsAsRead}
                className="text-[11px] text-lime-400 hover:text-lime-300 font-medium px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['ALL', 'UNREAD', 'RANKING', 'MATCH', 'BOOKING'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-lime-400 text-slate-950 shadow-sm shadow-lime-400/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {filter === 'ALL'
                  ? 'All'
                  : filter === 'UNREAD'
                  ? `Unread (${unreadCount})`
                  : filter === 'RANKING'
                  ? 'Rankings'
                  : filter === 'MATCH'
                  ? 'Matches'
                  : 'Bookings'}
              </button>
            );
          })}
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-500 mb-3">
                <Bell className="w-6 h-6 opacity-40" />
              </div>
              <h4 className="text-sm font-bold text-white">No notifications</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
                {activeFilter === 'UNREAD'
                  ? 'You are all caught up! No unread notifications.'
                  : 'No notification records found in this category.'}
              </p>
              <button
                onClick={triggerDemoNotification}
                className="mt-4 px-3.5 py-1.5 rounded-xl bg-lime-400/20 hover:bg-lime-400/30 border border-lime-500/40 text-lime-300 text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Test Alert</span>
              </button>
            </div>
          ) : (
            filteredList.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationAsRead(n.id)}
                className={`relative rounded-2xl p-3.5 border transition-all cursor-pointer group ${
                  !n.read
                    ? 'bg-gradient-to-r from-lime-950/30 via-slate-900 to-slate-900 border-lime-500/40 shadow-sm'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80 opacity-80 hover:opacity-100'
                }`}
              >
                {!n.read && (
                  <span className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-lime-400 ring-4 ring-lime-400/20" />
                )}

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>

                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getBadgeStyle(n.type)}`}>
                        {n.type}
                      </span>
                      <h4 className="text-xs font-bold text-white leading-snug">{n.title}</h4>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-800/60 text-[10px] text-slate-400">
                      <span>{n.createdAt}</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(n);
                          }}
                          className="text-lime-400 hover:text-lime-300 font-semibold flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Demo Trigger Button */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/70 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            {userNotifications.length} Total Alerts
          </span>
          <button
            onClick={triggerDemoNotification}
            className="px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-[11px] transition-all shadow-sm shadow-lime-400/20 cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Simulate Live Notification</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const NotificationToastBanner: React.FC<{ onOpenModal: () => void }> = ({ onOpenModal }) => {
  const { activeToast, dismissToast } = useAuth();

  if (!activeToast) return null;

  return (
    <div
      onClick={() => {
        dismissToast();
        onOpenModal();
      }}
      className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px] p-3 rounded-2xl bg-slate-900/95 border border-lime-500/60 shadow-2xl shadow-lime-950/50 backdrop-blur-md cursor-pointer transition-all animate-slideDown"
    >
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-lime-950 border border-lime-500/40 text-lime-400 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white truncate">{activeToast.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissToast();
              }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 truncate mt-0.5">{activeToast.message}</p>
          <span className="text-[9px] text-lime-400 font-medium mt-1 block">Tap to view notifications →</span>
        </div>
      </div>
    </div>
  );
};
