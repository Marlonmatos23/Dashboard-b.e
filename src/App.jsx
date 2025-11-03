import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import axios from 'axios'; // Removido - não é mais necessário
import { parseISO, differenceInSeconds, isValid } from 'date-fns';
import { useTranslation } from 'react-i18next';
import mqtt from 'mqtt'; // 1. Importar a biblioteca MQTT

// Componentes da Aplicação
import SponsorsScreen from './components/SponsorsScreen';
import DashboardPage from './components/DashboardPage';
import HistoricalPage from './components/HistoricalPage';
import ConfigPage from './components/ConfigPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Notification from './components/Notification';
import './App.css';

// --- Configurações do MQTT (ATUALIZADAS) ---
const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884'; // ATUALIZADO (WSS e Porta 8884)
const BOAT_ID = "barco-01"; // ID do barco para subscrever
const MQTT_TOPICS = [
  `boats/${BOAT_ID}/telemetry/live`,
  `boats/${BOAT_ID}/trip/status`,
  `boats/${BOAT_ID}/trip/log`
];
// ------------------------------------------

const AppContent = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null); // Renomeado de apiError
  const [selectedChart, setSelectedChart] = useState('all');
  const [showSponsors, setShowSponsors] = useState(() => !sessionStorage.getItem('splashScreenShown'));
  const [notifications, setNotifications] = useState([]);
  const lastTimestampRef = useRef(null);
  const notificationTimeoutRef = useRef(null);

  const addNotification = useCallback((message, type = 'error') => {
    setNotifications(prev => {
      if (prev.some(n => n.message === message)) {
        return prev;
      }
      const newNotification = { id: Date.now(), message, type };
      return [newNotification, ...prev.slice(0, 4)];
    });
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // 2. REMOVIDA: A função antiga `fetchData` (polling com axios) foi removida.

  // 3. NOVO: useEffect para a ligação MQTT
  useEffect(() => {
    if (showSponsors) return; // Não ligar antes do splash

    setLoading(true);
    setConnectionError(null);

    // Gerar clientId e opções de conexão
    const clientId = `electric_boat_dashboard_${Math.random().toString(16).substr(2, 8)};`; // ID Único
    console.log(`==================================${clientId}`)
    const connectOptions = {
      clientId,
      protocol: 'wss', // Especificar wss para porta 8884
    };

    // Ligar ao Broker MQTT
    const client = mqtt.connect(MQTT_BROKER_URL, connectOptions);

    client.on('connect', () => {
      console.log('Conectado ao MQTT Broker!');
      setLoading(false); // Conectado, parar o loading
      if (connectionError) setConnectionError(null); // Limpar erro antigo
      
      // Subscrever aos tópicos (agora um array)
      client.subscribe(MQTT_TOPICS, (err) => {
        if (err) {
          console.error('Erro ao subscrever aos tópicos:', err);
          const errorMsg = 'Falha ao subscrever aos tópicos MQTT.';
          addNotification(errorMsg, 'error');
          setConnectionError(errorMsg);
        } else {
          console.log(`Subscrito aos tópicos: ${MQTT_TOPICS.join(', ')}`);
        }
      });
    });

    // Evento de nova mensagem (LÓGICA ATUALIZADA)
    client.on('message', (topic, message) => {
      try {
        const payloadString = message.toString();
        
        // Rota 1: Mensagem de Telemetria (para os gráficos)
        if (topic === `boats/${BOAT_ID}/telemetry/live`) {
          const newDataPoint = JSON.parse(payloadString);
          
          if (!newDataPoint.Timestamp) {
            newDataPoint.Timestamp = new Date().toISOString();
          }

          setHistory(prevHistory => {
            const updatedHistory = [...prevHistory, newDataPoint];
            return updatedHistory.slice(-100);
          });

          const currentTimestamp = parseISO(newDataPoint.Timestamp);
          if (isValid(currentTimestamp)) {
            lastTimestampRef.current = currentTimestamp;
            if (notificationTimeoutRef.current) {
              clearTimeout(notificationTimeoutRef.current);
              notificationTimeoutRef.current = null;
            }
          } else {
            addNotification(t('appAlertTimestamp'), 'error');
          }
        } 
        
        // Rota 2: Mensagem de Status da Viagem (para notificação)
        else if (topic === `boats/${BOAT_ID}/trip/status`) {
          // Ex: payloadString pode ser "Iniciada", "Concluída", etc.
          addNotification(`${t('appTripStatus')}: ${payloadString}`, 'info'); // 'info' é tipo azul
        } 
        
        // Rota 3: Mensagem de Log da Viagem (para notificação)
        else if (topic === `boats/${BOAT_ID}/trip/log`) {
          console.log("Log da Viagem Recebido:", payloadString);
          addNotification(t('appTripLogReceived'), 'info');
        }

      } catch (e) {
        console.error('Erro ao processar mensagem MQTT:', e);
        addNotification('Erro: Falha ao processar dado recebido.', 'error');
      }
    });

    // Evento de erro de ligação
    client.on('error', (err) => {
      console.error('Erro de conexão MQTT:', err);
      const errorMsg = t('appAlertConnectFail');
      // Evita spam de notificações se o erro persistir
      if (connectionError !== errorMsg) { 
        addNotification(errorMsg, 'error');
        setConnectionError(errorMsg);
      }
      setLoading(false);
    });

    client.on('close', () => {
      console.log('Desconectado do MQTT Broker.');
      // Opcional: Adicionar lógica de notificação ou reconexão
    });

    // Função de limpeza ao desmontar o componente
    return () => {
      if (client) {
        client.end(); // Fecha a ligação
      }
    };
    // Adicionado connectionError para re-tentar a ligação se o erro mudar
  }, [showSponsors, addNotification, t, connectionError]);


  // 4. MODIFICADO: useEffect para Health Check (agora verifica a última mensagem MQTT)
  useEffect(() => {
    if (showSponsors) return;

    // O health-check agora verifica se a última mensagem MQTT é antiga
    const healthCheckIntervalId = setInterval(() => {
      if (lastTimestampRef.current) {
        const secondsDiff = differenceInSeconds(new Date(), lastTimestampRef.current);
        if (secondsDiff > 15) { // Se não recebe dados válidos por mais de 15s
          addNotification(t('appAlertNoDataStreaming', { seconds: secondsDiff }), 'warning');
        }
      } else if (!loading && !connectionError && history.length === 0) {
          // Se não está carregando, não tem erro, mas nunca recebeu nada
          addNotification(t('appAlertWaitingValid'), 'warning');
      }
    }, 15000); // Verifica a cada 15 segundos

    // Limpa os intervalos e timeouts ao desmontar
    return () => {
      clearInterval(healthCheckIntervalId);
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [showSponsors, loading, connectionError, addNotification, history.length, t]);

  const latestData = history.length > 0 ? history[history.length - 1] : null;
  const handleSponsorsFinished = () => { sessionStorage.setItem('splashScreenShown', 'true'); setShowSponsors(false); };

  if (showSponsors) {
    return <SponsorsScreen onFinished={handleSponsorsFinished} />;
  }

  return (
    <div className="app-container">
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
            {/* Passa o 'connectionError' em vez do 'apiError' */}
            <Route path="/" element={<DashboardPage history={history} latestData={latestData} selectedChart={selectedChart} loading={loading && history.length === 0} error={connectionError} />} />
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
