import React from 'react';
import { useNotifications, useSupabaseMutation } from '../../../hooks/useSupabaseData';
import { Bell, Info, Calendar, BookOpen } from 'lucide-react';

const NotificationsFeed = () => {
  const { data: notifications, loading, refetch } = useNotifications();
  const { mutate } = useSupabaseMutation();

  const markAsRead = async (notificationId) => {
    try {
      await mutate(async () => {
        const { error } = await supabase?.from('notifications')?.update({ is_read: true, read_at: new Date()?.toISOString() })?.eq('id', notificationId);
        
        if (error) throw error;
        return { data: { success: true } };
      });
      
      refetch?.(); // Refresh notifications list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'attendance':
        return Calendar;
      case 'marks':
        return BookOpen;
      case 'announcement':
        return Bell;
      default:
        return Info;
    }
  };

  const getNotificationColor = (type, isRead) => {
    const baseClasses = isRead ? 'bg-gray-50' : 'bg-blue-50';
    const iconClasses = {
      'attendance': 'text-yellow-600',
      'marks': 'text-green-600',
      'announcement': 'text-blue-600',
      'general': 'text-gray-600'
    };
    
    return {
      container: baseClasses,
      icon: iconClasses?.[type] || iconClasses?.general
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
        <div className="space-y-4">
          {[...Array(3)]?.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Notifications</h2>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">
              {notifications?.filter(n => !n?.is_read)?.length || 0} unread
            </span>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {notifications?.length > 0 ? (
          notifications?.map((notification) => {
            const Icon = getNotificationIcon(notification?.notification_type);
            const colors = getNotificationColor(notification?.notification_type, notification?.is_read);
            
            return (
              <div 
                key={notification?.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${colors?.container}`}
                onClick={() => !notification?.is_read && markAsRead(notification?.id)}
              >
                <div className="flex space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    notification?.is_read ? 'bg-gray-200' : 'bg-white border-2 border-current'
                  }`}>
                    <Icon className={`h-5 w-5 ${colors?.icon}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          notification?.is_read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification?.title || 'Notification'}
                        </p>
                        <p className={`text-sm mt-1 ${
                          notification?.is_read ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification?.message || 'No message content'}
                        </p>
                        
                        <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                          <span>
                            {notification?.created_at 
                              ? new Date(notification.created_at)?.toLocaleDateString()
                              : 'No date'
                            }
                          </span>
                          {notification?.created_by_user?.full_name && (
                            <span>
                              From: {notification?.created_by_user?.full_name}
                            </span>
                          )}
                          <span className="capitalize">
                            {notification?.notification_type || 'general'}
                          </span>
                        </div>
                      </div>
                      
                      {!notification?.is_read && (
                        <div className="flex-shrink-0 ml-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              You're all caught up! New notifications will appear here.
            </p>
          </div>
        )}
      </div>
      {notifications?.length > 5 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
};

// Import supabase for the markAsRead function
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';


export default NotificationsFeed;