import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, 
  Search, 
  Settings, 
  LogOut, 
  User, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const GlobalHeader = ({ title = 'CSMSS ECE Portal' }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login-screen');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      path: profile?.role === 'student' ? '/student-dashboard' : 
            profile?.role === 'teacher'? '/teacher-dashboard' : '/analytics-dashboard',
      roles: ['student', 'teacher', 'hod', 'admin']
    },
    {
      name: 'Attendance',
      path: '/attendance-management',
      roles: ['teacher', 'hod', 'admin']
    },
    {
      name: 'Marks',
      path: '/marks-management',
      roles: ['teacher', 'hod', 'admin']
    },
    {
      name: 'Analytics',
      path: '/analytics-dashboard',
      roles: ['hod', 'admin']
    }
  ];

  const visibleNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(profile?.role)
  );

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo & Title */}
          <div className="flex items-center ml-2 md:ml-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">Electronics & Computer Engineering</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {visibleNavItems?.map((item) => (
            <button
              key={item?.name}
              onClick={() => navigate(item?.path)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location?.pathname === item?.path
                  ? 'text-blue-700 bg-blue-50' :'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item?.name}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search (Desktop Only) */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role || 'Student'}
                </p>
              </div>
              <ChevronDown className="hidden md:block h-4 w-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Navigate to profile page when implemented
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    // Navigate to settings page when implemented
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                
                <hr className="my-1" />
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
          <nav className="flex flex-col space-y-2 mt-4">
            {visibleNavItems?.map((item) => (
              <button
                key={item?.name}
                onClick={() => {
                  navigate(item?.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-base font-medium rounded-md transition-colors ${
                  location?.pathname === item?.path
                    ? 'text-blue-700 bg-blue-50' :'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item?.name}
              </button>
            ))}
          </nav>
          
          {/* Mobile Search */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}
      {/* Overlay for mobile dropdown */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default GlobalHeader;