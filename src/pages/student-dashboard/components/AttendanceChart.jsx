import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS?.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const AttendanceChart = ({ attendanceData }) => {
  const chartData = {
    labels: attendanceData?.map(item => item?.subject),
    datasets: [
      {
        data: attendanceData?.map(item => item?.percentage),
        backgroundColor: [
          'rgba(30, 64, 175, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(5, 150, 105, 0.8)',
          'rgba(217, 119, 6, 0.8)',
          'rgba(220, 38, 38, 0.8)',
          'rgba(147, 51, 234, 0.8)'
        ],
        borderColor: [
          'rgba(30, 64, 175, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(5, 150, 105, 1)',
          'rgba(217, 119, 6, 1)',
          'rgba(220, 38, 38, 1)',
          'rgba(147, 51, 234, 1)'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context?.label}: ${context?.parsed}%`;
          }
        }
      }
    },
    cutout: '60%'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Subject-wise Attendance</h3>
        <div className="text-sm text-muted-foreground">
          Overall: {Math.round(attendanceData?.reduce((acc, item) => acc + item?.percentage, 0) / attendanceData?.length)}%
        </div>
      </div>
      <div className="h-80">
        <Doughnut data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default AttendanceChart;