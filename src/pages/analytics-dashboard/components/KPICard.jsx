import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon, 
  description,
  trend = [],
  className = '' 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 hover:shadow-soft transition-smooth ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name={icon} size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center space-x-1">
                <Icon name={getChangeIcon()} size={14} className={getChangeColor()} />
                <span className={`text-sm font-medium ${getChangeColor()}`}>
                  {change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        </div>
        {trend?.length > 0 && (
          <div className="w-16 h-8">
            <svg className="w-full h-full" viewBox="0 0 64 32">
              <polyline
                points={trend?.map((point, index) => `${(index / (trend?.length - 1)) * 64},${32 - (point / 100) * 32}`)?.join(' ')}
                fill="none"
                stroke={changeType === 'positive' ? 'rgb(5, 150, 105)' : changeType === 'negative' ? 'rgb(220, 38, 38)' : 'rgb(100, 116, 139)'}
                strokeWidth="2"
                className="opacity-60"
              />
            </svg>
          </div>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-3">
          {description}
        </p>
      )}
    </div>
  );
};

export default KPICard;