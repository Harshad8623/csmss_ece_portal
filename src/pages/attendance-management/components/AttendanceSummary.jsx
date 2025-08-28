import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AttendanceSummary = ({ 
  summaryData = {},
  defaulters = [],
  onExportPdf,
  onExportExcel,
  isExporting = false
}) => {
  const {
    totalStudents = 0,
    presentCount = 0,
    absentCount = 0,
    lateCount = 0,
    leaveApprovedCount = 0,
    odCount = 0,
    attendancePercentage = 0
  } = summaryData;

  const summaryCards = [
    {
      label: 'Total Students',
      value: totalStudents,
      icon: 'Users',
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Present',
      value: presentCount,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Absent',
      value: absentCount,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'Late',
      value: lateCount,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="BarChart3" size={20} className="mr-2" />
          Attendance Summary
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {summaryCards?.map((card, index) => (
            <div key={index} className={`${card?.bgColor} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card?.label}</p>
                  <p className={`text-2xl font-bold ${card?.color}`}>{card?.value}</p>
                </div>
                <Icon name={card?.icon} size={24} className={card?.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Attendance Percentage */}
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Attendance</span>
            <span className={`text-lg font-bold ${
              attendancePercentage >= 75 ? 'text-success' : 
              attendancePercentage >= 60 ? 'text-warning' : 'text-error'
            }`}>
              {attendancePercentage?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                attendancePercentage >= 75 ? 'bg-success' : 
                attendancePercentage >= 60 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onExportPdf}
            disabled={isExporting || totalStudents === 0}
            iconName="FileText"
            iconPosition="left"
            className="flex-1"
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={onExportExcel}
            disabled={isExporting || totalStudents === 0}
            iconName="Download"
            iconPosition="left"
            className="flex-1"
          >
            Export Excel
          </Button>
        </div>
      </div>
      {/* Defaulters Alert */}
      {defaulters?.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <Icon name="AlertTriangle" size={20} className="mr-2 text-warning" />
              Attendance Defaulters
            </h3>
            <span className="bg-warning/10 text-warning px-2 py-1 rounded-full text-sm font-medium">
              {defaulters?.length} students
            </span>
          </div>

          <div className="space-y-3">
            {defaulters?.slice(0, 5)?.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student?.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{student?.prn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-warning">
                    {student?.attendancePercentage}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student?.presentDays}/{student?.totalDays} days
                  </p>
                </div>
              </div>
            ))}

            {defaulters?.length > 5 && (
              <div className="text-center pt-2">
                <Button variant="ghost" size="sm">
                  View all {defaulters?.length} defaulters
                  <Icon name="ChevronRight" size={16} className="ml-1" />
                </Button>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <Icon name="Info" size={16} className="mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium mb-1">Defaulter Criteria:</p>
                <p className="text-xs">Students with attendance below 75% are considered defaulters and may face academic consequences.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Quick Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="mr-2" />
          Quick Insights
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Leave Approved</span>
              <span className="font-medium text-accent">{leaveApprovedCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">On Duty (OD)</span>
              <span className="font-medium text-secondary">{odCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Attendance Rate</span>
              <span className={`font-medium ${
                attendancePercentage >= 75 ? 'text-success' : 'text-warning'
              }`}>
                {attendancePercentage >= 75 ? 'Good' : 'Needs Improvement'}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Punctuality Rate</span>
              <span className="font-medium text-foreground">
                {totalStudents > 0 ? ((presentCount / totalStudents) * 100)?.toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Late Arrivals</span>
              <span className="font-medium text-warning">{lateCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completion Status</span>
              <span className="font-medium text-success">
                {totalStudents > 0 ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;