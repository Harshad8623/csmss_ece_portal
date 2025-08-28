import React from 'react';
import Icon from '../../../components/AppIcon';

import { motion } from 'framer-motion';

const QuickActionsPanel = ({ onLeaveApplication, onGrievanceSubmission, onProfileSettings }) => {
  const quickActions = [
    {
      title: "Apply for Leave",
      description: "Submit leave application with date range",
      icon: "Calendar",
      color: "primary",
      action: onLeaveApplication
    },
    {
      title: "File Grievance",
      description: "Report issues with marks or attendance",
      icon: "AlertCircle",
      color: "warning",
      action: onGrievanceSubmission
    },
    {
      title: "Profile Settings",
      description: "Update personal information and preferences",
      icon: "Settings",
      color: "secondary",
      action: onProfileSettings
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      primary: 'hover:bg-primary/5 hover:border-primary/30',
      warning: 'hover:bg-warning/5 hover:border-warning/30',
      secondary: 'hover:bg-secondary/5 hover:border-secondary/30'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  const getIconColor = (color) => {
    const colorMap = {
      primary: 'text-primary',
      warning: 'text-warning',
      secondary: 'text-secondary'
    };
    return colorMap?.[color] || colorMap?.primary;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="space-y-4">
        {quickActions?.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            className={`p-4 border border-border rounded-lg cursor-pointer transition-smooth ${getColorClasses(action?.color)}`}
            onClick={action?.action}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-muted ${getIconColor(action?.color)}`}>
                <Icon name={action?.icon} size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-foreground mb-1">{action?.title}</h4>
                <p className="text-sm text-muted-foreground">{action?.description}</p>
              </div>
              <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActionsPanel;