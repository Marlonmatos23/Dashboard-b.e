import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import SponsorsScreen from './components/SponsorsScreen';
import DashboardPage from './components/DashboardPage';
import HistoricalPage from './components/HistoricalPage';
import ConfigPage from './components/ConfigPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import './App.css';

//Teste Consumo Api
import WindSpeedChart from './components/chart/WindSpeedChart'

const AppContent = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('all');
  
  // --- CORREÇÃO: Lógica de Sessão ---
  // O estado agora é inicializado com base no sessionStorage.
  // Se 'splashScreenShown' existir, showSponsors será 'false'.
  // Se não existir, será 'true'.
  const [showSponsors, setShowSponsors] = useState(() => {
    return !sessionStorage.getItem('splashScreenShown');
  });

  const fetchData = useCallback(() => {
    axios.get('http://localhost:5000/dados')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setHistory(currentHistory => {
            const newHistory = res.data.slice(-100);
            if (JSON.stringify(currentHistory) === JSON.stringify(newHistory)) return currentHistory;
            return newHistory;
          });
          if (error) setError(null);
        }
      })
      .catch(err => { setError('Não foi possível ligar ao servidor.'); })
      .finally(() => { if (loading) setLoading(false); });
  }, [error, loading]);

  useEffect(() => {
    if (showSponsors) return;
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [showSponsors, fetchData]);

  const latestData = history.length > 0 ? history[history.length - 1] : null;

  // --- CORREÇÃO: Lógica de Sessão ---
  // Quando a animação dos patrocinadores termina, escondemos a tela
  // E guardamos a informação no sessionStorage.
  const handleSponsorsFinished = () => {
    sessionStorage.setItem('splashScreenShown', 'true');
    setShowSponsors(false);
  };

  if (showSponsors) {
    return <SponsorsScreen onFinished={handleSponsorsFinished} />;
  }

  return (
    <div className="app-container">
      <Header />
      <Sidebar selectedChart={selectedChart} onSelectChart={setSelectedChart} />
      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage history={history} latestData={latestData} selectedChart={selectedChart} loading={loading && history.length === 0} error={error} />} />
          <Route path="/historico" element={<HistoricalPage history={history} />} />
          <Route path="/configuracao" element={<ConfigPage />} />
          <Route path="/testeWspeed" element={<WindSpeedChart />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (<BrowserRouter><AppContent /></BrowserRouter>);
export default App;
