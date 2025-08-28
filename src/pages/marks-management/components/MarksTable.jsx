import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';


const MarksTable = ({
  students = [],
  selectedAssessment,
  maxMarks = 25,
  onMarksChange,
  marksData = {},
  className = ''
}) => {
  const [editingCell, setEditingCell] = useState(null);
  const [localMarks, setLocalMarks] = useState({});

  useEffect(() => {
    setLocalMarks(marksData);
  }, [marksData]);

  const handleCellEdit = (studentId, field, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > maxMarks) {
      return;
    }

    const updatedMarks = {
      ...localMarks,
      [studentId]: {
        ...localMarks?.[studentId],
        [field]: numValue
      }
    };

    setLocalMarks(updatedMarks);
    onMarksChange(updatedMarks);
  };

  const getPerformanceColor = (marks, maxMarks) => {
    const percentage = (marks / maxMarks) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = (current, previous) => {
    if (!previous || !current) return null;
    if (current > previous) return <Icon name="TrendingUp" size={14} className="text-success" />;
    if (current < previous) return <Icon name="TrendingDown" size={14} className="text-error" />;
    return <Icon name="Minus" size={14} className="text-muted-foreground" />;
  };

  const calculateTotal = (studentMarks) => {
    if (!studentMarks) return 0;
    return (studentMarks?.theory || 0) + (studentMarks?.practical || 0);
  };

  const calculatePercentage = (total, maxTotal) => {
    return maxTotal > 0 ? ((total / maxTotal) * 100)?.toFixed(1) : 0;
  };

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Table" size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Marks Entry - {selectedAssessment}</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Max Marks: {maxMarks} (Theory + Practical)
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-foreground border-r border-border">
                Student Details
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-foreground border-r border-border">
                Theory ({maxMarks/2})
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-foreground border-r border-border">
                Practical ({maxMarks/2})
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-foreground border-r border-border">
                Total ({maxMarks})
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-foreground border-r border-border">
                Percentage
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-foreground">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student, index) => {
              const studentMarks = localMarks?.[student?.id] || {};
              const total = calculateTotal(studentMarks);
              const percentage = calculatePercentage(total, maxMarks);
              const previousMarks = student?.previousAssessment || 0;

              return (
                <tr key={student?.id} className={`border-b border-border hover:bg-muted/30 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                  <td className="px-4 py-3 border-r border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium text-sm">
                          {student?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student?.name}</p>
                        <p className="text-sm text-muted-foreground">{student?.prn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-r border-border text-center">
                    <Input
                      type="number"
                      value={studentMarks?.theory || ''}
                      onChange={(e) => handleCellEdit(student?.id, 'theory', e?.target?.value)}
                      placeholder="0"
                      className="w-20 text-center"
                      min="0"
                      max={maxMarks/2}
                      step="0.5"
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-border text-center">
                    <Input
                      type="number"
                      value={studentMarks?.practical || ''}
                      onChange={(e) => handleCellEdit(student?.id, 'practical', e?.target?.value)}
                      placeholder="0"
                      className="w-20 text-center"
                      min="0"
                      max={maxMarks/2}
                      step="0.5"
                    />
                  </td>
                  <td className="px-4 py-3 border-r border-border text-center">
                    <span className={`font-semibold ${getPerformanceColor(total, maxMarks)}`}>
                      {total?.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-border text-center">
                    <span className={`font-medium ${getPerformanceColor(total, maxMarks)}`}>
                      {percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getTrendIcon(total, previousMarks)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {students?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Users" size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No students found for selected criteria</p>
        </div>
      )}
    </div>
  );
};

export default MarksTable;