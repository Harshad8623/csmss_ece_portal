import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import KPICard from './components/KPICard';
import DashboardTabs from './components/DashboardTabs';
import QuickActionsPanel from './components/QuickActionsPanel';
import NotificationsFeed from './components/NotificationsFeed';

const StudentDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [studentData, setStudentData] = useState(null);

  // Mock student data
  const mockStudentData = {
    prn: "23025331844001",
    name: "Rahul Sharma",
    class: "TE ECE A",
    semester: "5th Semester",
    academicYear: "2024-25"
  };

  // Mock attendance data
  const mockAttendanceData = [
    { subject: "Digital Signal Processing", percentage: 85, attended: 34, total: 40 },
    { subject: "Microprocessors", percentage: 78, attended: 31, total: 40 },
    { subject: "Control Systems", percentage: 92, attended: 37, total: 40 },
    { subject: "Communication Systems", percentage: 68, attended: 27, total: 40 },
    { subject: "VLSI Design", percentage: 88, attended: 35, total: 40 },
    { subject: "Embedded Systems", percentage: 75, attended: 30, total: 40 }
  ];

  // Mock marks data
  const mockMarksData = [
    { subject: "Digital Signal Processing", ct1: 25, midSem: 22, ct2: 27 },
    { subject: "Microprocessors", ct1: 23, midSem: 20, ct2: 25 },
    { subject: "Control Systems", ct1: 28, midSem: 26, ct2: 29 },
    { subject: "Communication Systems", ct1: 20, midSem: 18, ct2: 22 },
    { subject: "VLSI Design", ct1: 26, midSem: 24, ct2: 28 },
    { subject: "Embedded Systems", ct1: 24, midSem: 21, ct2: 26 }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: "marks",
      title: "CT2 Marks Updated",
      message: "Your CT2 marks for Digital Signal Processing have been uploaded. Score: 27/30",
      timestamp: new Date(Date.now() - 300000),
      read: false,
      priority: "medium"
    },
    {
      id: 2,
      type: "attendance",
      title: "Attendance Alert",
      message: "Your attendance in Communication Systems is below 75%. Current: 68%",
      timestamp: new Date(Date.now() - 1800000),
      read: false,
      priority: "high"
    },
    {
      id: 3,
      type: "leave",
      title: "Leave Application Approved",
      message: "Your leave application for 25th August has been approved by the class teacher.",
      timestamp: new Date(Date.now() - 3600000),
      read: true,
      priority: "low"
    },
    {
      id: 4,
      type: "system",
      title: "Profile Update Required",
      message: "Please update your contact information in the profile section.",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
      priority: "medium"
    },
    {
      id: 5,
      type: "grievance",
      title: "Grievance Response",
      message: "Your grievance regarding MidSem marks has been reviewed and resolved.",
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      priority: "low"
    }
  ];

  useEffect(() => {
    setStudentData(mockStudentData);
    setNotifications(mockNotifications);
  }, []);

  // Calculate KPI values
  const overallAttendance = Math.round(
    mockAttendanceData?.reduce((acc, item) => acc + item?.percentage, 0) / mockAttendanceData?.length
  );

  const pendingLeaves = 2; // Mock pending leaves

  const averageMarks = Math.round(
    mockMarksData?.reduce((acc, item) => acc + (item?.ct1 + item?.midSem + item?.ct2) / 3, 0) / mockMarksData?.length
  );

  const handleLeaveApplication = () => {
    console.log('Navigate to leave application');
  };

  const handleGrievanceSubmission = () => {
    console.log('Navigate to grievance submission');
  };

  const handleProfileSettings = () => {
    console.log('Navigate to profile settings');
  };

  const handleViewAllNotifications = () => {
    console.log('Navigate to all notifications');
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notification => 
        notification?.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const breadcrumbContext = {
    subject: null,
    class: studentData?.class,
    semester: studentData?.semester,
    academicYear: studentData?.academicYear
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        userRole="student" 
        userName={studentData?.name || "Student"}
        notifications={notifications}
      />
      <PrimaryNavigation userRole="student" />
      <BreadcrumbTrail contextInfo={breadcrumbContext} />
      <main className="px-6 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border border-border rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Welcome back, {studentData?.name}!
              </h1>
              <p className="text-muted-foreground">
                PRN: {studentData?.prn} • {studentData?.class} • {studentData?.semester}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="font-semibold text-foreground">{studentData?.academicYear}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Overall Attendance"
            value={`${overallAttendance}%`}
            subtitle="Across all subjects"
            icon="UserCheck"
            color={overallAttendance >= 75 ? 'success' : overallAttendance >= 65 ? 'warning' : 'error'}
            trend={overallAttendance >= 75 ? 2.5 : -1.2}
          />
          <KPICard
            title="Pending Leaves"
            value={pendingLeaves}
            subtitle="Applications under review"
            icon="Calendar"
            color="warning"
          />
          <KPICard
            title="Average Marks"
            value={`${averageMarks}/30`}
            subtitle="Current semester average"
            icon="GraduationCap"
            color="primary"
            trend={3.8}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Charts Section */}
          <div className="xl:col-span-3">
            <DashboardTabs 
              attendanceData={mockAttendanceData}
              marksData={mockMarksData}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActionsPanel
              onLeaveApplication={handleLeaveApplication}
              onGrievanceSubmission={handleGrievanceSubmission}
              onProfileSettings={handleProfileSettings}
            />
            
            <NotificationsFeed
              notifications={notifications}
              onViewAll={handleViewAllNotifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>

        {/* Mobile-specific Quick Stats */}
        <div className="md:hidden bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-success">{mockAttendanceData?.filter(s => s?.percentage >= 75)?.length}</p>
              <p className="text-xs text-muted-foreground">Subjects &gt;75%</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-error">{mockAttendanceData?.filter(s => s?.percentage < 75)?.length}</p>
              <p className="text-xs text-muted-foreground">Below 75%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;