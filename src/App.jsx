import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import SponsorsScreen from './components/SponsorsScreen';
import DashboardPage from './components/DashboardPage';
import HistoricalPage from './components/HistoricalPage';
import ConfigPage from './components/ConfigPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import './App.css';

const AppContent = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('all');
  const [showSponsors, setShowSponsors] = useState(() => !sessionStorage.getItem('splashScreenShown'));

  const fetchData = useCallback(() => {
    axios.get('http://192.168.1.141:5000/dados')
      .then(res => {
        if (res.data && Array.isArray(res.data)) {
          setHistory(res.data.slice(-100));
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
  const handleSponsorsFinished = () => { sessionStorage.setItem('splashScreenShown', 'true'); setShowSponsors(false); };

  if (showSponsors) {
    return <SponsorsScreen onFinished={handleSponsorsFinished} />;
  }

  return (
    <div className="app-container">
      <Header />
      <Sidebar selectedChart={selectedChart} onSelectChart={setSelectedChart} />
      <main className="content">
        <div className="main-view-wrapper">
          <Routes>
            <Route path="/" element={<DashboardPage history={history} latestData={latestData} selectedChart={selectedChart} loading={loading && history.length === 0} error={error} />} />
            <Route path="/historico" element={<HistoricalPage />} />
            <Route path="/configuracao" element={<ConfigPage />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
};

const App = () => (<BrowserRouter><AppContent /></BrowserRouter>);
export default App;
