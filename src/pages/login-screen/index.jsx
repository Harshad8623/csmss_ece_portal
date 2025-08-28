import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import LoginCard from './components/LoginCard';
import ThemeToggle from './components/ThemeToggle';
import BackgroundPattern from './components/BackgroundPattern';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Mock authentication data
  const mockUsers = [
    // Students (PRN: 23025331844001-23025331844075)
    { username: '23025331844001', password: 'Pass@123', role: 'student', name: 'Aarav Sharma', firstLogin: true },
    { username: '23025331844002', password: 'Pass@123', role: 'student', name: 'Priya Patel', firstLogin: true },
    { username: '23025331844003', password: 'Pass@123', role: 'student', name: 'Rohit Kumar', firstLogin: false },
    { username: '23025331844004', password: 'Pass@123', role: 'student', name: 'Sneha Desai', firstLogin: true },
    { username: '23025331844005', password: 'Pass@123', role: 'student', name: 'Arjun Singh', firstLogin: false },
    
    // Teachers (Teacher ID: T0001-T0005)
    { username: 'T0001', password: 'Pass@123', role: 'teacher', name: 'Dr. Rajesh Mehta', designation: 'Professor', firstLogin: false },
    { username: 'T0002', password: 'Pass@123', role: 'teacher', name: 'Prof. Sunita Joshi', designation: 'Associate Professor', firstLogin: true },
    { username: 'T0003', password: 'Pass@123', role: 'teacher', name: 'Dr. Amit Gupta', designation: 'Assistant Professor', firstLogin: false },
    { username: 'T0004', password: 'Pass@123', role: 'teacher', name: 'Prof. Kavita Sharma', designation: 'HOD', firstLogin: false },
    { username: 'T0005', password: 'Pass@123', role: 'teacher', name: 'Dr. Vikram Patil', designation: 'Assistant Professor', firstLogin: true }
  ];

  const handleLogin = async (formData) => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find user in mock data
      const user = mockUsers?.find(
        u => u?.username === formData?.username && u?.password === formData?.password
      );

      if (!user) {
        throw new Error('Invalid username or password. Please check your credentials.');
      }

      // Store user data in localStorage (in real app, this would be JWT token)
      const userData = {
        username: user?.username,
        name: user?.name,
        role: user?.role,
        designation: user?.designation,
        firstLogin: user?.firstLogin,
        loginTime: new Date()?.toISOString()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');

      // Navigate based on role
      if (user?.role === 'student') {
        navigate('/student-dashboard');
      } else if (user?.role === 'teacher') {
        if (user?.designation === 'HOD') {
          navigate('/analytics-dashboard');
        } else {
          navigate('/teacher-dashboard');
        }
      }

      // Show success message (in real app, this might be a toast notification)
      console.log(`Welcome ${user?.name}! Login successful.`);

    } catch (error) {
      throw error;
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
          />
        </LoginCard>
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