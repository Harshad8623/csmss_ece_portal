import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { Checkbox } from '../../../components/ui/Checkbox';

const StudentRoster = ({ 
  students = [], 
  attendance = {},
  onAttendanceChange,
  onSave,
  isSaving = false,
  searchQuery = '',
  onSearchChange
}) => {
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  const attendanceOptions = [
    { value: 'present', label: 'Present', color: 'text-success', bgColor: 'bg-success/10' },
    { value: 'absent', label: 'Absent', color: 'text-error', bgColor: 'bg-error/10' },
    { value: 'late', label: 'Late', color: 'text-warning', bgColor: 'bg-warning/10' },
    { value: 'leave_approved', label: 'Leave Approved', color: 'text-accent', bgColor: 'bg-accent/10' },
    { value: 'od', label: 'OD', color: 'text-secondary', bgColor: 'bg-secondary/10' }
  ];

  const filteredStudents = students?.filter(student =>
    student?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    student?.prn?.includes(searchQuery)
  );

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(new Set(filteredStudents.map(s => s.prn)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  const handleSelectStudent = (prn, checked) => {
    const newSelected = new Set(selectedStudents);
    if (checked) {
      newSelected?.add(prn);
    } else {
      newSelected?.delete(prn);
    }
    setSelectedStudents(newSelected);
  };

  const getAttendanceStats = () => {
    const total = filteredStudents?.length;
    const present = filteredStudents?.filter(s => attendance?.[s?.prn] === 'present')?.length;
    const absent = filteredStudents?.filter(s => attendance?.[s?.prn] === 'absent')?.length;
    const late = filteredStudents?.filter(s => attendance?.[s?.prn] === 'late')?.length;
    const pending = filteredStudents?.filter(s => !attendance?.[s?.prn])?.length;

    return { total, present, absent, late, pending };
  };

  const stats = getAttendanceStats();

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Student Roster</h3>
            <p className="text-sm text-muted-foreground">
              Mark attendance for {filteredStudents?.length} students
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or PRN..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e?.target?.value)}
                className="pl-10 pr-4 py-2 w-64 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Save Button */}
            <Button
              variant="default"
              onClick={onSave}
              loading={isSaving}
              disabled={isSaving || Object.keys(attendance)?.length === 0}
              iconName="Save"
              iconPosition="left"
            >
              Save Attendance
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-muted-foreground">Present: {stats?.present}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-error rounded-full" />
            <span className="text-muted-foreground">Absent: {stats?.absent}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-muted-foreground">Late: {stats?.late}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-3 h-3 bg-muted rounded-full" />
            <span className="text-muted-foreground">Pending: {stats?.pending}</span>
          </div>
        </div>
      </div>
      {/* Table Header */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-sm font-medium text-muted-foreground">
          <div className="col-span-1">
            <Checkbox
              checked={selectedStudents?.size === filteredStudents?.length && filteredStudents?.length > 0}
              indeterminate={selectedStudents?.size > 0 && selectedStudents?.size < filteredStudents?.length}
              onChange={(e) => handleSelectAll(e?.target?.checked)}
            />
          </div>
          <div className="col-span-1">Photo</div>
          <div className="col-span-2">PRN</div>
          <div className="col-span-3">Student Name</div>
          <div className="col-span-2">Previous Attendance</div>
          <div className="col-span-3">Mark Attendance</div>
        </div>
      </div>
      {/* Student List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredStudents?.length > 0 ? (
          filteredStudents?.map((student) => (
            <div key={student?.prn} className="border-b border-border last:border-b-0">
              {/* Desktop View */}
              <div className="hidden lg:grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                <div className="col-span-1">
                  <Checkbox
                    checked={selectedStudents?.has(student?.prn)}
                    onChange={(e) => handleSelectStudent(student?.prn, e?.target?.checked)}
                  />
                </div>
                <div className="col-span-1">
                  <Image
                    src={student?.photo}
                    alt={student?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="col-span-2">
                  <span className="font-mono text-sm">{student?.prn}</span>
                </div>
                <div className="col-span-3">
                  <div>
                    <p className="font-medium text-foreground">{student?.name}</p>
                    <p className="text-xs text-muted-foreground">Roll: {student?.rollNo}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">Last 5:</span>
                      <div className="flex space-x-1">
                        {student?.recentAttendance?.map((status, idx) => (
                          <div
                            key={idx}
                            className={`w-3 h-3 rounded-full ${
                              status === 'P' ? 'bg-success' :
                              status === 'A' ? 'bg-error' :
                              status === 'L' ? 'bg-warning' : 'bg-muted'
                            }`}
                            title={status === 'P' ? 'Present' : status === 'A' ? 'Absent' : status === 'L' ? 'Late' : 'No data'}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      Overall: {student?.attendancePercentage}%
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex flex-wrap gap-2">
                    {attendanceOptions?.map((option) => (
                      <button
                        key={option?.value}
                        onClick={() => onAttendanceChange(student?.prn, option?.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          attendance?.[student?.prn] === option?.value
                            ? `${option?.color} ${option?.bgColor} border border-current`
                            : 'text-muted-foreground bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {option?.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile View */}
              <div className="lg:hidden p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedStudents?.has(student?.prn)}
                    onChange={(e) => handleSelectStudent(student?.prn, e?.target?.checked)}
                  />
                  <Image
                    src={student?.photo}
                    alt={student?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{student?.name}</p>
                    <p className="text-sm text-muted-foreground font-mono">{student?.prn}</p>
                    <p className="text-xs text-muted-foreground">Roll: {student?.rollNo}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Recent:</span>
                    <div className="flex space-x-1">
                      {student?.recentAttendance?.map((status, idx) => (
                        <div
                          key={idx}
                          className={`w-3 h-3 rounded-full ${
                            status === 'P' ? 'bg-success' :
                            status === 'A' ? 'bg-error' :
                            status === 'L' ? 'bg-warning' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    {student?.attendancePercentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {attendanceOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => onAttendanceChange(student?.prn, option?.value)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        attendance?.[student?.prn] === option?.value
                          ? `${option?.color} ${option?.bgColor} border border-current`
                          : 'text-muted-foreground bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {option?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Icon name="Users" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No students found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentRoster;