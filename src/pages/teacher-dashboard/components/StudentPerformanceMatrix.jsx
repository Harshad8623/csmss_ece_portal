import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StudentPerformanceMatrix = ({ students = [], subjects = [] }) => {
  const [selectedSubject, setSelectedSubject] = useState(subjects?.[0]?.code || '');
  const [sortBy, setSortBy] = useState('attendance');
  const [sortOrder, setSortOrder] = useState('desc');

  const getPerformanceColor = (percentage) => {
    if (percentage >= 85) return 'text-success bg-success/10';
    if (percentage >= 75) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 65) return 'Average';
    return 'Poor';
  };

  const sortedStudents = [...students]?.sort((a, b) => {
    const aValue = sortBy === 'attendance' ? a?.attendance : a?.marks;
    const bValue = sortBy === 'attendance' ? b?.attendance : b?.marks;
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground">Student Performance Matrix</h3>
        <div className="flex items-center space-x-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e?.target?.value)}
            className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Subjects</option>
            {subjects?.map((subject) => (
              <option key={subject?.code} value={subject?.code}>
                {subject?.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => console.log('Export performance matrix')}
          >
            Export
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Student
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                PRN
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-smooth"
                onClick={() => handleSort('attendance')}
              >
                <div className="flex items-center space-x-1">
                  <span>Attendance</span>
                  <Icon 
                    name={sortBy === 'attendance' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-smooth"
                onClick={() => handleSort('marks')}
              >
                <div className="flex items-center space-x-1">
                  <span>Avg Marks</span>
                  <Icon 
                    name={sortBy === 'marks' && sortOrder === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents?.map((student) => (
              <tr key={student?.prn} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-sm">
                        {student?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student?.name}</p>
                      <p className="text-xs text-muted-foreground">{student?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {student?.prn}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(student?.attendance)}`}>
                      {student?.attendance}%
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-foreground">{student?.marks}%</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(student?.attendance)}`}>
                    {getAttendanceStatus(student?.attendance)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => console.log('View student profile:', student?.prn)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MessageSquare"
                      onClick={() => console.log('Contact student:', student?.prn)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedStudents?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No students found</p>
        </div>
      )}
    </div>
  );
};

export default StudentPerformanceMatrix;