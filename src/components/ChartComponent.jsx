import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ChartComponent = ({ data, options, loading }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  useEffect(() => {
    setChartData({
      labels: data?.map((_, index) => index + 1) || [],
      datasets: [{ label: options?.label || 'Dataset', data: data || [], ...options?.datasetOptions, }],
    });
  }, [data, options]);
  const chartJS_options = {
    maintainAspectRatio: false, responsive: true, animation: { duration: 800, easing: 'easeInOutQuad' },
    scales: {
      y: { ticks: { color: '#FFFFFF' }, grid: { color: '#3A3A3C' }, min: options?.scales?.y?.min, max: options?.scales?.y?.max, },
      x: { ticks: { color: '#FFFFFF' }, grid: { color: '#3A3A3C' } }
    },
    plugins: {
      legend: { labels: { color: '#FFFFFF' } },
      title: { display: !!options?.title, text: options?.title, color: '#FFFFFF', font: { size: 16 } },
      tooltip: { backgroundColor: '#2C2C2E', titleColor: '#FFFFFF', bodyColor: '#FFFFFF', borderColor: '#3A3A3C', borderWidth: 1 }
    }
  };
  if (loading) return <div className="content-placeholder">A carregar...</div>;
  if (!data || data.length === 0) return <div className="content-placeholder">Sem dados.</div>;
  return <Line data={chartData} options={chartJS_options} />;
};
export default ChartComponent;
