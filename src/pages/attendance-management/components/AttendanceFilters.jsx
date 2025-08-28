import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AttendanceFilters = ({ 
  selectedSubject, 
  setSelectedSubject,
  selectedLectureType,
  setSelectedLectureType,
  selectedClass,
  setSelectedClass,
  selectedDate,
  setSelectedDate,
  onApplyFilters,
  isLoading = false
}) => {
  const [hasError, setHasError] = useState(false);

  const subjectOptions = [
    { value: 'ECE301', label: 'Digital Signal Processing' },
    { value: 'ECE302', label: 'Microprocessors & Microcontrollers' },
    { value: 'ECE303', label: 'Communication Systems' },
    { value: 'ECE304', label: 'Control Systems' },
    { value: 'ECE305', label: 'VLSI Design' },
    { value: 'ECE306', label: 'Embedded Systems' }
  ];

  const lectureTypeOptions = [
    { value: 'theory', label: 'Theory' },
    { value: 'practical', label: 'Practical' },
    { value: 'tutorial', label: 'Tutorial' }
  ];

  const classOptions = [
    { value: 'TE-ECE-A', label: 'TE ECE - Section A' },
    { value: 'TE-ECE-B', label: 'TE ECE - Section B' },
    { value: 'BE-ECE-A', label: 'BE ECE - Section A' },
    { value: 'BE-ECE-B', label: 'BE ECE - Section B' }
  ];

  const handleApplyFilters = () => {
    if (!selectedSubject || !selectedLectureType || !selectedClass || !selectedDate) {
      setHasError(true);
      return;
    }
    
    setHasError(false);
    onApplyFilters();
  };

  const handleReset = () => {
    setSelectedSubject('');
    setSelectedLectureType('');
    setSelectedClass('');
    setSelectedDate('');
    setHasError(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Attendance Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="RotateCcw" size={16} className="mr-1" />
          Reset
        </Button>
      </div>
      {hasError && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-3 mb-4">
          <div className="flex items-center text-error">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            <span className="text-sm font-medium">Please fill all required fields</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select
          label="Subject"
          placeholder="Select subject"
          options={subjectOptions}
          value={selectedSubject}
          onChange={setSelectedSubject}
          required
          error={hasError && !selectedSubject ? 'Subject is required' : ''}
        />

        <Select
          label="Lecture Type"
          placeholder="Select type"
          options={lectureTypeOptions}
          value={selectedLectureType}
          onChange={setSelectedLectureType}
          required
          error={hasError && !selectedLectureType ? 'Lecture type is required' : ''}
        />

        <Select
          label="Class/Batch"
          placeholder="Select class"
          options={classOptions}
          value={selectedClass}
          onChange={setSelectedClass}
          required
          error={hasError && !selectedClass ? 'Class is required' : ''}
        />

        <Input
          label="Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e?.target?.value)}
          required
          error={hasError && !selectedDate ? 'Date is required' : ''}
          max={new Date()?.toISOString()?.split('T')?.[0]}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          <Icon name="Info" size={14} className="inline mr-1" />
          Duplicate attendance for same subject, type, and date is not allowed
        </div>
        <Button
          variant="default"
          onClick={handleApplyFilters}
          loading={isLoading}
          disabled={isLoading}
          iconName="Search"
          iconPosition="left"
        >
          Load Students
        </Button>
      </div>
    </div>
  );
};

export default AttendanceFilters;