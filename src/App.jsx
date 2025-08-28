import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Routes from './Routes';

// Navigation handler component
const NavigationHandler = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading or if user is not authenticated
    if (loading || !user || !profile) return;

    // Don't redirect if user is already on login page
    if (location?.pathname === '/login-screen') return;

    // Role-based navigation
    const currentPath = location?.pathname;
    
    // Get intended path based on role
    let intendedPath = '/';
    
    if (profile?.role === 'student') {
      intendedPath = '/student-dashboard';
    } else if (profile?.role === 'teacher') {
      intendedPath = '/teacher-dashboard';
    } else if (['hod', 'admin']?.includes(profile?.role)) {
      intendedPath = '/analytics-dashboard';
    }

    // Navigate to appropriate dashboard if user is on login page or root
    if (currentPath === '/' || currentPath === '/login-screen') {
      navigate(intendedPath, { replace: true });
    }
  }, [user, profile, loading, navigate, location?.pathname]);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!loading && !user && location?.pathname !== '/login-screen') {
      navigate('/login-screen', { replace: true });
    }
  }, [user, loading, navigate, location?.pathname]);

  return null;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <NavigationHandler />
        <Routes />
      </div>
    </AuthProvider>
  );
}

export default App;