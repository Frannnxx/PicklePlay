import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileFrame } from './components/MobileFrame';
import { SplashView } from './components/SplashView';
import { RoleSelectionView } from './components/RoleSelectionView';
import { PlayerLoginView } from './components/PlayerLoginView';
import { PlayerRegisterView } from './components/PlayerRegisterView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminRegisterView } from './components/AdminRegisterView';
import { PlayerDashboardView } from './components/PlayerDashboardView';
import { AdminDashboardView } from './components/AdminDashboardView';

const AppContent: React.FC = () => {
  const { currentScreen } = useAuth();

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashView />;
      case 'role_select':
        return <RoleSelectionView />;
      case 'player_login':
        return <PlayerLoginView />;
      case 'player_register':
        return <PlayerRegisterView />;
      case 'admin_login':
        return <AdminLoginView />;
      case 'admin_register':
        return <AdminRegisterView />;
      case 'player_app':
        return <PlayerDashboardView />;
      case 'admin_app':
        return <AdminDashboardView />;
      default:
        return <RoleSelectionView />;
    }
  };

  return <MobileFrame>{renderCurrentScreen()}</MobileFrame>;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
