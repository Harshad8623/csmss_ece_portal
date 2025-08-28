import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const HistoricalView = ({ 
  historicalData = [],
  onEdit,
  onDelete,
  onExport,
  isLoading = false
}) => {
  const [filterDate, setFilterDate] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');

  const subjectOptions = [
    { value: '', label: 'All Subjects' },
    { value: 'ECE301', label: 'Digital Signal Processing' },
    { value: 'ECE302', label: 'Microprocessors & Microcontrollers' },
    { value: 'ECE303', label: 'Communication Systems' },
    { value: 'ECE304', label: 'Control Systems' }
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'theory', label: 'Theory' },
    { value: 'practical', label: 'Practical' },
    { value: 'tutorial', label: 'Tutorial' }
  ];

  const filteredData = historicalData?.filter(record => {
    const matchesDate = !filterDate || record?.date === filterDate;
    const matchesSubject = !filterSubject || record?.subject === filterSubject;
    const matchesType = !filterType || record?.lectureType === filterType;
    return matchesDate && matchesSubject && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'text-success bg-success/10';
      case 'absent': return 'text-error bg-error/10';
      case 'late': return 'text-warning bg-warning/10';
      case 'leave_approved': return 'text-accent bg-accent/10';
      case 'od': return 'text-secondary bg-secondary/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateAttendancePercentage = (record) => {
    const total = record?.totalStudents;
    const present = record?.presentCount + record?.lateCount;
    return total > 0 ? ((present / total) * 100)?.toFixed(1) : 0;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="History" size={20} className="mr-2" />
            Historical Attendance Records
          </h3>
          <Button
            variant="outline"
            onClick={() => onExport('all')}
            iconName="Download"
            iconPosition="left"
            disabled={filteredData?.length === 0}
          >
            Export All
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Filter by Date"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e?.target?.value)}
            placeholder="Select date"
          />
          
          <Select
            label="Filter by Subject"
            options={subjectOptions}
            value={filterSubject}
            onChange={setFilterSubject}
          />
          
          <Select
            label="Filter by Type"
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
          />
        </div>
      </div>
      {/* Records List */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-8 text-center">
            <Icon name="Loader2" size={32} className="mx-auto text-muted-foreground mb-2 animate-spin" />
            <p className="text-muted-foreground">Loading historical records...</p>
          </div>
        ) : filteredData?.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredData?.map((record, index) => (
              <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                {/* Desktop View */}
                <div className="hidden lg:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(record?.date)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record?.time}
                      </p>
                    </div>
                    
                    <div className="border-l border-border pl-4">
                      <p className="font-medium text-foreground">{record?.subjectName}</p>
                      <p className="text-sm text-muted-foreground">
                        {record?.subject} • {record?.lectureType} • {record?.className}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        {calculateAttendancePercentage(record)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <p className="text-sm font-medium text-success">{record?.presentCount}</p>
                        <p className="text-xs text-muted-foreground">Present</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-error">{record?.absentCount}</p>
                        <p className="text-xs text-muted-foreground">Absent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-warning">{record?.lateCount}</p>
                        <p className="text-xs text-muted-foreground">Late</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(record)}
                        iconName="Edit"
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExport(record)}
                        iconName="Download"
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(record)}
                        iconName="Trash2"
                        className="h-8 w-8 p-0 text-error hover:text-error"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile View */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{record?.subjectName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(record?.date)} • {record?.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {calculateAttendancePercentage(record)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex space-x-4">
                      <span className="text-success">P: {record?.presentCount}</span>
                      <span className="text-error">A: {record?.absentCount}</span>
                      <span className="text-warning">L: {record?.lateCount}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(record)}
                        iconName="Edit"
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExport(record)}
                        iconName="Download"
                        className="h-8 w-8 p-0"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(record)}
                        iconName="Trash2"
                        className="h-8 w-8 p-0 text-error"
                      />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {record?.subject} • {record?.lectureType} • {record?.className}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon name="Calendar" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No historical records found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or take attendance for current sessions
            </p>
          </div>
        )}
      </div>
      {/* Footer */}
      {filteredData?.length > 0 && (
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredData?.length} records</span>
            <div className="flex items-center space-x-4">
              <span>Total Sessions: {filteredData?.length}</span>
              <span>
                Avg Attendance: {
                  filteredData?.length > 0 
                    ? (filteredData?.reduce((acc, record) => acc + parseFloat(calculateAttendancePercentage(record)), 0) / filteredData?.length)?.toFixed(1)
                    : 0
                }%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalView;