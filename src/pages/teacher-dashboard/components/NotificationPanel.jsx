import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationPanel = ({ notifications = [] }) => {
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications?.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification?.read;
    return notification?.priority === filter;
  });

  const getNotificationIcon = (type) => {
    const iconMap = {
      leave: 'Calendar',
      grievance: 'MessageSquare',
      attendance: 'UserCheck',
      marks: 'GraduationCap',
      system: 'Settings',
      reminder: 'Clock'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      high: 'text-error bg-error/10 border-error/20',
      medium: 'text-warning bg-warning/10 border-warning/20',
      low: 'text-muted-foreground bg-muted/10 border-border'
    };
    return colorMap?.[priority] || colorMap?.low;
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

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          onClick={() => console.log('Notification settings')}
        />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'high', label: 'High Priority' },
          { key: 'medium', label: 'Medium' }
        ]?.map((tab) => (
          <Button
            key={tab?.key}
            variant={filter === tab?.key ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setFilter(tab?.key)}
            className="text-xs h-8"
          >
            {tab?.label}
          </Button>
        ))}
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredNotifications?.length > 0 ? (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-3 rounded-lg border transition-smooth hover:shadow-soft cursor-pointer ${
                !notification?.read ? 'bg-accent/5 border-accent/20' : 'bg-background border-border'
              } ${getPriorityColor(notification?.priority)}`}
              onClick={() => console.log('View notification:', notification?.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-1 rounded ${getPriorityColor(notification?.priority)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h4 className={`text-sm font-medium ${!notification?.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification?.title}
                    </h4>
                    <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                      {formatTime(notification?.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {notification?.message}
                  </p>
                  {notification?.actionRequired && (
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                        onClick={(e) => {
                          e?.stopPropagation();
                          console.log('Notification action:', notification?.action);
                        }}
                      >
                        {notification?.actionLabel || 'Take Action'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;