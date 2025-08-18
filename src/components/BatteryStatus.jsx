import React from 'react';
import ChartComponent from './ChartComponent';

const BatteryStatus = ({ voltage, historyData, loading }) => {
  const chartOptions = {
    // O título agora mostra apenas a voltagem
    title: `Voltagem: ${(!loading && voltage != null) ? voltage.toFixed(2) + ' V' : '---'}`,
    label: 'Histórico de Voltagem (V)',
    datasetOptions: {
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.3)',
      fill: true,
    },
  };

  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};

export default BatteryStatus;
