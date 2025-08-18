import React from 'react';
// Importa todos os componentes, incluindo o novo BatteryPercentage
import MotorTempChart from './MotorTempChart';
import ControlTempChart from './ControlTempChart';
import BatteryStatus from './BatteryStatus';
import BatteryPercentage from './BatteryPercentage'; // Importado
import SpeedChart from './SpeedChart';
import WavesChart from './WavesChart';
import Compass from './Compass';
import MapComponent from './MapComponent';
import AutonomiaChart from './AutonomiaChart';
import CapacidadeRestanteChart from './CapacidadeRestanteChart';
import WindSpeedChart from './WindSpeedChart';

const AllCharts = ({ history, latestData, loading }) => {
  const PONTOS_HISTORICO_MINI = 15;
  const miniSlicedHistory = history.slice(-PONTOS_HISTORICO_MINI);
  
  const allTemps = history.flatMap(h => [h?.Motor_Temp_C, h?.Ctrl_Temp_C]).filter(t => t != null);
  const minTemp = allTemps.length > 0 ? Math.floor(Math.min(...allTemps) - 5) : 0;
  const maxTemp = allTemps.length > 0 ? Math.ceil(Math.max(...allTemps) + 5) : 100;

  // A grelha de itens agora tem dois componentes para a bateria
  const itemsToDisplay = [
    { id: 'map', Comp: MapComponent, props: { latitude: latestData?.Latitude, longitude: latestData?.Longitude } },
    { id: 'batteryPercentage', Comp: BatteryPercentage, props: { percentage: latestData?.Porcentagem_Bateria, loading } },
    { id: 'batteryStatus', Comp: BatteryStatus, props: { voltage: latestData?.Volt, historyData: miniSlicedHistory.map(h => h?.Volt ?? 0), loading } },
    { id: 'autonomia', Comp: AutonomiaChart, props: { currentValue: latestData?.Autonomia, historyData: miniSlicedHistory.map(h => h?.Autonomia ?? 0), loading } },
    { id: 'capacidade', Comp: CapacidadeRestanteChart, props: { currentValue: latestData?.Capacidade_Restante, historyData: miniSlicedHistory.map(h => h?.Capacidade_Restante ?? 0), loading } },
    { id: 'motorTemp', Comp: MotorTempChart, props: { currentTemp: latestData?.Motor_Temp_C, historyData: miniSlicedHistory.map(h => h?.Motor_Temp_C ?? 0), loading, minY: minTemp, maxY: maxTemp } },
    { id: 'controlTemp', Comp: ControlTempChart, props: { currentTemp: latestData?.Ctrl_Temp_C, historyData: miniSlicedHistory.map(h => h?.Ctrl_Temp_C ?? 0), loading, minY: minTemp, maxY: maxTemp } },
    { id: 'speed', Comp: SpeedChart, props: { currentValue: latestData?.Speed_KPH, historyData: miniSlicedHistory.map(h => h?.Speed_KPH ?? 0), title: 'Velocidade (KPH)', loading } },
    { id: 'motorSpeed', Comp: SpeedChart, props: { currentValue: latestData?.Motor_Speed_RPM, historyData: miniSlicedHistory.map(h => h?.Motor_Speed_RPM ?? 0), title: 'Motor (RPM)', loading } },
    { id: 'waves', Comp: WavesChart, props: { currentValue: latestData?.Current, historyData: miniSlicedHistory.map(h => h?.Current ?? 0), loading } },
    { id: 'windSpeed', Comp: WindSpeedChart, props: { loading } },
    { id: 'compass', Comp: Compass, props: { heading: latestData?.Heading ?? 0, speedMode: latestData?.Speed_Mode, loading } },
  ];

  return (
    <div className="all-charts-container">
      {itemsToDisplay.map(({ id, Comp, props }) => (
        <div key={id} className="grid-item">
          <Comp {...props} />
        </div>
      ))}
    </div>
  );
};
export default AllCharts;
