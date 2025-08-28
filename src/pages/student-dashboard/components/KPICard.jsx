import React from 'react';
import Icon from '../../../components/AppIcon';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, subtitle, icon, color = 'primary', trend = null, onClick = null }) => {
  const getColorClasses = (colorType) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-success/10 text-success border-success/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      error: 'bg-error/10 text-error border-error/20',
      accent: 'bg-accent/10 text-accent border-accent/20'
    };
    return colorMap?.[colorType] || colorMap?.primary;
  };

  const getTrendColor = (trendValue) => {
    if (trendValue > 0) return 'text-success';
    if (trendValue < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trendValue) => {
    if (trendValue > 0) return 'TrendingUp';
    if (trendValue < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card border border-border rounded-lg p-6 hover:shadow-elevated transition-smooth ${
        onClick ? 'cursor-pointer hover:border-primary/30' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {trend !== null && (
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor(trend)}`}>
                <Icon name={getTrendIcon(trend)} size={14} />
                <span>{Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </motion.div>
  );
};

export default KPICard;