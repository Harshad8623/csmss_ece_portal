import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const PrimaryNavigation = ({ userRole = 'student', className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = (role) => {
    const baseItems = [
      {
        label: 'Dashboard',
        path: role === 'student' ? '/student-dashboard' : '/teacher-dashboard',
        icon: 'LayoutDashboard',
        roles: ['student', 'teacher', 'admin', 'hod']
      }
    ];

    const teacherItems = [
      {
        label: 'Attendance',
        path: '/attendance-management',
        icon: 'UserCheck',
        roles: ['teacher', 'admin', 'hod']
      },
      {
        label: 'Marks',
        path: '/marks-management',
        icon: 'GraduationCap',
        roles: ['teacher', 'admin', 'hod']
      },
      {
        label: 'Analytics',
        path: '/analytics-dashboard',
        icon: 'BarChart3',
        roles: ['teacher', 'admin', 'hod']
      }
    ];

    const allItems = [...baseItems, ...teacherItems];
    return allItems?.filter(item => item?.roles?.includes(role));
  };

  const navigationItems = getNavigationItems(userRole);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location?.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`hidden md:block bg-card border-b border-border sticky top-16 z-900 ${className}`}>
        <div className="px-6">
          <div className="flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActive(item?.path) ? 'default' : 'ghost'}
                onClick={() => handleNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-none border-b-2 transition-smooth ${
                  isActive(item?.path)
                    ? 'border-primary bg-primary/5 text-primary' :'border-transparent hover:border-muted hover:bg-muted/50'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>
      {/* Mobile Navigation - Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-900 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems?.slice(0, 4)?.map((item) => (
            <Button
              key={item?.path}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 min-w-0 flex-1 transition-smooth ${
                isActive(item?.path)
                  ? 'text-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="text-xs font-medium truncate">{item?.label}</span>
            </Button>
          ))}
          
          {navigationItems?.length > 4 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex flex-col items-center space-y-1 px-3 py-2 min-w-0 flex-1 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <Icon name="MoreHorizontal" size={20} />
              <span className="text-xs font-medium">More</span>
            </Button>
          )}
        </div>
      </nav>
      {/* Mobile Overflow Menu */}
      {isMobileMenuOpen && navigationItems?.length > 4 && (
        <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-1200" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed bottom-16 left-4 right-4 bg-card border border-border rounded-lg shadow-elevated animate-slide-in">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">More Options</h3>
            </div>
            <div className="py-2">
              {navigationItems?.slice(4)?.map((item) => (
                <Button
                  key={item?.path}
                  variant="ghost"
                  onClick={() => handleNavigation(item?.path)}
                  className={`w-full justify-start px-4 py-3 transition-smooth ${
                    isActive(item?.path)
                      ? 'bg-primary/5 text-primary' :'hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} className="mr-3" />
                  <span className="font-medium">{item?.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Mobile Content Spacer */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default PrimaryNavigation;