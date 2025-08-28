import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AttendanceChart from './AttendanceChart';
import MarksChart from './MarksChart';
import { motion } from 'framer-motion';

const DashboardTabs = ({ attendanceData, marksData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: 'LayoutDashboard'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: 'UserCheck'
    },
    {
      id: 'marks',
      label: 'Marks',
      icon: 'GraduationCap'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <div className="space-y-6">
            <AttendanceChart attendanceData={attendanceData} />
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Attendance Details</h3>
              <div className="space-y-3">
                {attendanceData?.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `rgba(30, 64, 175, ${0.8 - index * 0.1})` }} />
                      <span className="font-medium text-foreground">{subject?.subject}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        {subject?.attended}/{subject?.total} classes
                      </span>
                      <span className={`font-semibold ${
                        subject?.percentage >= 75 ? 'text-success' : 
                        subject?.percentage >= 65 ? 'text-warning' : 'text-error'
                      }`}>
                        {subject?.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'marks':
        return (
          <div className="space-y-6">
            <MarksChart marksData={marksData} />
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Marks Breakdown</h3>
              <div className="space-y-3">
                {marksData?.map((subject, index) => (
                  <div key={index} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{subject?.subject}</h4>
                      <span className="text-sm text-muted-foreground">
                        Total: {subject?.ct1 + subject?.midSem + subject?.ct2}/90
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CT1</p>
                        <p className="font-semibold text-foreground">{subject?.ct1}/30</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">MidSem</p>
                        <p className="font-semibold text-foreground">{subject?.midSem}/30</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CT2</p>
                        <p className="font-semibold text-foreground">{subject?.ct2}/30</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AttendanceChart attendanceData={attendanceData} />
            <MarksChart marksData={marksData} />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-lg p-2">
        <div className="flex space-x-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? 'default' : 'ghost'}
              onClick={() => setActiveTab(tab?.id)}
              className="flex items-center space-x-2 flex-1 justify-center"
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default DashboardTabs;