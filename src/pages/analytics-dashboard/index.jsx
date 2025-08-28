import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import dashboard components
import KPICard from './components/KPICard';
import AttendanceTrendChart from './components/AttendanceTrendChart';
import MarksDistributionChart from './components/MarksDistributionChart';
import DefaultersTable from './components/DefaultersTable';
import FilterPanel from './components/FilterPanel';
import InsightsPanel from './components/InsightsPanel';
import ExportPanel from './components/ExportPanel';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [userRole] = useState('hod');
  const [userName] = useState('Dr. Rajesh Kumar');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for KPI cards
  const kpiData = [
    {
      title: 'Department Attendance',
      value: '82.4%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'UserCheck',
      description: 'Overall attendance across all classes and subjects',
      trend: [78, 79, 81, 80, 82, 83, 82]
    },
    {
      title: 'Average Marks',
      value: '74.2',
      change: '+1.8',
      changeType: 'positive',
      icon: 'GraduationCap',
      description: 'Department-wide average marks across all assessments',
      trend: [72, 73, 74, 73, 75, 74, 74]
    },
    {
      title: 'Active Teachers',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: 'Users',
      description: 'Currently active teaching faculty members',
      trend: [22, 22, 23, 23, 24, 24, 24]
    },
    {
      title: 'Total Students',
      value: '486',
      change: '+12',
      changeType: 'positive',
      icon: 'School',
      description: 'Total enrolled students across all semesters',
      trend: [474, 476, 478, 480, 482, 484, 486]
    },
    {
      title: 'Pending Grievances',
      value: '7',
      change: '-3',
      changeType: 'positive',
      icon: 'AlertTriangle',
      description: 'Unresolved student grievances requiring attention',
      trend: [10, 9, 8, 10, 8, 7, 7]
    },
    {
      title: 'Defaulters',
      value: '23',
      change: '-5',
      changeType: 'positive',
      icon: 'UserX',
      description: 'Students below 75% attendance threshold',
      trend: [28, 27, 26, 28, 25, 24, 23]
    }
  ];

  // Mock data for attendance trends
  const attendanceTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Data Structures & Algorithms',
        data: [85, 87, 84, 86, 88, 85, 87, 86]
      },
      {
        label: 'Database Management Systems',
        data: [82, 84, 81, 83, 85, 82, 84, 83]
      },
      {
        label: 'Operating Systems',
        data: [78, 80, 77, 79, 81, 78, 80, 79]
      },
      {
        label: 'Computer Networks',
        data: [80, 82, 79, 81, 83, 80, 82, 81]
      },
      {
        label: 'Software Engineering',
        data: [83, 85, 82, 84, 86, 83, 85, 84]
      }
    ]
  };

  // Mock data for marks distribution
  const marksDistributionData = {
    labels: ['TE-A', 'TE-B', 'TE-C', 'BE-A', 'BE-B', 'BE-C'],
    datasets: [
      {
        label: 'CT1 Average',
        data: [76, 74, 78, 82, 80, 84]
      },
      {
        label: 'MidSem Average',
        data: [72, 70, 75, 79, 77, 81]
      },
      {
        label: 'CT2 Average',
        data: [78, 76, 80, 84, 82, 86]
      }
    ]
  };

  // Mock data for defaulters
  const defaultersData = [
    {
      prn: '23025331844001',
      name: 'Aarav Sharma',
      class: 'TE-A',
      attendance: 68,
      subject: 'Data Structures',
      lastUpdated: '27/12/2024'
    },
    {
      prn: '23025331844015',
      name: 'Priya Patel',
      class: 'TE-B',
      attendance: 72,
      subject: 'DBMS',
      lastUpdated: '27/12/2024'
    },
    {
      prn: '23025331844032',
      name: 'Rohit Kumar',
      class: 'BE-A',
      attendance: 65,
      subject: 'Operating Systems',
      lastUpdated: '26/12/2024'
    },
    {
      prn: '23025331844048',
      name: 'Sneha Gupta',
      class: 'BE-B',
      attendance: 70,
      subject: 'Computer Networks',
      lastUpdated: '26/12/2024'
    },
    {
      prn: '23025331844056',
      name: 'Arjun Singh',
      class: 'TE-C',
      attendance: 67,
      subject: 'Software Engineering',
      lastUpdated: '25/12/2024'
    }
  ];

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: 'Low Attendance Alert',
      message: 'TE-A section has dropped below 75% attendance in Data Structures',
      category: 'attendance',
      severity: 'warning',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
      actionRequired: true,
      actionLabel: 'Review Class'
    },
    {
      id: 2,
      title: 'Marks Upload Complete',
      message: 'CT2 marks have been uploaded for all BE sections',
      category: 'marks',
      severity: 'info',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      title: 'Grievance Pending',
      message: 'New attendance grievance submitted by student PRN 23025331844023',
      category: 'system',
      severity: 'warning',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ];

  // Mock insights data
  const insights = [
    {
      title: 'Attendance Improvement Trend',
      description: 'Overall department attendance has improved by 2.1% compared to last month, with significant gains in practical sessions.',
      period: 'Last 30 days',
      affected: 486
    },
    {
      title: 'Subject Performance Gap',
      description: 'Operating Systems shows consistently lower attendance (79%) compared to other core subjects (avg 84%).',
      period: 'Current semester',
      affected: 162
    },
    {
      title: 'Class Performance Variation',
      description: 'BE sections are outperforming TE sections by an average of 6 marks across all assessments.',
      period: 'CT1 to CT2',
      affected: 324
    }
  ];

  // Mock alerts data
  const alerts = [
    {
      title: 'Critical Attendance Drop',
      message: 'TE-A Data Structures attendance has dropped to 68% - immediate intervention required',
      severity: 'critical',
      timestamp: '2 hours ago',
      source: 'Attendance System',
      dismissed: false
    },
    {
      title: 'Marks Entry Deadline',
      message: 'CT2 marks entry deadline is approaching (31st December 2024)',
      severity: 'warning',
      timestamp: '4 hours ago',
      source: 'Academic Calendar',
      dismissed: false
    },
    {
      title: 'System Maintenance',
      message: 'Scheduled maintenance window on 1st January 2025 from 2:00 AM to 4:00 AM',
      severity: 'info',
      timestamp: '1 day ago',
      source: 'System Admin',
      dismissed: false
    }
  ];

  // Mock recommendations data
  const recommendations = [
    {
      title: 'Schedule Remedial Classes',
      description: 'Organize additional classes for students with attendance below 70% in critical subjects',
      type: 'intervention',
      priority: 'high',
      timeEstimate: '2 weeks',
      impact: 'High attendance recovery'
    },
    {
      title: 'Implement Peer Tutoring',
      description: 'Set up peer tutoring program for struggling students in Operating Systems',
      type: 'improvement',
      priority: 'medium',
      timeEstimate: '1 month',
      impact: 'Improved understanding'
    },
    {
      title: 'Update Assessment Strategy',
      description: 'Review and update continuous assessment methods to better engage students',
      type: 'maintenance',
      priority: 'medium',
      timeEstimate: '3 weeks',
      impact: 'Better evaluation'
    }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const handleExport = (exportConfig) => {
    console.log('Exporting with config:', exportConfig);
    // Simulate export process
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      alert(`Export initiated: ${exportConfig?.format?.toUpperCase()} report will be generated`);
    }, 2000);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Analytics Dashboard', path: '/analytics-dashboard', icon: 'BarChart3' }
  ];

  const contextInfo = {
    academicYear: '2024-25',
    semester: 'Odd',
    department: 'Electronics & Computer Engineering'
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        userRole={userRole}
        userName={userName}
        notifications={notifications}
      />
      <PrimaryNavigation userRole={userRole} />
      <BreadcrumbTrail
        customBreadcrumbs={breadcrumbs}
        contextInfo={contextInfo}
      />
      <main className="px-6 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive department-wide insights and performance metrics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} size={16} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsNotificationOpen(true)}
              className="flex items-center space-x-2"
            >
              <Icon name="Bell" size={16} />
              <span>Alerts</span>
              {notifications?.filter(n => !n?.read)?.length > 0 && (
                <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
                  {notifications?.filter(n => !n?.read)?.length}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        <FilterPanel onFiltersChange={handleFiltersChange} />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {kpiData?.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi?.title}
              value={kpi?.value}
              change={kpi?.change}
              changeType={kpi?.changeType}
              icon={kpi?.icon}
              description={kpi?.description}
              trend={kpi?.trend}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AttendanceTrendChart data={attendanceTrendData} />
          <MarksDistributionChart data={marksDistributionData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Defaulters Table - Takes 2 columns */}
          <div className="xl:col-span-2">
            <DefaultersTable data={defaultersData} />
          </div>

          {/* Right Sidebar - Takes 1 column */}
          <div className="space-y-6">
            <InsightsPanel
              insights={insights}
              alerts={alerts}
              recommendations={recommendations}
            />
            <ExportPanel onExport={handleExport} />
          </div>
        </div>

        {/* Additional Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Clock" size={20} className="text-primary" />
              <h3 className="font-semibold text-foreground">Today's Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Classes Conducted</span>
                <span className="font-medium text-foreground">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Attendance Marked</span>
                <span className="font-medium text-foreground">16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending Entries</span>
                <span className="font-medium text-error">2</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="TrendingUp" size={20} className="text-success" />
              <h3 className="font-semibold text-foreground">Performance Trends</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Improving Students</span>
                <span className="font-medium text-success">142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Stable Performance</span>
                <span className="font-medium text-foreground">298</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Need Attention</span>
                <span className="font-medium text-warning">46</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Users" size={20} className="text-accent" />
              <h3 className="font-semibold text-foreground">Faculty Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Today</span>
                <span className="font-medium text-foreground">22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">On Leave</span>
                <span className="font-medium text-muted-foreground">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Pending Tasks</span>
                <span className="font-medium text-warning">8</span>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Calendar" size={20} className="text-secondary" />
              <h3 className="font-semibold text-foreground">Upcoming Events</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">CT2 Deadline</span>
                <span className="font-medium text-error">3 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Semester End</span>
                <span className="font-medium text-foreground">15 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Faculty Meeting</span>
                <span className="font-medium text-accent">Tomorrow</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => console.log('Mark as read:', id)}
        onMarkAllAsRead={() => console.log('Mark all as read')}
        onNotificationClick={(notification) => console.log('Notification clicked:', notification)}
      />
    </div>
  );
};

export default AnalyticsDashboard;