import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      attendance: 'UserCheck',
      marks: 'GraduationCap',
      leave: 'Calendar',
      grievance: 'MessageSquare',
      announcement: 'Megaphone',
      system: 'Settings'
    };
    return iconMap?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      attendance: 'text-accent bg-accent/10',
      marks: 'text-success bg-success/10',
      leave: 'text-warning bg-warning/10',
      grievance: 'text-error bg-error/10',
      announcement: 'text-primary bg-primary/10',
      system: 'text-secondary bg-secondary/10'
    };
    return colorMap?.[type] || 'text-muted-foreground bg-muted/10';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="ExternalLink"
          iconPosition="right"
          onClick={() => console.log('View all activities')}
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {activities?.length > 0 ? (
          activities?.slice(0, 8)?.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-smooth">
              <div className={`p-2 rounded-lg ${getActivityColor(activity?.type)}`}>
                <Icon name={getActivityIcon(activity?.type)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-1">
                  {activity?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {activity?.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(activity?.timestamp)}
                  </span>
                  {activity?.actionRequired && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-6 px-2"
                      onClick={() => console.log('Handle activity action:', activity?.id)}
                    >
                      {activity?.actionLabel || 'Action'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Icon name="Activity" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;