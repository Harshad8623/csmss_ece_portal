import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './components/LoginForm';
import LoginCard from './components/LoginCard';
import ThemeToggle from './components/ThemeToggle';
import BackgroundPattern from './components/BackgroundPattern';

const LoginScreen = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(formData?.email || formData?.username, formData?.password);

      if (error) {
        throw new Error(error.message || 'Login failed. Please check your credentials.');
      }

      // The AuthProvider will handle profile fetching and navigation
      // We'll navigate based on the user's role after profile is loaded
      // For now, let's wait a bit for profile to load, then navigate
      setTimeout(() => {
        // Navigation will be handled by checking user role in a useEffect
        // in App.jsx or through the auth context
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userRole = data?.user?.user_metadata?.role || userData?.role;
        
        if (userRole === 'student') {
          navigate('/student-dashboard');
        } else if (userRole === 'teacher') {
          navigate('/teacher-dashboard');
        } else if (userRole === 'hod' || userRole === 'admin') {
          navigate('/analytics-dashboard');
        } else {
          // Default navigation - we'll determine role from profile navigate('/student-dashboard');
        }
      }, 1000);

    } catch (error) {
      setError(error?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <BackgroundPattern />
      
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <LoginCard>
          <LoginForm 
            onLogin={handleLogin}
            isLoading={isLoading}
            error={error}
          />
        </LoginCard>
      </div>

      {/* Login Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-sm text-gray-600 dark:text-gray-400 z-10">
        <p className="mb-2">Demo Login Credentials:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded p-2">
            <strong>Student:</strong><br/>
            Email: 23025331844001@student.csmss.edu.in<br/>
            Password: Pass@123
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded p-2">
            <strong>Teacher:</strong><br/>
            Email: rajesh.mehta@csmss.edu.in<br/>
            Password: Pass@123
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 rounded p-2">
            <strong>HOD:</strong><br/>
            Email: hod.ece@csmss.edu.in<br/>
            Password: Pass@123
          </div>
        </div>
      </div>

      {/* Mobile Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 640px) {
          .login-card {
            margin: 1rem;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;