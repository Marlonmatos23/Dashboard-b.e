import React from 'react';
import ChartComponent from './ChartComponent';

// 1. Aceitar 'title' e 'label' como props
const WavesChart = ({ currentValue, historyData, loading, title, label }) => {
  const chartOptions = {
    // 2. Usar as props
    title: `${title}: ${(!loading && currentValue != null) ? currentValue.toFixed(2) + ' A' : '---'}`,
    label: label,
    datasetOptions: { borderColor: '#9b59b6', backgroundColor: 'rgba(155, 89, 182, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default WavesChart;
