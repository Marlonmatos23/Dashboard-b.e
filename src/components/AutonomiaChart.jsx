import React from 'react';
import ChartComponent from './ChartComponent';
const AutonomiaChart = ({ currentValue, historyData, loading }) => {
  const chartOptions = {
    title: `Autonomia: ${(!loading && currentValue != null) ? currentValue.toFixed(1) + ' km' : '---'}`,
    label: 'Autonomia (km)',
    datasetOptions: { borderColor: '#1abc9c', backgroundColor: 'rgba(26, 188, 156, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default AutonomiaChart;
