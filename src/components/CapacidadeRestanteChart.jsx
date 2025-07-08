import React from 'react';
import ChartComponent from './ChartComponent';
const CapacidadeRestanteChart = ({ currentValue, historyData, loading }) => {
  const chartOptions = {
    title: `Capacidade: ${(!loading && currentValue != null) ? Math.round(currentValue) + ' Ah' : '---'}`,
    label: 'Capacidade Restante (Ah)',
    datasetOptions: { borderColor: '#8e44ad', backgroundColor: 'rgba(142, 68, 173, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default CapacidadeRestanteChart;
