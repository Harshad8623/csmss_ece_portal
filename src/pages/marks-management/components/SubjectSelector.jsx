import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SubjectSelector = ({ 
  selectedSubject, 
  onSubjectChange, 
  selectedAssessment, 
  onAssessmentChange,
  subjects = [],
  className = '' 
}) => {
  const assessmentOptions = [
    { value: 'CT1', label: 'Continuous Test 1 (CT1)' },
    { value: 'MidSem', label: 'Mid Semester Exam' },
    { value: 'CT2', label: 'Continuous Test 2 (CT2)' }
  ];

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BookOpen" size={20} className="text-primary" />
        <h3 className="font-semibold text-foreground">Assessment Selection</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Subject"
          placeholder="Select subject"
          options={subjects}
          value={selectedSubject}
          onChange={onSubjectChange}
          required
          searchable
        />
        
        <Select
          label="Assessment Type"
          placeholder="Select assessment"
          options={assessmentOptions}
          value={selectedAssessment}
          onChange={onAssessmentChange}
          required
        />
      </div>
      {selectedSubject && selectedAssessment && (
        <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-accent" />
            <span className="text-sm text-accent font-medium">
              Managing marks for {subjects?.find(s => s?.value === selectedSubject)?.label} - {selectedAssessment}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelector;