import React from 'react';
import MapComponent from './MapComponent';
import AllCharts from './AllCharts';
import ChartView from './ChartView';

const DashboardPage = ({ history, latestData, selectedChart, loading, error }) => {
  if (loading) return <div className="content-placeholder">A carregar dashboard...</div>;
  if (error) return <div className="content-placeholder" style={{color: 'red'}}>{error}</div>;
  if (!latestData) return <div className="content-placeholder">A aguardar dados do servidor...</div>;

  // Renderiza a grelha completa (que inclui o mapa) ou a vista de gráfico único
  if (selectedChart === 'all') {
    return <AllCharts history={history} latestData={latestData} loading={loading} />;
  }

  return (
    <div className="dashboard-page-wrapper">
      <div className="map-container">
        <MapComponent latitude={latestData?.Latitude} longitude={latestData?.Longitude} />
      </div>
      <div className="grafico-container">
        <ChartView selectedChart={selectedChart} history={history} latestData={latestData} loading={loading} />
      </div>
    </div>
  );
};
export default DashboardPage;
