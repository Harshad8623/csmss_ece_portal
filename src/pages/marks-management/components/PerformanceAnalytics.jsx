import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const PerformanceAnalytics = ({ 
  marksData = {}, 
  students = [], 
  selectedAssessment,
  className = '' 
}) => {
  const calculateAnalytics = () => {
    const marks = Object.values(marksData)?.map(studentMarks => {
      const total = (studentMarks?.theory || 0) + (studentMarks?.practical || 0);
      return total;
    })?.filter(mark => mark > 0);

    if (marks?.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        distribution: [],
        trendData: []
      };
    }

    const average = marks?.reduce((sum, mark) => sum + mark, 0) / marks?.length;
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);

    // Grade distribution
    const distribution = [
      { grade: 'A+ (90-100%)', count: marks?.filter(m => (m/25)*100 >= 90)?.length, color: '#059669' },
      { grade: 'A (80-89%)', count: marks?.filter(m => (m/25)*100 >= 80 && (m/25)*100 < 90)?.length, color: '#0ea5e9' },
      { grade: 'B (70-79%)', count: marks?.filter(m => (m/25)*100 >= 70 && (m/25)*100 < 80)?.length, color: '#d97706' },
      { grade: 'C (60-69%)', count: marks?.filter(m => (m/25)*100 >= 60 && (m/25)*100 < 70)?.length, color: '#dc2626' },
      { grade: 'F (<60%)', count: marks?.filter(m => (m/25)*100 < 60)?.length, color: '#7c2d12' }
    ];

    // Trend data (mock for different assessments)
    const trendData = [
      { assessment: 'CT1', average: average * 0.85, class: 'Previous' },
      { assessment: 'MidSem', average: average * 0.92, class: 'Previous' },
      { assessment: selectedAssessment, average: average, class: 'Current' }
    ];

    return { average, highest, lowest, distribution, trendData };
  };

  const analytics = calculateAnalytics();

  const StatCard = ({ title, value, icon, color = 'text-primary' }) => (
    <div className="bg-background border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon name={icon} size={24} className={color} />
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Class Average"
          value={`${analytics?.average?.toFixed(1)}/25`}
          icon="BarChart3"
          color="text-primary"
        />
        <StatCard
          title="Highest Score"
          value={`${analytics?.highest}/25`}
          icon="TrendingUp"
          color="text-success"
        />
        <StatCard
          title="Lowest Score"
          value={`${analytics?.lowest}/25`}
          icon="TrendingDown"
          color="text-error"
        />
      </div>
      {/* Grade Distribution Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="PieChart" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Grade Distribution</h3>
        </div>
        
        {analytics?.distribution?.some(d => d?.count > 0) ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.distribution?.filter(d => d?.count > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  label={({ grade, count }) => `${grade}: ${count}`}
                >
                  {analytics?.distribution?.filter(d => d?.count > 0)?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <Icon name="PieChart" size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No data available for distribution</p>
            </div>
          </div>
        )}
      </div>
      {/* Performance Trend */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Performance Trend</h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="assessment" />
              <YAxis domain={[0, 25]} />
              <Tooltip 
                formatter={(value) => [`${value?.toFixed(1)}/25`, 'Average Score']}
              />
              <Line 
                type="monotone" 
                dataKey="average" 
                stroke="#1e40af" 
                strokeWidth={2}
                dot={{ fill: '#1e40af', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top Performers */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Award" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Top Performers</h3>
        </div>
        
        <div className="space-y-3">
          {students?.map(student => ({
              ...student,
              total: (marksData?.[student?.id]?.theory || 0) + (marksData?.[student?.id]?.practical || 0)
            }))?.filter(student => student?.total > 0)?.sort((a, b) => b?.total - a?.total)?.slice(0, 5)?.map((student, index) => (
              <div key={student?.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white': 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{student?.name}</p>
                    <p className="text-sm text-muted-foreground">{student?.prn}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">{student?.total}/25</p>
                  <p className="text-sm text-muted-foreground">
                    {((student?.total / 25) * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
        </div>
        
        {students?.filter(s => (marksData?.[s?.id]?.theory || 0) + (marksData?.[s?.id]?.practical || 0) > 0)?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Award" size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No marks entered yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceAnalytics;