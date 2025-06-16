import React from "react";
import ChartComponent from '../ChartComponent';
import useWeatherHistory from "../../services/WindSpeedServices";

function WindSpeedChart() {
  const { history, loading, error } = useWeatherHistory();

  if (error) return <p>Erro: {error}</p>;

  // Extrai o valor atual (último registro)
  const currentValue = history?.length > 0 ? history[history.length - 1]?.windspeed : null;
  
  // Prepara os dados históricos para o gráfico no formato esperado pelo ChartComponent
  const historyData = history?.map((item, index) => ({
    x: index, // ou item.timestamp se você tiver
    y: item.windspeed
  })) || [];

  // Configurações do gráfico (seguindo o padrão do SpeedChart)
  const chartOptions = {
    title: `Velocidade do Vento: ${(!loading && currentValue != null) ? `${currentValue} km/h` : '---'}`,
    label: "Velocidade do Vento",
    datasetOptions: { 
      borderColor: '#fff', // Cor vermelha para diferenciação
      backgroundColor: 'rgba(255, 255, 255, 0.3)', 
      fill: true 
    },
  };
  
  return <ChartComponent data={historyData} options={chartOptions} loading={loading} />;
}

export default WindSpeedChart;