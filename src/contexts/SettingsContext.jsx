import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Definir as definições padrão
const defaultSettings = {
  language: 'pt', // Embora o i18n controle isto, podemos guardar a preferência
  lowBatteryAlert: true,
  lowBatteryThreshold: 20,
  highMotorTempAlert: true,
  highMotorTempThreshold: 90,
  refreshRate: 5, // (Iremos desativar isto na UI, mas mantemos o valor)
};

// 2. Criar o Contexto
const SettingsContext = createContext({
  settings: defaultSettings,
  updateSetting: (key, value) => {},
});

// 3. Criar o "Provider" (o gestor do estado)
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Tenta carregar as definições salvas do localStorage
    try {
      const savedSettings = localStorage.getItem('dashboardSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    } catch (e) {
      console.error("Falha ao carregar definições do localStorage", e);
      return defaultSettings;
    }
  });

  // Salva no localStorage sempre que as definições mudam
  useEffect(() => {
    try {
      localStorage.setItem('dashboardSettings', JSON.stringify(settings));
    } catch (e) {
      console.error("Falha ao salvar definições no localStorage", e);
    }
  }, [settings]);

  // Função para atualizar uma definição específica
  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 4. Criar um hook customizado para facilitar o uso
export const useSettings = () => useContext(SettingsContext);
