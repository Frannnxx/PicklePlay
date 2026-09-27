import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationModal, NotificationToastBanner } from './NotificationModal';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const { currentScreen, setCurrentScreen, userRole, currentUser, logout, notifications } = useAuth();

  const userNotifications = notifications.filter(
    (n) => !n.userId || n.userId === 'all' || (currentUser && n.userId === currentUser.id)
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start text-slate-100 selection:bg-lime-400 selection:text-slate-950">
      {/* Real-time Notification Toast Banner */}
      <NotificationToastBanner onOpenModal={() => setIsNotifOpen(true)} />

      {/* Notification Center Modal / Drawer */}
      <NotificationModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Top Utility Bar for Developer / Demo testing */}
      <header className="w-full border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 z-40">
        <div className="flex items-center gap-2">
          <span className="font-display font-black text-lime-400 text-sm tracking-tight flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block shadow-sm shadow-lime-400/50"></span>
            PICKLEPLAY
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentUser && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/60 rounded-md px-2.5 py-1 text-slate-300">
              <span className={`w-2 h-2 rounded-full ${userRole === 'ADMIN' ? 'bg-amber-400' : 'bg-lime-400'}`}></span>
              <span className="font-medium text-[11px]">
                {userRole === 'ADMIN' ? 'Court Admin' : 'Player'}:{' '}
                <strong className="text-white">
                  {userRole === 'ADMIN'
                    ? (currentUser as any).facilityName || 'Admin'
                    : (currentUser as any).fullName || 'Player'}
                </strong>
              </span>
            </div>
          )}

          {/* Notification Center Bell Trigger */}
          {currentUser && (
            <button
              onClick={() => setIsNotifOpen(true)}
              className="relative p-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/60 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
              title="Notifications"
            >
              <Bell className="w-3.5 h-3.5 text-lime-400" />
              {unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-lime-400 text-slate-950 font-black text-[9px] shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          {currentUser && (
            <button
              onClick={logout}
              className="text-[11px] font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/40 rounded px-2 py-1 transition-colors cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Main Viewport Container */}
      <main className="flex-1 w-full flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden">
        <div className="relative w-full max-w-[420px] h-[92vh] max-h-[880px] bg-slate-950 border border-slate-800 rounded-none sm:rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden">
          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-950">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
