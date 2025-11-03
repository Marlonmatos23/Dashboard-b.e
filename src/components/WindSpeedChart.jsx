import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next'; // 1. Importar

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, TimeScale);

const WindSpeedChart = () => {
  const { t } = useTranslation(); // 2. Inicializar
  const [chartData, setChartData] = useState({ datasets: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWindSpeed, setCurrentWindSpeed] = useState(null);

  useEffect(() => {
    const fetchWindData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://192.168.1.141:5000/weather');
        const data = response.data;
        if (data && data.hourly && data.hourly.time && data.hourly.windspeed_10m) {
          const labels = data.hourly.time.map(t => parseISO(t));
          const windSpeeds = data.hourly.windspeed_10m;
          const now = new Date();
          let closestIndex = 0;
          let smallestDiff = Infinity;
          labels.forEach((label, index) => {
            const diff = Math.abs(now - label);
            if (diff < smallestDiff) { smallestDiff = diff; closestIndex = index; }
          });
          setCurrentWindSpeed(windSpeeds[closestIndex]);
          setChartData({
            labels: labels,
            datasets: [{
              label: t('chartLabelWind'), // 3. Traduzir label
              data: windSpeeds,
              borderColor: '#3498db', backgroundColor: 'rgba(52, 152, 219, 0.2)',
              fill: true, tension: 0.3, pointRadius: 0,
            }]
          });
        }
        setError(null);
      } catch (err) { 
        setError(t('chartErrorWind')); // 4. Traduzir erro
      } 
      finally { setLoading(false); }
    };
    fetchWindData();
  }, [t]); // 5. Adicionar 't' às dependências

  const chartOptions = {
    maintainAspectRatio: false, responsive: true, animation: { duration: 800 },
    plugins: {
      legend: { labels: { color: '#FFFFFF' } },
      title: { 
        display: true, 
        text: `${t('chartTitleWind')}: ${currentWindSpeed !== null ? currentWindSpeed.toFixed(1) + ' km/h' : '---'}`, // 6. Traduzir título
        color: '#FFFFFF', font: { size: 16 } 
      },
    },
    scales: {
      x: { type: 'time', time: { unit: 'hour', tooltipFormat: 'dd/MM HH:mm' }, ticks: { color: '#FFFFFF' }, grid: { color: '#3A3A3C' }, },
      y: { ticks: { color: '#FFFFFF' }, grid: { color: '#3A3A3C' }, title: { display: true, text: 'km/h', color: '#8E8E93' } },
    },
  };

  // 7. Traduzir placeholders
  if (loading) return <div className="content-placeholder">{t('chartLoadingWind')}</div>;
  if (error) return <div className="content-placeholder" style={{color: '#e74c3c'}}>{error}</div>;
  return <Line data={chartData} options={chartOptions} />;
};
export default WindSpeedChart;
