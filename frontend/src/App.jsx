import { useState, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { api } from './lib/api';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const HomePage = lazy(() => import('./pages/HomePage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-marigold animate-pulse shadow-sm" />
        <div className="text-caption text-ink-70 font-medium">Loading ChatLingua...</div>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading, login, register, checkAuth } = useAuth();
  const [page, setPage] = useState('landing');
  const [needsProfile, setNeedsProfile] = useState(false);

  const handleRegister = useCallback(async (data) => {
    await register(data);
    await checkAuth();
    setNeedsProfile(true);
  }, [register, checkAuth]);

  const handleLogin = useCallback(async (data) => {
    await login(data);
  }, [login]);

  const handleProfileComplete = useCallback(async (profile) => {
    await api.createProfile(profile);
    await checkAuth();
    setNeedsProfile(false);
  }, [checkAuth]);

  if (loading) {
    return <PageLoader />;
  }

  if (user && !needsProfile && (!user.native_id || !user.learn_id)) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProfilePage onSubmit={handleProfileComplete} />
      </Suspense>
    );
  }

  if (needsProfile) {
    return (
      <Suspense fallback={<PageLoader />}>
        <ProfilePage onSubmit={handleProfileComplete} />
      </Suspense>
    );
  }

  if (user) {
    return (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        {page === 'landing' && (
          <LandingPage
            key="landing"
            onNavigateLogin={() => setPage('login')}
            onNavigateSignup={() => setPage('signup')}
          />
        )}

        {page === 'signup' && (
          <SignupPage
            key="signup"
            onRegister={handleRegister}
            onSwitch={() => setPage('login')}
            onBackHome={() => setPage('landing')}
          />
        )}

        {page === 'login' && (
          <LoginPage
            key="login"
            onLogin={handleLogin}
            onSwitch={() => setPage('signup')}
            onBackHome={() => setPage('landing')}
          />
        )}
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
