import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar
// Importações completas
import MapComponent from './MapComponent';
import MotorTempChart from './MotorTempChart';
import ControlTempChart from './ControlTempChart';
import BatteryStatus from './BatteryStatus';
import BatteryPercentage from './BatteryPercentage';
import SpeedChart from './SpeedChart';
import WavesChart from './WavesChart';
import Compass from './Compass';
import WindSpeedChart from './WindSpeedChart';
import AutonomiaChart from './AutonomiaChart';
import CapacidadeRestanteChart from './CapacidadeRestanteChart';

const ChartView = ({ selectedChart, history, latestData, loading }) => {
  const { t } = useTranslation(); // 2. Inicializar
  const PONTOS_HISTORICO_INDIVIDUAL = 30;
  const slicedHistory = history.slice(-PONTOS_HISTORICO_INDIVIDUAL);

  let chartComponent = null;

  // 3. Passar títulos e labels traduzidos como props
  switch (selectedChart) {
    case 'battery':
      chartComponent = (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: '20px'}}>
          <div style={{flex: '0 1 220px', minHeight: '200px'}}>
            <BatteryPercentage percentage={latestData?.Porcentagem_Bateria} loading={loading} title={t('chartTitleBatteryPercent')} />
          </div>
          <div style={{flex: '1 1 auto'}}>
            <BatteryStatus voltage={latestData?.Volt} historyData={slicedHistory.map(h => h?.Volt ?? 0)} loading={loading} title={t('chartTitleBatteryVolt')} label={t('chartLabelBatteryVolt')} />
          </div>
        </div>
      );
      break;
      
    case 'motorTemp': 
      chartComponent = <MotorTempChart currentTemp={latestData?.Motor_Temp_C} historyData={slicedHistory.map(h => h?.Motor_Temp_C ?? 0)} loading={loading} title={t('chartTitleMotorTemp')} label={t('chartLabelMotorTemp')} />; 
      break;
      
    case 'speed': 
      chartComponent = <SpeedChart currentValue={latestData?.Speed_KPH} historyData={slicedHistory.map(h => h?.Speed_KPH ?? 0)} loading={loading} title={t('chartTitleSpeedKPH')} label={t('chartLabelSpeedKPH')} />; 
      break;
      
    case 'motorSpeed': 
      chartComponent = <SpeedChart currentValue={latestData?.Motor_Speed_RPM} historyData={slicedHistory.map(h => h?.Motor_Speed_RPM ?? 0)} loading={loading} title={t('chartTitleMotorRPM')} label={t('chartLabelMotorRPM')} />; 
      break;
      
    case 'controlTemp': 
      chartComponent = <ControlTempChart currentTemp={latestData?.Ctrl_Temp_C} historyData={slicedHistory.map(h => h?.Ctrl_Temp_C ?? 0)} loading={loading} title={t('chartTitleControlTemp')} label={t('chartLabelControlTemp')} />; 
      break;
      
    case 'waves': 
      chartComponent = <WavesChart currentValue={latestData?.Current} historyData={slicedHistory.map(h => h?.Current ?? 0)} loading={loading} title={t('chartTitleCurrent')} label={t('chartLabelCurrent')} />; 
      break;
      
    case 'autonomia': 
      chartComponent = <AutonomiaChart currentValue={latestData?.Autonomia} historyData={slicedHistory.map(h => h?.Autonomia ?? 0)} loading={loading} title={t('chartTitleAutonomy')} label={t('chartLabelAutonomy')} />; 
      break;
      
    case 'capacidade': 
      chartComponent = <CapacidadeRestanteChart currentValue={latestData?.Capacidade_Restante} historyData={slicedHistory.map(h => h?.Capacidade_Restante ?? 0)} loading={loading} title={t('chartTitleCapacity')} label={t('chartLabelCapacity')} />; 
      break;
      
    case 'windSpeed': 
      chartComponent = <WindSpeedChart loading={loading} />; 
      break;
      
    case 'navigation': 
      chartComponent = <Compass heading={latestData?.Heading ?? 0} speedMode={latestData?.Speed_Mode} loading={loading} />; 
      break;
      
    default: 
      chartComponent = <div className="content-placeholder">{t('statusNoData')}</div>; // 4. Traduzir
  }

  return (
    // Aplicando o layout de duas colunas (mapa e gráfico)
    <div className="chart-view-wrapper">
      <div className="map-container"> 
        <MapComponent latitude={latestData?.Latitude} longitude={latestData?.Longitude} /> 
      </div>
      <div className="grafico-container" key={selectedChart}> 
        {chartComponent} 
      </div>
    </div>
  );
};

export default ChartView;
