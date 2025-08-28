import React, { useState } from 'react';
import { useTeacherStudents, useSupabaseData } from '../../../hooks/useSupabaseData';
import { Users, TrendingUp, Calendar, BookOpen, Search } from 'lucide-react';

const StudentPerformanceMatrix = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { students, loading: studentsLoading } = useTeacherStudents();
  
  // Fetch subjects taught by this teacher
  const { data: subjects } = useSupabaseData('subject_assignments', {
    select: 'subject:subjects(id, subject_name, subject_code)',
    filters: [{ column: 'teacher_id', value: null }], // Will be set by the hook
    dependencies: []
  });

  // Filter students based on search term
  const filteredStudents = students?.filter(student =>
    student?.full_name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    student?.prn?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const calculateStudentStats = (studentId) => {
    // In a real implementation, these would be calculated from actual data
    // For now, we'll use placeholder values
    return {
      attendancePercentage: Math.floor(Math.random() * 30) + 70, // 70-100%
      averageMarks: Math.floor(Math.random() * 20) + 70, // 70-90%
      totalSubjects: 5,
      rank: Math.floor(Math.random() * students?.length) + 1
    };
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 85) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (studentsLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Student Performance Matrix</h2>
        <div className="space-y-4">
          {[...Array(5)]?.map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Student Performance Matrix</h2>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">{filteredStudents?.length || 0} students</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value || '')}
              className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e?.target?.value || 'all')}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Subjects</option>
            {subjects?.map((assignment) => (
              <option key={assignment?.subject?.id} value={assignment?.subject?.id}>
                {assignment?.subject?.subject_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Performance Matrix */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Attendance
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Avg. Marks
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Performance
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents?.length > 0 ? (
              filteredStudents?.map((student) => {
                const stats = calculateStudentStats(student?.id);
                const performanceScore = Math.round((stats?.attendancePercentage + stats?.averageMarks) / 2);
                
                return (
                  <tr key={student?.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {student?.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student?.full_name || 'Unknown Student'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student?.prn || 'N/A'} • {student?.class_name || 'No Class'}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {stats?.attendancePercentage}%
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${stats?.attendancePercentage}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {stats?.averageMarks}%
                      </div>
                      <div className="text-sm text-gray-500">
                        {stats?.totalSubjects} subjects
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        getPerformanceColor(performanceScore)
                      }`}>
                        {performanceScore >= 85 ? 'Excellent' : 
                         performanceScore >= 70 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{stats?.rank}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Message
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'No students assigned to your classes yet.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      {filteredStudents?.length > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredStudents?.length} students</span>
            <div className="flex space-x-4">
              <span>
                Avg. Attendance: {Math.round(
                  filteredStudents?.reduce((acc, student) => 
                    acc + calculateStudentStats(student?.id)?.attendancePercentage, 0
                  ) / filteredStudents?.length
                )}%
              </span>
              <span>
                Avg. Performance: {Math.round(
                  filteredStudents?.reduce((acc, student) => 
                    acc + calculateStudentStats(student?.id)?.averageMarks, 0
                  ) / filteredStudents?.length
                )}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPerformanceMatrix;