import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { parseISO, differenceInSeconds, isValid } from 'date-fns';
import { useTranslation } from 'react-i18next';
import mqtt from 'mqtt'; // Biblioteca MQTT

// Componentes
import SponsorsScreen from './components/SponsorsScreen';
import DashboardPage from './components/DashboardPage';
import HistoricalPage from './components/HistoricalPage';
import ConfigPage from './components/ConfigPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Notification from './components/Notification';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import './i18n';
import './App.css';

// --- Configuração MQTT ---
const MQTT_BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt'; // broker público com WebSocket seguro
const BOAT_ID = "barco-01";
const MQTT_TOPICS = [
  `boats/${BOAT_ID}/telemetry/live`,
  `boats/${BOAT_ID}/trip/status`,
  `boats/${BOAT_ID}/trip/log`
];
// --------------------------

const AppContent = () => {
  const { t } = useTranslation();
  // 2. Usar o hook de Definições
  const { settings } = useSettings(); 
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); 
  const [selectedChart, setSelectedChart] = useState('all');
  const [showSponsors, setShowSponsors] = useState(() => !sessionStorage.getItem('splashScreenShown'));
  const [notifications, setNotifications] = useState([]);
  const lastTimestampRef = useRef(null);
  const notificationTimeoutRef = useRef(null);
  const mqttClientRef = useRef(null); 

  const addNotification = useCallback((message, type = 'error') => {
    setNotifications(prev => {
      if (prev.some(n => n.message === message)) return prev;
      const newNotification = { id: Date.now(), message, type };
      return [newNotification, ...prev.slice(0, 4)];
    });
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ---- Conexão MQTT ----
  useEffect(() => {
    if (showSponsors) return;

    setLoading(true);
    setConnectionError(null);
    setConnectionStatus('connecting'); 

    const clientId = `electric_boat_${Math.random().toString(16).substring(2, 10)}`;
    
    const connectOptions = {
      clientId,
      clean: true,
      reconnectPeriod: 5000, 
    };

    const client = mqtt.connect(MQTT_BROKER_URL, connectOptions);
    mqttClientRef.current = client; 

    client.on('connect', () => {
      console.log('✅ Conectado ao MQTT Broker');
      setLoading(false);
      setConnectionError(null);
      setConnectionStatus('connected'); 

      client.subscribe(MQTT_TOPICS, (err) => {
        if (err) {
          console.error('Erro ao subscrever aos tópicos:', err);
          const msg = 'Falha ao subscrever aos tópicos MQTT.';
          addNotification(msg, 'error');
          setConnectionError(msg);
        } else {
          console.log(`📡 Subscrito em: ${MQTT_TOPICS.join(', ')}`);
        }
      });
    });

    // ---- Processamento de Mensagens ----
    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (topic === `boats/${BOAT_ID}/telemetry/live`) {
          
          // **** INÍCIO DA CORREÇÃO ****
          // Mapeamento dos dados recebidos (do seu novo JSON) para os nomes que os gráficos usam.
          // Também converte strings (como "80.0") para números.
          const newDataPoint = {
            Timestamp: payload.timestamp || new Date().toISOString(),
            
            // Dados Principais
            Speed_KPH: parseFloat(payload.speedKPH), // Converte "80.0" para 80.0
            Heading: parseFloat(payload.heading),
            Motor_Speed_RPM: parseFloat(payload.rpm),
            Motor_Temp_C: parseFloat(payload.temperature), // Mapeia 'temperature' para 'Motor_Temp_C'
            
            // Coordenadas Aninhadas
            Latitude: payload.coordinates?.lat,
            Longitude: payload.coordinates?.lng,
            
            // Bateria Aninhada
            Volt: parseFloat(payload.battery?.voltage),
            Porcentagem_Bateria: parseFloat(payload.battery?.percentage), 
            
            // Dados Faltantes (serão 'undefined', o que é OK para os gráficos)
            Ctrl_Temp_C: parseFloat(payload.controlTemp), // (Este não estava no seu JSON de exemplo)
            Current: parseFloat(payload.current),         // (Este não estava no seu JSON de exemplo)
            Autonomia: parseFloat(payload.autonomia),     // (Este não estava no seu JSON de exemplo)
            Capacidade_Restante: parseFloat(payload.capacidade), // (Este não estava no seu JSON de exemplo)
            
            // Dados que ainda não estão a ser usados (mas que vieram no JSON)
            // windSpeed: parseFloat(payload.windSpeed), 
            // courseToSteer: parseFloat(payload.courseToSteer),
          };
          // **** FIM DA CORREÇÃO ****


          // 3. LÓGICA DE ALERTA FUNCIONAL
          // Verifica Alerta de Bateria
          if (settings.lowBatteryAlert && 
              newDataPoint.Porcentagem_Bateria != null && 
              newDataPoint.Porcentagem_Bateria < settings.lowBatteryThreshold) {
            
            const msg = t('alertBatteryLowMessage', { 
              value: newDataPoint.Porcentagem_Bateria.toFixed(0), 
              limit: settings.lowBatteryThreshold 
            });
            addNotification(msg, 'warning'); // addNotification já evita duplicados
          }

          // Verifica Alerta de Temperatura do Motor
          if (settings.highMotorTempAlert && 
              newDataPoint.Motor_Temp_C != null && 
              newDataPoint.Motor_Temp_C > settings.highMotorTempThreshold) {
            
            const msg = t('alertMotorTempHighMessage', { 
              value: newDataPoint.Motor_Temp_C.toFixed(0), 
              limit: settings.highMotorTempThreshold 
            });
            addNotification(msg, 'warning');
          }

          // Adiciona ao histórico
          setHistory(prev => [...prev, newDataPoint].slice(-100)); 

          // Atualiza o timestamp
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
        
        else if (topic === `boats/${BOAT_ID}/trip/status`) {
          addNotification(`${t('appTripStatus')}: ${payload}`, 'info');
        } 
        
        else if (topic === `boats/${BOAT_ID}/trip/log`) {
          console.log('📘 Log recebido:', payload);
          addNotification(t('appTripLogReceived'), 'info');
        }
      } catch (e) {
        console.error('Erro ao processar mensagem MQTT:', e);
        addNotification('Erro ao processar dado recebido.', 'error');
      }
    });

    client.on('error', (err) => {
      console.error('❌ Erro MQTT:', err);
      const msg = t('appAlertConnectFail');
      if (connectionError !== msg) {
        addNotification(msg, 'error');
        setConnectionError(msg);
      }
      setConnectionStatus('disconnected'); 
      setLoading(false);
    });

    client.on('close', () => {
      console.warn('⚠️ Desconectado do MQTT Broker');
      setConnectionStatus('disconnected'); 
    });

    return () => {
      if (mqttClientRef.current) {
        mqttClientRef.current.end(true); 
        mqttClientRef.current = null;
      }
    };
  }, [showSponsors, t, addNotification, connectionError, settings]); // 4. Adicionar 'settings' às dependências

  // ---- Health Check (Verificação de Saúde dos Dados) ----
  useEffect(() => {
    if (showSponsors) return;
    
    const interval = setInterval(() => {
      if (lastTimestampRef.current) {
        const diff = differenceInSeconds(new Date(), lastTimestampRef.current);
        if (diff > 15) {
          addNotification(t('appAlertNoDataStreaming', { seconds: diff }), 'warning');
        }
      } else if (!loading && !connectionError && history.length === 0) {
        addNotification(t('appAlertWaitingValid'), 'warning');
      }
    }, 15000); 

    return () => clearInterval(interval);
  }, [showSponsors, loading, connectionError, history.length, addNotification, t]);

  const latestData = history.at(-1) || null;

  const handleSponsorsFinished = () => {
    sessionStorage.setItem('splashScreenShown', 'true');
    setShowSponsors(false);
  };

  if (showSponsors) {
    return <SponsorsScreen onFinished={handleSponsorsFinished} />;
  }

  // ---- Renderização da Aplicação ----
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

      <Header connectionStatus={connectionStatus} />
      <Sidebar selectedChart={selectedChart} onSelectChart={setSelectedChart} />

      <main className="content">
        <div className="main-view-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardPage
                  history={history}
                  latestData={latestData}
                  selectedChart={selectedChart}
                  loading={loading && history.length === 0}
                  error={connectionError}
                />
              }
            />
            <Route path="/historico" element={<HistoricalPage />} />
            {/* 5. Passar 'addNotification' para a ConfigPage */}
            <Route path="/configuracao" element={<ConfigPage addNotification={addNotification} />} />
          </Routes>
        </div>
        <Footer />
      </main>
    </div>
  );
};

// 6. Envolver o AppContent com o SettingsProvider
const App = () => (
  <BrowserRouter>
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  </BrowserRouter>
);

export default App;
