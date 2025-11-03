import React from 'react';
import ChartComponent from './ChartComponent';

// 1. Aceitar 'title' e 'label' como props
const MotorTempChart = ({ currentTemp, historyData, loading, minY, maxY, title, label }) => {
  const chartOptions = {
    // 2. Usar as props
    title: `${title}: ${(!loading && currentTemp != null) ? currentTemp.toFixed(1) + '°C' : '---'}`,
    label: label,
    datasetOptions: { borderColor: '#f39c12', backgroundColor: 'rgba(243, 156, 18, 0.3)', fill: true },
    scales: { y: { min: minY, max: maxY } },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default MotorTempChart;
