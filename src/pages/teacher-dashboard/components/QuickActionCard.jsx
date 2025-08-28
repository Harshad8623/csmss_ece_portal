import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActionCard = ({ 
  title, 
  description, 
  icon, 
  actions = [], 
  className = '' 
}) => {
  return (
    <div className={`bg-card border border-border rounded-lg p-6 transition-smooth hover:shadow-soft ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          
          <div className="flex flex-wrap gap-2">
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant={action?.variant || 'outline'}
                size="sm"
                onClick={action?.onClick}
                iconName={action?.icon}
                iconPosition="left"
                disabled={action?.disabled}
                loading={action?.loading}
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionCard;