// src/components/PLGraph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';

import './PLGraph.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const PLGraph = () => {
  const data = {
    labels: Array.from({ length: 470 }, (_, i) => new Date(2024, 0, i + 1).toLocaleDateString('en-US')),
    datasets: [
      {
        type: 'line',
        label: 'Valor de la linea',
        data: Array.from({ length: 470 }, () => Math.floor(300 + Math.random() * 700)),
        borderColor: 'rgba(0, 255, 0, 1)',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(0, 255, 0, 1)',
        pointBorderColor: '#fff',
        fill: false,
        order: 3,
        
      },
      {
        type: 'line',
        label: 'Linea de referencia',
        data: Array(470).fill(500),
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        order: 4,
      },
      {
        type: 'bar',
        label: 'Franja de Subidas/Bajadas',
        data: Array.from({ length: 470 }, () => Math.floor(200 + Math.random() * 500)),
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        order: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          color: '#ffffff',
        },
        time: {
          unit: 'day',
          tooltipFormat: 'MM/dd/yyyy',
          displayFormats: {
            day: 'MM/dd/yyyy',
          },
        },
        ticks: {
          color: '#ffffff',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 20,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Valor ($)',
          color: '#ffffff',
        },
        ticks: {
          color: '#ffffff',
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  };

  return (
    <section className="pl-graph">
      <header className="pl-graph-header-title">
        <h2 className="pl-graph-title">
          <i className="fas fa-caret-down"></i> Underlying & P/L Graph
        </h2>
      </header>
      <div className="pl-graph-content">
        <div className="pl-graph-content-container">
          <Line data={data} options={options} />
        </div>
      </div>
    </section>
  );
};

export default PLGraph;