import React from 'react';
import ChartComponent from './ChartComponent';

// 1. Aceitar 'title' e 'label' como props
const CapacidadeRestanteChart = ({ currentValue, historyData, loading, title, label }) => {
  const chartOptions = {
    // 2. Usar as props
    title: `${title}: ${(!loading && currentValue != null) ? Math.round(currentValue) + ' Ah' : '---'}`,
    label: label,
    datasetOptions: { borderColor: '#8e44ad', backgroundColor: 'rgba(142, 68, 173, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default CapacidadeRestanteChart;
