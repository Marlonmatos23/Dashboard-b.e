import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar
// Importa todos os componentes
import MotorTempChart from './MotorTempChart';
import ControlTempChart from './ControlTempChart';
import BatteryStatus from './BatteryStatus';
import BatteryPercentage from './BatteryPercentage';
import SpeedChart from './SpeedChart';
import WavesChart from './WavesChart';
import Compass from './Compass';
import MapComponent from './MapComponent';
import AutonomiaChart from './AutonomiaChart';
import CapacidadeRestanteChart from './CapacidadeRestanteChart';
import WindSpeedChart from './WindSpeedChart';

const AllCharts = ({ history, latestData, loading }) => {
  const { t } = useTranslation(); // 2. Inicializar
  const PONTOS_HISTORICO_MINI = 15;
  const miniSlicedHistory = history.slice(-PONTOS_HISTORICO_MINI);
  
  const allTemps = history.flatMap(h => [h?.Motor_Temp_C, h?.Ctrl_Temp_C]).filter(t => t != null);
  const minTemp = allTemps.length > 0 ? Math.floor(Math.min(...allTemps) - 5) : 0;
  const maxTemp = allTemps.length > 0 ? Math.ceil(Math.max(...allTemps) + 5) : 100;

  // 3. Passar títulos e labels traduzidos como props
  const itemsToDisplay = [
    { id: 'map', Comp: MapComponent, props: { latitude: latestData?.Latitude, longitude: latestData?.Longitude } },
    { id: 'batteryPercentage', Comp: BatteryPercentage, props: { percentage: latestData?.Porcentagem_Bateria, loading, title: t('chartTitleBatteryPercent') } },
    { id: 'batteryStatus', Comp: BatteryStatus, props: { voltage: latestData?.Volt, historyData: miniSlicedHistory.map(h => h?.Volt ?? 0), loading, title: t('chartTitleBatteryVolt'), label: t('chartLabelBatteryVolt') } },
    { id: 'autonomia', Comp: AutonomiaChart, props: { currentValue: latestData?.Autonomia, historyData: miniSlicedHistory.map(h => h?.Autonomia ?? 0), loading, title: t('chartTitleAutonomy'), label: t('chartLabelAutonomy') } },
    { id: 'capacidade', Comp: CapacidadeRestanteChart, props: { currentValue: latestData?.Capacidade_Restante, historyData: miniSlicedHistory.map(h => h?.Capacidade_Restante ?? 0), loading, title: t('chartTitleCapacity'), label: t('chartLabelCapacity') } },
    { id: 'motorTemp', Comp: MotorTempChart, props: { currentTemp: latestData?.Motor_Temp_C, historyData: miniSlicedHistory.map(h => h?.Motor_Temp_C ?? 0), loading, minY: minTemp, maxY: maxTemp, title: t('chartTitleMotorTemp'), label: t('chartLabelMotorTemp') } },
    { id: 'controlTemp', Comp: ControlTempChart, props: { currentTemp: latestData?.Ctrl_Temp_C, historyData: miniSlicedHistory.map(h => h?.Ctrl_Temp_C ?? 0), loading, minY: minTemp, maxY: maxTemp, title: t('chartTitleControlTemp'), label: t('chartLabelControlTemp') } },
    { id: 'speed', Comp: SpeedChart, props: { currentValue: latestData?.Speed_KPH, historyData: miniSlicedHistory.map(h => h?.Speed_KPH ?? 0), loading, title: t('chartTitleSpeedKPH'), label: t('chartLabelSpeedKPH') } },
    { id: 'motorSpeed', Comp: SpeedChart, props: { currentValue: latestData?.Motor_Speed_RPM, historyData: miniSlicedHistory.map(h => h?.Motor_Speed_RPM ?? 0), loading, title: t('chartTitleMotorRPM'), label: t('chartLabelMotorRPM') } },
    { id: 'waves', Comp: WavesChart, props: { currentValue: latestData?.Current, historyData: miniSlicedHistory.map(h => h?.Current ?? 0), loading, title: t('chartTitleCurrent'), label: t('chartLabelCurrent') } },
    { id: 'windSpeed', Comp: WindSpeedChart, props: { loading } }, // WindSpeedChart traduz-se internamente
    { id: 'compass', Comp: Compass, props: { heading: latestData?.Heading ?? 0, speedMode: latestData?.Speed_Mode, loading } }, // Compass traduz-se internamente
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
