import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { motion } from 'framer-motion';

const NotificationsFeed = ({ notifications, onViewAll, onMarkAsRead }) => {
  const getNotificationIcon = (type) => {
    const iconMap = {
      marks: 'GraduationCap',
      attendance: 'UserCheck',
      leave: 'Calendar',
      grievance: 'AlertCircle',
      system: 'Bell'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    
    const colorMap = {
      marks: 'text-success',
      attendance: 'text-accent',
      leave: 'text-warning',
      grievance: 'text-error',
      system: 'text-primary'
    };
    return colorMap?.[type] || 'text-muted-foreground';
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Updates</h3>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notifications?.length > 0 ? (
          notifications?.slice(0, 5)?.map((notification, index) => (
            <motion.div
              key={notification?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className={`p-3 border border-border rounded-lg hover:bg-muted/50 transition-smooth ${
                !notification?.read ? 'bg-accent/5 border-l-4 border-l-accent' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${getNotificationColor(notification?.type, notification?.priority)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={16} />
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
                  {!notification?.read && (
                    <div className="flex items-center justify-between mt-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkAsRead(notification?.id)}
                        className="text-xs h-6 px-2"
                      >
                        Mark as read
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Bell" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent notifications</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NotificationsFeed;