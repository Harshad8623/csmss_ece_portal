import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InsightsPanel = ({ insights, alerts, recommendations, className = '' }) => {
  const [activeTab, setActiveTab] = useState('insights');

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-error bg-error/10 border-error/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'info': return 'text-accent bg-accent/10 border-accent/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getRecommendationIcon = (type) => {
    switch (type) {
      case 'intervention': return 'UserCheck';
      case 'improvement': return 'TrendingUp';
      case 'maintenance': return 'Settings';
      default: return 'Lightbulb';
    }
  };

  const tabs = [
    { key: 'insights', label: 'Key Insights', icon: 'BarChart3', count: insights?.length },
    { key: 'alerts', label: 'Alerts', icon: 'AlertTriangle', count: alerts?.filter(a => !a?.dismissed)?.length },
    { key: 'recommendations', label: 'Actions', icon: 'Lightbulb', count: recommendations?.length }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="border-b border-border">
        <div className="flex items-center">
          {tabs?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setActiveTab(tab?.key)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
                activeTab === tab?.key
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.count > 0 && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  activeTab === tab?.key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'insights' && (
          <div className="space-y-4">
            {insights?.map((insight, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Icon name="TrendingUp" size={18} className="text-success" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{insight?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight?.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Icon name="Calendar" size={12} />
                        <span>{insight?.period}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icon name="Users" size={12} />
                        <span>{insight?.affected} students</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-3">
            {alerts?.filter(alert => !alert?.dismissed)?.map((alert, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getAlertColor(alert?.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <Icon name={getAlertIcon(alert?.severity)} size={18} />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{alert?.title}</h4>
                      <p className="text-sm opacity-80 mb-2">{alert?.message}</p>
                      <div className="flex items-center space-x-4 text-xs opacity-70">
                        <span>{alert?.timestamp}</span>
                        <span>{alert?.source}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-60 hover:opacity-100">
                    <Icon name="X" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recommendations' && (
          <div className="space-y-4">
            {recommendations?.map((rec, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    <Icon name={getRecommendationIcon(rec?.type)} size={18} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground">{rec?.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        rec?.priority === 'high' ? 'bg-error/10 text-error' :
                        rec?.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-accent/10 text-accent'
                      }`}>
                        {rec?.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{rec?.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>Est. {rec?.timeEstimate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Target" size={12} />
                          <span>{rec?.impact}</span>
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        Take Action
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full">
          <Icon name="ExternalLink" size={14} className="mr-2" />
          View Detailed Analytics Report
        </Button>
      </div>
    </div>
  );
};

export default InsightsPanel;