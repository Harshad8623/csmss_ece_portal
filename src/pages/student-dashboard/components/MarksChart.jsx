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
import { motion } from 'framer-motion';

ChartJS?.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MarksChart = ({ marksData }) => {
  const chartData = {
    labels: marksData?.map(item => item?.subject),
    datasets: [
      {
        label: 'CT1',
        data: marksData?.map(item => item?.ct1),
        backgroundColor: 'rgba(30, 64, 175, 0.8)',
        borderColor: 'rgba(30, 64, 175, 1)',
        borderWidth: 1
      },
      {
        label: 'MidSem',
        data: marksData?.map(item => item?.midSem),
        backgroundColor: 'rgba(14, 165, 233, 0.8)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 1
      },
      {
        label: 'CT2',
        data: marksData?.map(item => item?.ct2),
        backgroundColor: 'rgba(5, 150, 105, 0.8)',
        borderColor: 'rgba(5, 150, 105, 1)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
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
            return `${context?.dataset?.label}: ${context?.parsed?.y}/30`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 30,
        ticks: {
          stepSize: 5
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Marks Comparison</h3>
        <div className="text-sm text-muted-foreground">
          Average: {Math.round(marksData?.reduce((acc, item) => acc + (item?.ct1 + item?.midSem + item?.ct2) / 3, 0) / marksData?.length)}/30
        </div>
      </div>
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default MarksChart;