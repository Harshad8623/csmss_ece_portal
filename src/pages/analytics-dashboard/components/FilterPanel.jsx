import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterPanel = ({ onFiltersChange, className = '' }) => {
  const [filters, setFilters] = useState({
    semester: '',
    subject: '',
    class: '',
    dateRange: {
      start: '',
      end: ''
    },
    cohort: ''
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const semesterOptions = [
    { value: 'all', label: 'All Semesters' },
    { value: 'sem1', label: 'Semester 1' },
    { value: 'sem2', label: 'Semester 2' },
    { value: 'sem3', label: 'Semester 3' },
    { value: 'sem4', label: 'Semester 4' },
    { value: 'sem5', label: 'Semester 5' },
    { value: 'sem6', label: 'Semester 6' },
    { value: 'sem7', label: 'Semester 7' },
    { value: 'sem8', label: 'Semester 8' }
  ];

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'dsa', label: 'Data Structures & Algorithms' },
    { value: 'dbms', label: 'Database Management Systems' },
    { value: 'os', label: 'Operating Systems' },
    { value: 'cn', label: 'Computer Networks' },
    { value: 'se', label: 'Software Engineering' },
    { value: 'ml', label: 'Machine Learning' },
    { value: 'ai', label: 'Artificial Intelligence' },
    { value: 'blockchain', label: 'Blockchain Technology' }
  ];

  const classOptions = [
    { value: 'all', label: 'All Classes' },
    { value: 'te-a', label: 'TE-A' },
    { value: 'te-b', label: 'TE-B' },
    { value: 'te-c', label: 'TE-C' },
    { value: 'be-a', label: 'BE-A' },
    { value: 'be-b', label: 'BE-B' },
    { value: 'be-c', label: 'BE-C' }
  ];

  const cohortOptions = [
    { value: 'all', label: 'All Students' },
    { value: 'high-performers', label: 'High Performers (>80%)' },
    { value: 'average-performers', label: 'Average Performers (60-80%)' },
    { value: 'low-performers', label: 'Low Performers (<60%)' },
    { value: 'defaulters', label: 'Attendance Defaulters' },
    { value: 'at-risk', label: 'At-Risk Students' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (key, value) => {
    const newDateRange = { ...filters?.dateRange, [key]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      semester: '',
      subject: '',
      class: '',
      dateRange: { start: '', end: '' },
      cohort: ''
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => 
    typeof value === 'string' ? value !== '' : Object.values(value)?.some(v => v !== '')
  );

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Advanced Filters</h3>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <Icon name="X" size={14} className="mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </Button>
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Semester"
              options={semesterOptions}
              value={filters?.semester}
              onChange={(value) => handleFilterChange('semester', value)}
              placeholder="Select semester"
            />

            <Select
              label="Subject"
              options={subjectOptions}
              value={filters?.subject}
              onChange={(value) => handleFilterChange('subject', value)}
              placeholder="Select subject"
              searchable
            />

            <Select
              label="Class"
              options={classOptions}
              value={filters?.class}
              onChange={(value) => handleFilterChange('class', value)}
              placeholder="Select class"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  placeholder="Start date"
                  value={filters?.dateRange?.start}
                  onChange={(e) => handleDateRangeChange('start', e?.target?.value)}
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={filters?.dateRange?.end}
                  onChange={(e) => handleDateRangeChange('end', e?.target?.value)}
                />
              </div>
            </div>

            <Select
              label="Student Cohort"
              options={cohortOptions}
              value={filters?.cohort}
              onChange={(value) => handleFilterChange('cohort', value)}
              placeholder="Select cohort"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Filters will update charts and data in real-time
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Icon name="Save" size={14} className="mr-2" />
                Save Filter Set
              </Button>
              <Button variant="default" size="sm">
                <Icon name="RefreshCw" size={14} className="mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;