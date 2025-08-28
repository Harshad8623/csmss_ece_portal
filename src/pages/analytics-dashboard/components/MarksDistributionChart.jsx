import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS?.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarksDistributionChart = ({ data, className = '' }) => {
  const chartData = {
    labels: data?.labels,
    datasets: data?.datasets?.map((dataset, index) => ({
      ...dataset,
      backgroundColor: [
        'rgba(30, 64, 175, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(5, 150, 105, 0.8)',
        'rgba(217, 119, 6, 0.8)',
        'rgba(220, 38, 38, 0.8)'
      ]?.[index % 5],
      borderColor: [
        'rgb(30, 64, 175)',
        'rgb(14, 165, 233)',
        'rgb(5, 150, 105)',
        'rgb(217, 119, 6)',
        'rgb(220, 38, 38)'
      ]?.[index % 5],
      borderWidth: 1,
      borderRadius: 4,
      borderSkipped: false
    }))
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context?.dataset?.label}: ${context?.parsed?.y} marks`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 11
          },
          callback: function(value) {
            return value;
          }
        }
      }
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Marks Distribution</h3>
          <p className="text-sm text-muted-foreground">Class-wise performance analysis</p>
        </div>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MarksDistributionChart;