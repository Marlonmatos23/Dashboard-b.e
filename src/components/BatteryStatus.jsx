import React from 'react';
import ChartComponent from './ChartComponent';

// 1. Aceitar 'title' e 'label' como props
const BatteryStatus = ({ voltage, historyData, loading, title, label }) => {
  const chartOptions = {
    // 2. Usar as props
    title: `${title}: ${(!loading && voltage != null) ? voltage.toFixed(2) + ' V' : '---'}`,
    label: label,
    datasetOptions: {
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.3)',
      fill: true,
    },
  };

  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};

export default BatteryStatus;
