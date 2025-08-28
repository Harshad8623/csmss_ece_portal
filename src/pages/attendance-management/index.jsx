import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import AttendanceFilters from './components/AttendanceFilters';
import BulkActions from './components/BulkActions';
import StudentRoster from './components/StudentRoster';
import AttendanceSummary from './components/AttendanceSummary';
import HistoricalView from './components/HistoricalView';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AttendanceManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('current');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLectureType, setSelectedLectureType] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);

  // Data states
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [historicalData, setHistoricalData] = useState([]);

  // Mock data
  const mockStudents = [
    {
      prn: '23025331844001',
      name: 'Aarav Sharma',
      rollNo: '01',
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      recentAttendance: ['P', 'P', 'A', 'P', 'L'],
      attendancePercentage: 82
    },
    {
      prn: '23025331844002',
      name: 'Vivaan Patel',
      rollNo: '02',
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      recentAttendance: ['P', 'A', 'P', 'P', 'P'],
      attendancePercentage: 78
    },
    {
      prn: '23025331844003',
      name: 'Aditya Kumar',
      rollNo: '03',
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      recentAttendance: ['A', 'A', 'P', 'L', 'A'],
      attendancePercentage: 45
    },
    {
      prn: '23025331844004',
      name: 'Vihaan Singh',
      rollNo: '04',
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      recentAttendance: ['P', 'P', 'P', 'P', 'P'],
      attendancePercentage: 95
    },
    {
      prn: '23025331844005',
      name: 'Arjun Gupta',
      rollNo: '05',
      photo: 'https://randomuser.me/api/portraits/men/5.jpg',
      recentAttendance: ['P', 'L', 'P', 'A', 'P'],
      attendancePercentage: 72
    },
    {
      prn: '23025331844006',
      name: 'Sai Reddy',
      rollNo: '06',
      photo: 'https://randomuser.me/api/portraits/men/6.jpg',
      recentAttendance: ['A', 'P', 'P', 'P', 'L'],
      attendancePercentage: 68
    }
  ];

  const mockHistoricalData = [
    {
      date: '2025-01-15',
      time: '09:00 AM',
      subject: 'ECE301',
      subjectName: 'Digital Signal Processing',
      lectureType: 'theory',
      className: 'TE-ECE-A',
      totalStudents: 45,
      presentCount: 38,
      absentCount: 5,
      lateCount: 2,
      leaveApprovedCount: 0,
      odCount: 0
    },
    {
      date: '2025-01-14',
      time: '02:00 PM',
      subject: 'ECE302',
      subjectName: 'Microprocessors & Microcontrollers',
      lectureType: 'practical',
      className: 'TE-ECE-A',
      totalStudents: 45,
      presentCount: 42,
      absentCount: 2,
      lateCount: 1,
      leaveApprovedCount: 0,
      odCount: 0
    }
  ];

  const mockNotifications = [
    {
      id: 1,
      title: 'Attendance Reminder',
      message: 'Please mark attendance for ECE301 Theory class',
      category: 'attendance',
      read: false,
      timestamp: new Date(Date.now() - 300000),
      actionRequired: true,
      actionLabel: 'Mark Now'
    }
  ];

  // Load students when filters are applied
  const handleApplyFilters = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setAttendance({});
      setIsLoading(false);
    }, 1000);
  };

  // Handle attendance change
  const handleAttendanceChange = (prn, status) => {
    setAttendance(prev => ({
      ...prev,
      [prn]: status
    }));
  };

  // Bulk actions
  const handleMarkAllPresent = () => {
    const newAttendance = {};
    students?.forEach(student => {
      newAttendance[student.prn] = 'present';
    });
    setAttendance(newAttendance);
  };

  const handleMarkAllAbsent = () => {
    const newAttendance = {};
    students?.forEach(student => {
      newAttendance[student.prn] = 'absent';
    });
    setAttendance(newAttendance);
  };

  const handleCsvUpload = (file) => {
    console.log('Processing CSV file:', file?.name);
    // Simulate CSV processing
    setTimeout(() => {
      const sampleAttendance = {};
      students?.forEach((student, index) => {
        sampleAttendance[student.prn] = index % 3 === 0 ? 'absent' : 'present';
      });
      setAttendance(sampleAttendance);
    }, 1500);
  };

  // Save attendance
  const handleSaveAttendance = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success message
      alert('Attendance saved successfully!');
      // Add to historical data
      const newRecord = {
        date: selectedDate,
        time: new Date()?.toLocaleTimeString('en-IN', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        subject: selectedSubject,
        subjectName: 'Digital Signal Processing',
        lectureType: selectedLectureType,
        className: selectedClass,
        totalStudents: students?.length,
        presentCount: Object.values(attendance)?.filter(s => s === 'present')?.length,
        absentCount: Object.values(attendance)?.filter(s => s === 'absent')?.length,
        lateCount: Object.values(attendance)?.filter(s => s === 'late')?.length,
        leaveApprovedCount: Object.values(attendance)?.filter(s => s === 'leave_approved')?.length,
        odCount: Object.values(attendance)?.filter(s => s === 'od')?.length
      };
      setHistoricalData(prev => [newRecord, ...prev]);
    }, 1500);
  };

  // Calculate summary data
  const getSummaryData = () => {
    const totalStudents = students?.length;
    const presentCount = Object.values(attendance)?.filter(s => s === 'present')?.length;
    const absentCount = Object.values(attendance)?.filter(s => s === 'absent')?.length;
    const lateCount = Object.values(attendance)?.filter(s => s === 'late')?.length;
    const leaveApprovedCount = Object.values(attendance)?.filter(s => s === 'leave_approved')?.length;
    const odCount = Object.values(attendance)?.filter(s => s === 'od')?.length;
    
    const attendancePercentage = totalStudents > 0 
      ? ((presentCount + lateCount) / totalStudents) * 100 
      : 0;

    return {
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      leaveApprovedCount,
      odCount,
      attendancePercentage
    };
  };

  // Get defaulters
  const getDefaulters = () => {
    return students?.filter(student => student?.attendancePercentage < 75)?.map(student => ({
      ...student,
      presentDays: Math.floor((student?.attendancePercentage / 100) * 30),
      totalDays: 30
    }));
  };

  // Historical view handlers
  const handleEditRecord = (record) => {
    console.log('Edit record:', record);
  };

  const handleDeleteRecord = (record) => {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      setHistoricalData(prev => prev?.filter(r => r !== record));
    }
  };

  const handleExportRecord = (record) => {
    console.log('Export record:', record);
  };

  const handleExportPdf = () => {
    console.log('Exporting PDF...');
  };

  const handleExportExcel = () => {
    console.log('Exporting Excel...');
  };

  const breadcrumbContext = {
    subject: selectedSubject ? `${selectedSubject}` : null,
    class: selectedClass,
    semester: 'III',
    academicYear: '2024-25'
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        userRole="teacher"
        userName="Dr. Rajesh Kumar"
        notifications={mockNotifications}
      />
      <PrimaryNavigation userRole="teacher" />
      <BreadcrumbTrail 
        contextInfo={breadcrumbContext}
      />
      <main className="px-6 py-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Attendance Management</h1>
            <p className="text-muted-foreground">
              Mark and manage student attendance with bulk operations and comprehensive tracking
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'current' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('current')}
              className="rounded-md"
            >
              <Icon name="Users" size={16} className="mr-2" />
              Current Session
            </Button>
            <Button
              variant={activeTab === 'historical' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('historical')}
              className="rounded-md"
            >
              <Icon name="History" size={16} className="mr-2" />
              Historical View
            </Button>
          </div>
        </div>

        {activeTab === 'current' ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              <AttendanceFilters
                selectedSubject={selectedSubject}
                setSelectedSubject={setSelectedSubject}
                selectedLectureType={selectedLectureType}
                setSelectedLectureType={setSelectedLectureType}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onApplyFilters={handleApplyFilters}
                isLoading={isLoading}
              />

              {students?.length > 0 && (
                <>
                  <BulkActions
                    onMarkAllPresent={handleMarkAllPresent}
                    onMarkAllAbsent={handleMarkAllAbsent}
                    onCsvUpload={handleCsvUpload}
                    totalStudents={students?.length}
                    isProcessing={isSaving}
                  />

                  <StudentRoster
                    students={students}
                    attendance={attendance}
                    onAttendanceChange={handleAttendanceChange}
                    onSave={handleSaveAttendance}
                    isSaving={isSaving}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                  />
                </>
              )}

              {isLoading && (
                <div className="bg-card border border-border rounded-lg p-8 text-center">
                  <Icon name="Loader2" size={32} className="mx-auto text-muted-foreground mb-2 animate-spin" />
                  <p className="text-muted-foreground">Loading students...</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:col-span-1">
              {students?.length > 0 && (
                <AttendanceSummary
                  summaryData={getSummaryData()}
                  defaulters={getDefaulters()}
                  onExportPdf={handleExportPdf}
                  onExportExcel={handleExportExcel}
                />
              )}
            </div>
          </div>
        ) : (
          <HistoricalView
            historicalData={[...mockHistoricalData, ...historicalData]}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            onExport={handleExportRecord}
            isLoading={false}
          />
        )}
      </main>
    </div>
  );
};

export default AttendanceManagement;