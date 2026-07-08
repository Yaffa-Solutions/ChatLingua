import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';

function AppContent() {
  const { user, loading, login, register } = useAuth();
  const [page, setPage] = useState(null);
  const [needsProfile, setNeedsProfile] = useState(false);

  // If user just registered but has no profile
  const handleRegister = useCallback(async (data) => {
    await register(data);
    setNeedsProfile(true);
  }, [register]);

  const handleLogin = useCallback(async (data) => {
    await login(data);
  }, [login]);

  const handleProfileComplete = useCallback(() => {
    setNeedsProfile(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary animate-pulse" />
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (user && !needsProfile && (!user.native_id || !user.learn_id)) {
    return <ProfilePage onSubmit={handleProfileComplete} />;
  }

  if (needsProfile) {
    return <ProfilePage onSubmit={handleProfileComplete} />;
  }

  if (user) {
    return <HomePage />;
  }

  return (
    <AnimatePresence mode="wait">
      {page === 'signup' ? (
        <SignupPage
          key="signup"
          onRegister={handleRegister}
          onSwitch={() => setPage('login')}
        />
      ) : (
        <LoginPage
          key="login"
          onLogin={handleLogin}
          onSwitch={() => setPage('signup')}
        />
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
