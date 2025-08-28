import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  trendValue, 
  actionLabel, 
  onActionClick, 
  variant = 'default',
  loading = false 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'error':
        return 'border-error/20 bg-error/5';
      case 'primary':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'primary':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus';
  };

  if (loading) {
    return (
      <div className={`p-6 rounded-lg border ${getVariantStyles()} animate-pulse`}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-muted rounded-lg"></div>
          <div className="w-16 h-4 bg-muted rounded"></div>
        </div>
        <div className="w-20 h-8 bg-muted rounded mb-2"></div>
        <div className="w-24 h-4 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg border transition-smooth hover:shadow-soft ${getVariantStyles()}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg bg-background/50 ${getIconColor()}`}>
          <Icon name={icon} size={20} />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="mb-2">
        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>
      )}
      
      {actionLabel && onActionClick && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onActionClick}
          className="w-full justify-start px-0 text-xs h-8"
        >
          {actionLabel}
          <Icon name="ArrowRight" size={14} className="ml-auto" />
        </Button>
      )}
    </div>
  );
};

export default KPICard;