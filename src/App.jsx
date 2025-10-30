import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { parseISO, differenceInSeconds, isValid } from 'date-fns'; // Importa funções de data

// Componentes da Aplicação
import SponsorsScreen from './components/SponsorsScreen';
import DashboardPage from './components/DashboardPage';
import HistoricalPage from './components/HistoricalPage';
import ConfigPage from './components/ConfigPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Notification from './components/Notification'; // <-- Importa o novo componente
import './App.css';

const AppContent = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('all');
  const [showSponsors, setShowSponsors] = useState(() => !sessionStorage.getItem('splashScreenShown'));
  const [notifications, setNotifications] = useState([]); // <-- Estado para notificações
  const lastTimestampRef = useRef(null); // Para guardar o último timestamp válido
  const notificationTimeoutRef = useRef(null); // Ref para evitar notificações repetidas de dados antigos

  // Função para adicionar uma notificação (evita duplicados recentes)
  const addNotification = useCallback((message, type = 'error') => {
    setNotifications(prev => {
      // Verifica se já existe uma notificação com a mesma mensagem
      if (prev.some(n => n.message === message)) {
        return prev; // Não adiciona se já existir
      }
      const newNotification = { id: Date.now(), message, type };
      // Adiciona a nova e mantém no máximo 5 notificações
      return [newNotification, ...prev.slice(0, 4)];
    });
  }, []);

  // Função para remover uma notificação pelo ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Função principal para buscar dados e verificar falhas
  const fetchData = useCallback(() => {
    axios.get('http://localhost:5000/dados')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const latestEntry = res.data[res.data.length - 1];
          const currentTimestamp = latestEntry?.Timestamp ? parseISO(latestEntry.Timestamp) : null;

          if (currentTimestamp && isValid(currentTimestamp)) {
             const secondsDiff = differenceInSeconds(new Date(), currentTimestamp);
             const MAX_DELAY_SECONDS = 60; // Limite de 60 segundos para considerar falha

             if (secondsDiff > MAX_DELAY_SECONDS) {
                // Adiciona notificação de dados antigos apenas se não houver uma recente
                if (!notificationTimeoutRef.current) {
                   addNotification(`Alerta: Último dado do sensor tem ${secondsDiff}s.`, 'warning');
                   // Define um timeout para não mostrar esta notificação novamente por 1 minuto
                   notificationTimeoutRef.current = setTimeout(() => {
                       notificationTimeoutRef.current = null;
                   }, 60000); // 1 minuto
                }
             } else {
               // Dados recentes e válidos: atualiza a referência e limpa erros/avisos
               lastTimestampRef.current = currentTimestamp;
               if (apiError) setApiError(null); // Limpa erro da API
               // Limpa o timeout da notificação de dados antigos se os dados voltaram ao normal
               if (notificationTimeoutRef.current) {
                  clearTimeout(notificationTimeoutRef.current);
                  notificationTimeoutRef.current = null;
               }
             }
          } else {
             // Timestamp inválido (problema nos dados recebidos)
             addNotification('Erro: Timestamp inválido recebido do sensor.', 'error');
          }
          setHistory(res.data.slice(-100)); // Atualiza o histórico
        } else {
          // Resposta vazia da API (pode ser temporário ou não)
           addNotification('Aviso: Nenhum dado recebido do servidor.', 'warning');
        }
        // Limpa o erro da API se a conexão foi bem-sucedida
        if(apiError) setApiError(null);
      })
      .catch(err => {
        const errorMsg = 'Falha: Não foi possível conectar ao servidor de dados.';
        if (!apiError) { // Mostra o erro de API apenas uma vez
          addNotification(errorMsg, 'error');
          setApiError(errorMsg); // Guarda o estado do erro
        }
        console.error("Erro no fetch:", err.response?.data || err.message);
      })
      .finally(() => { if (loading) setLoading(false); });
  }, [apiError, loading, addNotification]); // Adiciona addNotification às dependências

  // Efeito para buscar dados e verificar a "saúde" dos dados periodicamente
  useEffect(() => {
    if (showSponsors) return;

    fetchData(); // Busca inicial
    const intervalId = setInterval(fetchData, 5000); // Continua a buscar a cada 5s

    // Adiciona uma verificação extra a cada 15 segundos para ver se parou de receber dados
    const healthCheckIntervalId = setInterval(() => {
      if (lastTimestampRef.current) {
        const secondsDiff = differenceInSeconds(new Date(), lastTimestampRef.current);
        if (secondsDiff > 15) { // Se não recebe dados válidos por mais de 15s
          addNotification(`Alerta: Sem dados válidos do sensor há mais de ${secondsDiff} segundos.`, 'warning');
        }
      } else if (!loading && !apiError && history.length > 0) {
          // Se não está carregando, não tem erro de API, JÁ recebeu dados antes, mas nunca um timestamp válido
          addNotification(`Aviso: Aguardando o primeiro dado válido do sensor.`, 'warning');
      }
    }, 15000); // Verifica a cada 15 segundos

    // Limpa os intervalos e timeouts ao desmontar
    return () => {
      clearInterval(intervalId);
      clearInterval(healthCheckIntervalId);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [showSponsors, fetchData, loading, apiError, addNotification, history.length]); // Adiciona history.length

  const latestData = history.length > 0 ? history[history.length - 1] : null;
  const handleSponsorsFinished = () => { sessionStorage.setItem('splashScreenShown', 'true'); setShowSponsors(false); };

  if (showSponsors) {
    return <SponsorsScreen onFinished={handleSponsorsFinished} />;
  }

  return (
    <div className="app-container">
      {/* Container que renderiza as notificações */}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={removeNotification}
          />
        ))}
      </div>

      <Header />
      <Sidebar selectedChart={selectedChart} onSelectChart={setSelectedChart} />
      <main className="content">
        <div className="main-view-wrapper">
          <Routes>
            <Route path="/" element={<DashboardPage history={history} latestData={latestData} selectedChart={selectedChart} loading={loading && history.length === 0} error={apiError} />} />
            {/* HistoricalPage agora busca seus próprios dados */}
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

