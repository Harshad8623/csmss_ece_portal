import React, { useState } from 'react';
import { useStudentAttendance, useStudentMarks } from '../../../hooks/useSupabaseData';
import { Calendar, BookOpen, TrendingUp, Award } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const DashboardTabs = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  
  // Fetch real data from Supabase
  const { data: attendanceData, loading: attendanceLoading } = useStudentAttendance();
  const { data: marksData, loading: marksLoading } = useStudentMarks();

  const tabs = [
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Calendar,
      count: attendanceData?.length || 0
    },
    {
      id: 'marks',
      label: 'Marks',
      icon: BookOpen,
      count: marksData?.length || 0
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: TrendingUp,
      count: 0
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      count: 0
    }
  ];

  const calculateAttendancePercentage = () => {
    if (!attendanceData?.length) return 0;
    const presentCount = attendanceData?.filter(record => record?.status === 'present')?.length;
    return Math.round((presentCount / attendanceData?.length) * 100);
  };

  const calculateAverageMarks = () => {
    if (!marksData?.length) return 0;
    const totalPercentage = marksData?.reduce((sum, record) => sum + (record?.percentage || 0), 0);
    return Math.round(totalPercentage / marksData?.length);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'attendance':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Overall Attendance</h3>
                <p className="text-2xl font-bold text-green-600">
                  {attendanceLoading ? '...' : `${calculateAttendancePercentage()}%`}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800">Total Classes</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {attendanceLoading ? '...' : attendanceData?.length || 0}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-800">Present Days</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {attendanceLoading ? '...' : attendanceData?.filter(r => r?.status === 'present')?.length || 0}
                </p>
              </div>
            </div>
            {/* Recent Attendance */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Attendance</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {attendanceLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading attendance...</div>
                ) : attendanceData?.length > 0 ? (
                  attendanceData?.slice(0, 5)?.map((record) => (
                    <div key={record?.id} className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">
                          {record?.subject?.subject_name || 'Unknown Subject'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {record?.attendance_date ? new Date(record.attendance_date)?.toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record?.status === 'present' ?'bg-green-100 text-green-800'
                            : record?.status === 'late' ?'bg-yellow-100 text-yellow-800' :'bg-red-100 text-red-800'
                        }`}
                      >
                        {record?.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No attendance records found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'marks':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800">Average Marks</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {marksLoading ? '...' : `${calculateAverageMarks()}%`}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-800">Subjects</h3>
                <p className="text-2xl font-bold text-green-600">
                  {marksLoading ? '...' : new Set(marksData?.map(r => r?.subject_id))?.size || 0}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-purple-800">Total Exams</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {marksLoading ? '...' : marksData?.length || 0}
                </p>
              </div>
            </div>
            {/* Recent Marks */}
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Exam Results</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {marksLoading ? (
                  <div className="p-4 text-center text-gray-500">Loading marks...</div>
                ) : marksData?.length > 0 ? (
                  marksData?.slice(0, 5)?.map((record) => (
                    <div key={record?.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {record?.subject?.subject_name || 'Unknown Subject'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {record?.exam_type?.exam_name || 'Unknown Exam'}
                          </p>
                          <p className="text-xs text-gray-400">
                            {record?.exam_date ? new Date(record.exam_date)?.toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {record?.marks_obtained || 0}/{record?.max_marks || 0}
                          </p>
                          <p className="text-sm text-gray-600">
                            {Math.round(record?.percentage || 0)}%
                          </p>
                          {record?.grade && (
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                ['A', 'A+']?.includes(record?.grade)
                                  ? 'bg-green-100 text-green-800'
                                  : ['B+', 'B']?.includes(record?.grade)
                                  ? 'bg-blue-100 text-blue-800' :'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              Grade {record?.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No exam records found</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Academic Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Performance</span>
                      <span className="font-medium">{calculateAverageMarks()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${calculateAverageMarks()}%`}}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                      <span>Attendance Rate</span>
                      <span className="font-medium">{calculateAttendancePercentage()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{width: `${calculateAttendancePercentage()}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Subject-wise Performance</h4>
                  <div className="text-sm text-gray-500">
                    Detailed subject analysis will be available soon
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border p-6 text-center">
              <Award className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Achievements</h3>
              <p className="text-gray-500">
                Your achievements and milestones will appear here as you progress.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs?.map((tab) => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab?.id
                    ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab?.label}</span>
                {tab?.count > 0 && (
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2.5 rounded-full text-xs">
                    {tab?.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default DashboardTabs;