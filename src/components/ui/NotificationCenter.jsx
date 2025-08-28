import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ 
  isOpen = false, 
  onClose = () => {}, 
  notifications = [],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onNotificationClick = () => {},
  className = ''
}) => {
  const [filter, setFilter] = useState('all');
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  useEffect(() => {
    let filtered = notifications;
    
    switch (filter) {
      case 'unread':
        filtered = notifications?.filter(n => !n?.read);
        break;
      case 'attendance':
        filtered = notifications?.filter(n => n?.category === 'attendance');
        break;
      case 'marks':
        filtered = notifications?.filter(n => n?.category === 'marks');
        break;
      case 'system':
        filtered = notifications?.filter(n => n?.category === 'system');
        break;
      default:
        filtered = notifications;
    }
    
    setFilteredNotifications(filtered);
  }, [notifications, filter]);

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const getNotificationIcon = (category, type) => {
    const iconMap = {
      attendance: 'UserCheck',
      marks: 'GraduationCap',
      system: 'Settings',
      announcement: 'Megaphone',
      reminder: 'Clock',
      approval: 'CheckCircle',
      warning: 'AlertTriangle',
      error: 'AlertCircle'
    };
    return iconMap?.[category] || iconMap?.[type] || 'Bell';
  };

  const getNotificationColor = (category, type, priority) => {
    if (priority === 'high') return 'text-error';
    if (priority === 'medium') return 'text-warning';
    
    const colorMap = {
      attendance: 'text-accent',
      marks: 'text-success',
      system: 'text-secondary',
      announcement: 'text-primary',
      approval: 'text-success',
      warning: 'text-warning',
      error: 'text-error'
    };
    return colorMap?.[category] || colorMap?.[type] || 'text-muted-foreground';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    if (!notification?.read) {
      onMarkAsRead(notification?.id);
    }
    onNotificationClick(notification);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-1100 ${className}`} onClick={onClose}>
      <div 
        className="fixed right-4 top-20 w-96 max-w-[calc(100vw-2rem)] bg-popover border border-border rounded-lg shadow-elevated animate-slide-in"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-foreground" />
            <h2 className="font-semibold text-popover-foreground">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-1 p-2 border-b border-border bg-muted/30">
          {[
            { key: 'all', label: 'All', count: notifications?.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'attendance', label: 'Attendance', count: notifications?.filter(n => n?.category === 'attendance')?.length },
            { key: 'marks', label: 'Marks', count: notifications?.filter(n => n?.category === 'marks')?.length }
          ]?.map((tab) => (
            <Button
              key={tab?.key}
              variant={filter === tab?.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(tab?.key)}
              className="text-xs h-8 px-3"
            >
              {tab?.label}
              {tab?.count > 0 && (
                <span className="ml-1 text-xs opacity-70">({tab?.count})</span>
              )}
            </Button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredNotifications?.length > 0 ? (
            filteredNotifications?.map((notification) => (
              <div
                key={notification?.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-smooth ${
                  !notification?.read ? 'bg-accent/5 border-l-4 border-l-accent' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${getNotificationColor(notification?.category, notification?.type, notification?.priority)}`}>
                    <Icon 
                      name={getNotificationIcon(notification?.category, notification?.type)} 
                      size={18} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium ${!notification?.read ? 'text-popover-foreground' : 'text-muted-foreground'}`}>
                        {notification?.title}
                      </h4>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {formatTime(notification?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification?.message}
                    </p>
                    {notification?.actionRequired && (
                      <div className="mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={(e) => {
                            e?.stopPropagation();
                            console.log('Action clicked:', notification?.action);
                          }}
                        >
                          {notification?.actionLabel || 'Take Action'}
                        </Button>
                      </div>
                    )}
                    {!notification?.read && (
                      <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications?.length > 0 && (
          <div className="p-3 border-t border-border bg-muted/30">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm"
              onClick={() => console.log('View all notifications')}
            >
              View All Notifications
              <Icon name="ExternalLink" size={14} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;