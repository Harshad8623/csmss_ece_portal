import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import KPICard from './components/KPICard';
import QuickActionCard from './components/QuickActionCard';
import AttendanceChart from './components/AttendanceChart';
import MarksDistributionChart from './components/MarksDistributionChart';
import StudentPerformanceMatrix from './components/StudentPerformanceMatrix';
import RecentActivity from './components/RecentActivity';
import NotificationPanel from './components/NotificationPanel';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('teacher');
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');

  // Mock user data
  const userData = {
    name: "Dr. Priya Sharma",
    role: userRole,
    teacherId: "T0001",
    subjects: ["Digital Signal Processing", "Microprocessors", "Communication Systems"],
    classes: ["TE-A", "TE-B", "BE-A"]
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Leave Application Pending",
      message: "Rahul Patel (23025331844015) has applied for leave from 28/08/2024 to 30/08/2024",
      type: "leave",
      priority: "high",
      read: false,
      timestamp: new Date(Date.now() - 300000),
      actionRequired: true,
      actionLabel: "Review"
    },
    {
      id: 2,
      title: "Attendance Below 75%",
      message: "5 students in TE-A have attendance below 75% threshold",
      type: "attendance",
      priority: "medium",
      read: false,
      timestamp: new Date(Date.now() - 1800000),
      actionRequired: true,
      actionLabel: "View List"
    },
    {
      id: 3,
      title: "Marks Entry Reminder",
      message: "CT1 marks entry deadline is tomorrow for Digital Signal Processing",
      type: "marks",
      priority: "high",
      read: true,
      timestamp: new Date(Date.now() - 3600000),
      actionRequired: true,
      actionLabel: "Enter Marks"
    },
    {
      id: 4,
      title: "Grievance Submitted",
      message: "Sneha Desai has submitted a grievance regarding CT1 marks",
      type: "grievance",
      priority: "medium",
      read: false,
      timestamp: new Date(Date.now() - 7200000),
      actionRequired: true,
      actionLabel: "Review"
    }
  ];

  // Mock recent activities
  const recentActivities = [
    {
      id: 1,
      title: "Attendance marked for TE-A",
      description: "Digital Signal Processing - Theory lecture, 28 present out of 30",
      type: "attendance",
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: 2,
      title: "CT1 marks uploaded",
      description: "Microprocessors subject - 25 students evaluated",
      type: "marks",
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 3,
      title: "Leave approved",
      description: "Approved 2-day leave for Amit Kumar (23025331844020)",
      type: "leave",
      timestamp: new Date(Date.now() - 7200000),
      actionRequired: false
    },
    {
      id: 4,
      title: "System announcement",
      description: "Mid-semester exam schedule has been updated",
      type: "system",
      timestamp: new Date(Date.now() - 10800000)
    }
  ];

  // Mock student performance data
  const studentPerformanceData = [
    {
      prn: "23025331844001",
      name: "Aarav Patel",
      email: "aarav.patel@student.csmss.edu.in",
      attendance: 92,
      marks: 85
    },
    {
      prn: "23025331844002",
      name: "Diya Sharma",
      email: "diya.sharma@student.csmss.edu.in",
      attendance: 88,
      marks: 78
    },
    {
      prn: "23025331844003",
      name: "Arjun Singh",
      email: "arjun.singh@student.csmss.edu.in",
      attendance: 72,
      marks: 65
    },
    {
      prn: "23025331844004",
      name: "Kavya Reddy",
      email: "kavya.reddy@student.csmss.edu.in",
      attendance: 95,
      marks: 92
    },
    {
      prn: "23025331844005",
      name: "Rohit Kumar",
      email: "rohit.kumar@student.csmss.edu.in",
      attendance: 68,
      marks: 58
    }
  ];

  // Mock attendance chart data
  const attendanceChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Digital Signal Processing',
        data: [85, 88, 82, 90, 87, 85, 89, 92],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Microprocessors',
        data: [78, 82, 85, 83, 86, 88, 85, 87],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Communication Systems',
        data: [92, 89, 91, 88, 90, 93, 91, 89],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.3
      }
    ]
  };

  // Mock marks distribution data
  const marksDistributionData = {
    labels: ['0-40', '41-50', '51-60', '61-70', '71-80', '81-90', '91-100'],
    datasets: [
      {
        label: 'CT1 Marks',
        data: [2, 3, 8, 12, 15, 8, 2],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'MidSem Marks',
        data: [1, 2, 6, 10, 18, 10, 3],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuickAction = (action) => {
    switch (action) {
      case 'mark-attendance': navigate('/attendance-management');
        break;
      case 'enter-marks': navigate('/marks-management');
        break;
      case 'view-analytics': navigate('/analytics-dashboard');
        break;
      case 'bulk-upload': console.log('Open bulk upload modal');
        break;
      case 'generate-report': console.log('Generate attendance report');
        break;
      case 'mark-all-present': console.log('Mark all students present');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const getKPIData = () => {
    return [
      {
        title: "Classes Today",
        value: "4",
        subtitle: "2 completed, 2 upcoming",
        icon: "Calendar",
        trend: "up",
        trendValue: "+1",
        variant: "primary",
        actionLabel: "View Schedule",
        onActionClick: () => console.log('View today schedule')
      },
      {
        title: "Pending Leaves",
        value: "3",
        subtitle: "Requires approval",
        icon: "Clock",
        variant: "warning",
        actionLabel: "Review Applications",
        onActionClick: () => console.log('Review leave applications')
      },
      {
        title: "Low Attendance Alerts",
        value: "8",
        subtitle: "Students below 75%",
        icon: "AlertTriangle",
        trend: "down",
        trendValue: "-2",
        variant: "error",
        actionLabel: "View Defaulters",
        onActionClick: () => console.log('View attendance defaulters')
      },
      {
        title: "Average Class Performance",
        value: "82%",
        subtitle: "Across all subjects",
        icon: "TrendingUp",
        trend: "up",
        trendValue: "+3%",
        variant: "success",
        actionLabel: "View Details",
        onActionClick: () => navigate('/analytics-dashboard')
      }
    ];
  };

  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Attendance Management",
        description: "Mark attendance, view records, and manage student presence",
        icon: "UserCheck",
        actions: [
          {
            label: "Mark Attendance",
            variant: "default",
            icon: "Plus",
            onClick: () => handleQuickAction('mark-attendance')
          },
          {
            label: "Mark All Present",
            variant: "outline",
            icon: "CheckCircle",
            onClick: () => handleQuickAction('mark-all-present')
          },
          {
            label: "Upload CSV",
            variant: "outline",
            icon: "Upload",
            onClick: () => handleQuickAction('bulk-upload')
          }
        ]
      },
      {
        title: "Marks Management",
        description: "Enter marks, manage evaluations, and track student progress",
        icon: "GraduationCap",
        actions: [
          {
            label: "Enter Marks",
            variant: "default",
            icon: "Edit",
            onClick: () => handleQuickAction('enter-marks')
          },
          {
            label: "Bulk Upload",
            variant: "outline",
            icon: "Upload",
            onClick: () => handleQuickAction('bulk-upload')
          }
        ]
      }
    ];

    if (userRole === 'hod' || userRole === 'admin') {
      baseActions?.push({
        title: "Analytics & Reports",
        description: "View department analytics, generate reports, and track performance",
        icon: "BarChart3",
        actions: [
          {
            label: "View Analytics",
            variant: "default",
            icon: "TrendingUp",
            onClick: () => handleQuickAction('view-analytics')
          },
          {
            label: "Generate Report",
            variant: "outline",
            icon: "FileText",
            onClick: () => handleQuickAction('generate-report')
          }
        ]
      });
    }

    return baseActions;
  };

  const contextInfo = {
    subject: userData?.subjects?.[0],
    class: userData?.classes?.[0],
    semester: "5th",
    academicYear: "2024-25"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader 
          userRole={userData?.role}
          userName={userData?.name}
          notifications={notifications}
        />
        <PrimaryNavigation userRole={userData?.role} />
        <BreadcrumbTrail contextInfo={contextInfo} />
        <main className="px-6 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4]?.map((i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        userRole={userData?.role}
        userName={userData?.name}
        notifications={notifications}
      />
      <PrimaryNavigation userRole={userData?.role} />
      <BreadcrumbTrail contextInfo={contextInfo} />
      <main className="px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {userData?.name?.split(' ')?.[1]}!
              </h1>
              <p className="text-muted-foreground">
                {userRole === 'hod' ? 'Department Overview' : 
                 userRole === 'admin' ? 'System Administration' :
                 `Managing ${userData?.subjects?.length} subjects across ${userData?.classes?.length} classes`}
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => console.log('View calendar')}
              >
                Today's Schedule
              </Button>
              <Button
                variant="default"
                iconName="Plus"
                iconPosition="left"
                onClick={() => handleQuickAction('mark-attendance')}
              >
                Mark Attendance
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getKPIData()?.map((kpi, index) => (
            <KPICard
              key={index}
              title={kpi?.title}
              value={kpi?.value}
              subtitle={kpi?.subtitle}
              icon={kpi?.icon}
              trend={kpi?.trend}
              trendValue={kpi?.trendValue}
              variant={kpi?.variant}
              actionLabel={kpi?.actionLabel}
              onActionClick={kpi?.onActionClick}
              loading={loading}
            />
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={selectedView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('overview')}
          >
            Overview
          </Button>
          <Button
            variant={selectedView === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('analytics')}
          >
            Analytics
          </Button>
          <Button
            variant={selectedView === 'students' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedView('students')}
          >
            Students
          </Button>
        </div>

        {/* Main Content Area */}
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Quick Actions */}
            <div className="space-y-6">
              {getQuickActions()?.map((action, index) => (
                <QuickActionCard
                  key={index}
                  title={action?.title}
                  description={action?.description}
                  icon={action?.icon}
                  actions={action?.actions}
                />
              ))}
            </div>

            {/* Recent Activity & Notifications */}
            <div className="space-y-6">
              <RecentActivity activities={recentActivities} />
              <NotificationPanel notifications={notifications} />
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <AttendanceChart 
              data={attendanceChartData}
              title="Attendance Trends Over Semester"
              height={350}
            />
            <MarksDistributionChart 
              data={marksDistributionData}
              title="Marks Distribution Analysis"
              height={350}
            />
          </div>
        )}

        {selectedView === 'students' && (
          <div className="mb-8">
            <StudentPerformanceMatrix 
              students={studentPerformanceData}
              subjects={userData?.subjects?.map((subject, index) => ({
                code: `SUB${index + 1}`,
                name: subject
              }))}
            />
          </div>
        )}

        {/* Mobile Quick Actions */}
        <div className="md:hidden fixed bottom-20 right-4 z-50">
          <Button
            variant="default"
            size="icon"
            className="w-14 h-14 rounded-full shadow-elevated"
            onClick={() => handleQuickAction('mark-attendance')}
          >
            <Icon name="Plus" size={24} />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;