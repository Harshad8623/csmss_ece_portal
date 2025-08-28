import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DefaultersTable = ({ data, className = '' }) => {
  const [sortField, setSortField] = useState('attendance');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data]?.sort((a, b) => {
    const aValue = a?.[sortField];
    const bValue = b?.[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData?.slice(startIndex, startIndex + itemsPerPage);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-success';
    if (percentage >= 65) return 'text-warning';
    return 'text-error';
  };

  const getAttendanceBadge = (percentage) => {
    if (percentage >= 75) return 'bg-success/10 text-success border-success/20';
    if (percentage >= 65) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-error/10 text-error border-error/20';
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Attendance Defaulters</h3>
            <p className="text-sm text-muted-foreground">Students below 75% attendance threshold</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} className="mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="Mail" size={16} className="mr-2" />
              Send Alerts
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('prn')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>PRN</span>
                  <Icon name={getSortIcon('prn')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Student Name</span>
                  <Icon name={getSortIcon('name')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('class')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Class</span>
                  <Icon name={getSortIcon('class')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('attendance')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Attendance</span>
                  <Icon name={getSortIcon('attendance')} size={14} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Subject</th>
              <th className="text-left p-4 font-medium text-foreground">Last Updated</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((student, index) => (
              <tr key={student?.prn} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <span className="font-mono text-sm text-foreground">{student?.prn}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium text-sm">
                        {student?.name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">{student?.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-foreground">{student?.class}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${getAttendanceColor(student?.attendance)}`}>
                      {student?.attendance}%
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAttendanceBadge(student?.attendance)}`}>
                      {student?.attendance >= 75 ? 'Good' : student?.attendance >= 65 ? 'Warning' : 'Critical'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{student?.subject}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-muted-foreground">{student?.lastUpdated}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Icon name="Eye" size={14} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="Mail" size={14} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreHorizontal" size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData?.length)} of {sortedData?.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={14} />
              </Button>
              <span className="text-sm text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <Icon name="ChevronRight" size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DefaultersTable;