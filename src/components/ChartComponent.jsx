import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Função para criar o gradiente de fundo do gráfico
const createGradient = (ctx, area, color1, color2) => {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
};

const ChartComponent = ({ data, options, loading }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const datasetOptions = options?.datasetOptions || {};
    const gradientBg = createGradient(
      chart.ctx,
      chart.chartArea,
      datasetOptions.backgroundColor || 'rgba(0, 0, 0, 0)',
      datasetOptions.gradientColor || 'rgba(0, 0, 0, 0.1)'
    );

    setChartData({
      labels: data?.map((_, index) => index + 1) || [],
      datasets: [{
        label: options?.label || 'Dataset',
        data: data || [],
        ...datasetOptions,
        backgroundColor: gradientBg, // Aplica o gradiente
      }],
    });
  }, [data, options]);

  const chartJS_options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: { duration: 800, easing: 'easeInOutCubic' }, // Animação mais suave
    scales: {
      y: {
        ticks: { color: '#EAEAEA', font: { size: 10 } },
        grid: { color: 'rgba(58, 58, 60, 0.5)', borderDash: [2, 4] },
        min: options?.scales?.y?.min,
        max: options?.scales?.y?.max,
      },
      x: {
        ticks: { color: '#EAEAEA', font: { size: 10 } },
        grid: { display: false } // Remove as grelhas verticais para um look mais limpo
      }
    },
    plugins: {
      legend: { display: false }, // Legenda removida para um visual mais limpo (o título já informa)
      title: {
        display: !!options?.title,
        text: options?.title,
        color: '#FFFFFF',
        font: { size: 14, weight: '500' },
        align: 'start',
        padding: { top: 0, bottom: 10 }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(44, 44, 46, 0.85)',
        titleColor: '#FFFFFF',
        bodyColor: '#EAEAEA',
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        padding: 10,
        caretSize: 6,
        cornerRadius: 8,
        yAlign: 'bottom',
      }
    }
  };

  if (loading) return <div className="content-placeholder">A carregar...</div>;
  if (!data || data.length === 0) return <div className="content-placeholder">Sem dados.</div>;

  return <Line ref={chartRef} data={chartData} options={chartJS_options} />;
};
export default ChartComponent;
