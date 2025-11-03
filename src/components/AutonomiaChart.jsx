import React from 'react';
import ChartComponent from './ChartComponent';

// 1. Aceitar 'title' e 'label' como props
const AutonomiaChart = ({ currentValue, historyData, loading, title, label }) => {
  const chartOptions = {
    // 2. Usar as props
    title: `${title}: ${(!loading && currentValue != null) ? currentValue.toFixed(1) + ' km' : '---'}`,
    label: label,
    datasetOptions: { borderColor: '#1abc9c', backgroundColor: 'rgba(26, 188, 156, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default AutonomiaChart;
