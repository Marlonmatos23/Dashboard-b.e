import React from 'react';
import ChartComponent from './ChartComponent';

// 1. Aceitar 'label' como prop (já aceitava 'title')
const SpeedChart = ({ currentValue, historyData, loading, title, label }) => {
  const chartOptions = {
    // 2. Usar as props
    title: `${title}: ${(!loading && currentValue != null) ? currentValue : '---'}`,
    label: label,
    datasetOptions: { borderColor: '#2ecc71', backgroundColor: 'rgba(46, 204, 113, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default SpeedChart;
