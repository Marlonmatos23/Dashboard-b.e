import React from 'react';
import ChartComponent from './ChartComponent';

const BatteryStatus = ({ percentage, voltage, historyData, loading }) => {
  const chartOptions = {
    title: `Bateria: ${(!loading && percentage != null) ? percentage + '%' : '---'} (${(!loading && voltage != null) ? voltage.toFixed(2) + 'V' : '---'})`,
    label: 'Voltagem (V)',
    datasetOptions: { borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.3)', fill: true },
  };
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
};
export default BatteryStatus;
