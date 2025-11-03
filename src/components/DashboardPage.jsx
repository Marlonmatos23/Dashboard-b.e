import React from 'react';
import MapComponent from './MapComponent';
import AllCharts from './AllCharts';
import ChartView from './ChartView';
import { useTranslation } from 'react-i18next'; // 1. Importar

const DashboardPage = ({ history, latestData, selectedChart, loading, error }) => {
  const { t } = useTranslation(); // 2. Inicializar

  // 3. Traduzir placeholders
  if (loading) return <div className="content-placeholder">{t('dashboardLoading')}</div>;
  if (error) return <div className="content-placeholder" style={{color: 'red'}}>{error}</div>;
  if (!latestData) return <div className="content-placeholder">{t('dashboardWaiting')}</div>;

  // Renderiza a grelha completa (que inclui o mapa) ou a vista de gráfico único
  if (selectedChart === 'all') {
    return <AllCharts history={history} latestData={latestData} loading={loading} />;
  }

  return (
    // O wrapper foi movido para ChartView para melhor layout
    <ChartView selectedChart={selectedChart} history={history} latestData={latestData} loading={loading} />
  );
};
export default DashboardPage;
