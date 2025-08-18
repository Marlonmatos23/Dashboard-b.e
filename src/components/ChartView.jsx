import React from 'react';
// --- ADICIONADO: Importações completas para todos os componentes ---
import MapComponent from './MapComponent';
import MotorTempChart from './MotorTempChart';
import ControlTempChart from './ControlTempChart';
import BatteryStatus from './BatteryStatus';
import BatteryPercentage from './BatteryPercentage'; // Importado para a vista de bateria
import SpeedChart from './SpeedChart';
import WavesChart from './WavesChart';
import Compass from './Compass';
import WindSpeedChart from './WindSpeedChart';
import AutonomiaChart from './AutonomiaChart';
import CapacidadeRestanteChart from './CapacidadeRestanteChart';

const ChartView = ({ selectedChart, history, latestData, loading }) => {
  const PONTOS_HISTORICO_INDIVIDUAL = 30;
  const slicedHistory = history.slice(-PONTOS_HISTORICO_INDIVIDUAL);

  let chartComponent = null;

  switch (selectedChart) {
    // --- ATUALIZADO: O case 'battery' agora renderiza os dois componentes ---
    case 'battery':
      chartComponent = (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: '20px'}}>
          <div style={{flex: '0 1 220px', minHeight: '200px'}}>
            <BatteryPercentage percentage={latestData?.Porcentagem_Bateria} loading={loading} />
          </div>
          <div style={{flex: '1 1 auto'}}>
            <BatteryStatus voltage={latestData?.Volt} historyData={slicedHistory.map(h => h?.Volt ?? 0)} loading={loading} />
          </div>
        </div>
      );
      break;
      
    case 'motorTemp': 
      chartComponent = <MotorTempChart currentTemp={latestData?.Motor_Temp_C} historyData={slicedHistory.map(h => h?.Motor_Temp_C ?? 0)} loading={loading} />; 
      break;
      
    case 'speed': 
      chartComponent = <SpeedChart currentValue={latestData?.Speed_KPH} historyData={slicedHistory.map(h => h?.Speed_KPH ?? 0)} title="Velocidade (KPH)" loading={loading} />; 
      break;
      
    case 'motorSpeed': 
      chartComponent = <SpeedChart currentValue={latestData?.Motor_Speed_RPM} historyData={slicedHistory.map(h => h?.Motor_Speed_RPM ?? 0)} title="Motor (RPM)" loading={loading} />; 
      break;
      
    case 'controlTemp': 
      chartComponent = <ControlTempChart currentTemp={latestData?.Ctrl_Temp_C} historyData={slicedHistory.map(h => h?.Ctrl_Temp_C ?? 0)} loading={loading} />; 
      break;
      
    case 'waves': 
      chartComponent = <WavesChart currentValue={latestData?.Current} historyData={slicedHistory.map(h => h?.Current ?? 0)} loading={loading} />; 
      break;
      
    case 'autonomia': 
      chartComponent = <AutonomiaChart currentValue={latestData?.Autonomia} historyData={slicedHistory.map(h => h?.Autonomia ?? 0)} loading={loading} />; 
      break;
      
    case 'capacidade': 
      chartComponent = <CapacidadeRestanteChart currentValue={latestData?.Capacidade_Restante} historyData={slicedHistory.map(h => h?.Capacidade_Restante ?? 0)} loading={loading} />; 
      break;
      
    case 'windSpeed': 
      chartComponent = <WindSpeedChart loading={loading} />; 
      break;
      
    // --- ATUALIZADO: Passa a prop 'speedMode' para o Compass ---
    case 'navigation': 
      chartComponent = <Compass heading={latestData?.Heading ?? 0} speedMode={latestData?.Speed_Mode} loading={loading} />; 
      break;
      
    default: 
      chartComponent = <div className="content-placeholder">Selecione um indicador para ver em detalhe.</div>;
  }

  return (
    // O wrapper 'dashboard-page-wrapper' foi removido para usar o layout flex do App.css
    <>
      <div className="map-view-container"> 
        <MapComponent latitude={latestData?.Latitude} longitude={latestData?.Longitude} /> 
      </div>
      <div className="chart-view-container" key={selectedChart}> 
        {chartComponent} 
      </div>
    </>
  );
};

export default ChartView;
