import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import PrimaryNavigation from '../../components/ui/PrimaryNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import SubjectSelector from './components/SubjectSelector';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import MarksTable from './components/MarksTable';
import PerformanceAnalytics from './components/PerformanceAnalytics';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const MarksManagement = () => {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [marksData, setMarksData] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Mock data
  const subjects = [
    { value: 'ECE301', label: 'Digital Signal Processing' },
    { value: 'ECE302', label: 'Microprocessors and Microcontrollers' },
    { value: 'ECE303', label: 'Communication Systems' },
    { value: 'ECE304', label: 'Control Systems Engineering' },
    { value: 'ECE305', label: 'VLSI Design' }
  ];

  const students = [
    { 
      id: '1', 
      name: 'Aarav Sharma', 
      prn: '23025331844001',
      previousAssessment: 22.5
    },
    { 
      id: '2', 
      name: 'Diya Patel', 
      prn: '23025331844002',
      previousAssessment: 20.0
    },
    { 
      id: '3', 
      name: 'Arjun Singh', 
      prn: '23025331844003',
      previousAssessment: 18.5
    },
    { 
      id: '4', 
      name: 'Ananya Gupta', 
      prn: '23025331844004',
      previousAssessment: 24.0
    },
    { 
      id: '5', 
      name: 'Karan Mehta', 
      prn: '23025331844005',
      previousAssessment: 19.5
    },
    { 
      id: '6', 
      name: 'Priya Joshi', 
      prn: '23025331844006',
      previousAssessment: 21.0
    },
    { 
      id: '7', 
      name: 'Rohit Kumar', 
      prn: '23025331844007',
      previousAssessment: 17.5
    },
    { 
      id: '8', 
      name: 'Sneha Reddy', 
      prn: '23025331844008',
      previousAssessment: 23.0
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Marks Entry Deadline',
      message: 'CT2 marks entry deadline is approaching - Due in 2 days',
      category: 'marks',
      priority: 'high',
      read: false,
      timestamp: new Date(Date.now() - 3600000),
      time: '1 hour ago'
    },
    {
      id: 2,
      title: 'System Maintenance',
      message: 'Scheduled maintenance on Sunday 2 AM - 4 AM',
      category: 'system',
      priority: 'medium',
      read: true,
      timestamp: new Date(Date.now() - 7200000),
      time: '2 hours ago'
    }
  ];

  const breadcrumbs = [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Teacher Dashboard', path: '/teacher-dashboard', icon: 'LayoutDashboard' },
    { label: 'Marks Management', path: '/marks-management', icon: 'GraduationCap' }
  ];

  const contextInfo = {
    subject: selectedSubject ? subjects?.find(s => s?.value === selectedSubject)?.label : null,
    assessment: selectedAssessment,
    academicYear: '2024-25'
  };

  useEffect(() => {
    // Initialize with some sample marks data
    const sampleMarks = {
      '1': { theory: 12.5, practical: 10.0 },
      '2': { theory: 11.0, practical: 9.0 },
      '3': { theory: 10.5, practical: 8.0 },
      '4': { theory: 13.0, practical: 11.0 }
    };
    setMarksData(sampleMarks);
  }, []);

  const handleMarksChange = (newMarksData) => {
    setMarksData(newMarksData);
    setHasUnsavedChanges(true);
  };

  const handleCSVUpload = (file) => {
    console.log('Uploading CSV:', file?.name);
    // Mock CSV processing
    setTimeout(() => {
      setHasUnsavedChanges(true);
      alert('CSV uploaded successfully! Please review the imported marks.');
    }, 1000);
  };

  const handleDownloadTemplate = () => {
    console.log('Downloading CSV template');
    // Mock template download
    const csvContent = `PRN,Student Name,Theory Marks,Practical Marks\n23025331844001,Aarav Sharma,,\n23025331844002,Diya Patel,,`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSubject}_${selectedAssessment}_template.csv`;
    a?.click();
  };

  const handleAutoCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      console.log('Auto-calculation completed');
    }, 2000);
  };

  const handleSaveAll = () => {
    console.log('Saving all marks:', marksData);
    setTimeout(() => {
      setHasUnsavedChanges(false);
      alert('All marks saved successfully!');
    }, 1000);
  };

  const handleExportPDF = () => {
    console.log('Exporting to PDF');
    alert('PDF export functionality will be implemented');
  };

  const handleExportExcel = () => {
    console.log('Exporting to Excel');
    alert('Excel export functionality will be implemented');
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        userRole="teacher"
        userName="Dr. Rajesh Kumar"
        notifications={notifications}
      />
      <PrimaryNavigation userRole="teacher" />
      <BreadcrumbTrail 
        customBreadcrumbs={breadcrumbs}
        contextInfo={contextInfo}
      />
      <main className="px-6 py-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Marks Management</h1>
            <p className="text-muted-foreground mt-1">
              Enter and manage student marks for assessments
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant={showAnalytics ? 'default' : 'outline'}
              onClick={() => setShowAnalytics(!showAnalytics)}
              iconName="BarChart3"
              iconPosition="left"
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/teacher-dashboard')}
              iconName="ArrowLeft"
              iconPosition="left"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Subject and Assessment Selection */}
        <SubjectSelector
          selectedSubject={selectedSubject}
          onSubjectChange={setSelectedSubject}
          selectedAssessment={selectedAssessment}
          onAssessmentChange={setSelectedAssessment}
          subjects={subjects}
        />

        {selectedSubject && selectedAssessment && (
          <>
            {/* Bulk Operations Toolbar */}
            <BulkOperationsToolbar
              onCSVUpload={handleCSVUpload}
              onDownloadTemplate={handleDownloadTemplate}
              onAutoCalculate={handleAutoCalculate}
              onSaveAll={handleSaveAll}
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              hasUnsavedChanges={hasUnsavedChanges}
              isCalculating={isCalculating}
            />

            <div className={`grid gap-6 ${showAnalytics ? 'lg:grid-cols-3' : 'grid-cols-1'}`}>
              {/* Marks Table */}
              <div className={showAnalytics ? 'lg:col-span-2' : 'col-span-1'}>
                <MarksTable
                  students={students}
                  selectedAssessment={selectedAssessment}
                  maxMarks={25}
                  onMarksChange={handleMarksChange}
                  marksData={marksData}
                />
              </div>

              {/* Performance Analytics Sidebar */}
              {showAnalytics && (
                <div className="lg:col-span-1">
                  <PerformanceAnalytics
                    marksData={marksData}
                    students={students}
                    selectedAssessment={selectedAssessment}
                  />
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={20} className="text-primary" />
                  <h3 className="font-semibold text-foreground">Quick Actions</h3>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('View audit log')}
                    iconName="History"
                    iconPosition="left"
                  >
                    Audit Log
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Lock marks')}
                    iconName="Lock"
                    iconPosition="left"
                  >
                    Lock Marks
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => console.log('Send notifications')}
                    iconName="Send"
                    iconPosition="left"
                  >
                    Notify Students
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {(!selectedSubject || !selectedAssessment) && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="GraduationCap" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Select Subject and Assessment
            </h3>
            <p className="text-muted-foreground mb-6">
              Choose a subject and assessment type to start entering marks
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="BookOpen" size={16} />
                <span>5 Subjects Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} />
                <span>{students?.length} Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} />
                <span>AY 2024-25</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MarksManagement;