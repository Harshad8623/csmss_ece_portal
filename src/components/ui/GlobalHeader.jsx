import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';


const GlobalHeader = ({ userRole = 'student', userName = 'John Doe', notifications = [] }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const handleSearch = (e) => {
    e?.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    setIsProfileOpen(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationOpen(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      student: 'Student',
      teacher: 'Teacher',
      admin: 'Administrator',
      hod: 'HOD'
    };
    return roleMap?.[role] || 'User';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000 shadow-soft">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">CSMSS</span>
              <span className="text-xs text-muted-foreground -mt-1">ECE Portal</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <input
              type="text"
              placeholder="Search students, subjects, or records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
            />
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => console.log('Mobile search')}
          >
            <Icon name="Search" size={20} />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-80 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-slide-in">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-popover-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications?.slice(0, 5)?.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-4 border-b border-border hover:bg-muted transition-smooth cursor-pointer ${
                          !notification?.read ? 'bg-accent/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${!notification?.read ? 'bg-accent' : 'bg-muted'}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-popover-foreground">{notification?.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification?.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification?.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No notifications</p>
                    </div>
                  )}
                </div>
                {notifications?.length > 5 && (
                  <div className="p-3 border-t border-border">
                    <Button variant="ghost" size="sm" className="w-full">
                      View all notifications
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={handleProfileClick}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm">
                  {userName?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{getRoleDisplayName(userRole)}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </Button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-slide-in">
                <div className="p-4 border-b border-border">
                  <p className="font-medium text-popover-foreground">{userName}</p>
                  <p className="text-sm text-muted-foreground">{getRoleDisplayName(userRole)}</p>
                </div>
                <div className="py-2">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="User" size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="Settings" size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="HelpCircle" size={16} />
                    <span>Help & Support</span>
                  </button>
                  <div className="border-t border-border mt-2 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-error hover:bg-muted transition-smooth flex items-center space-x-2"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;