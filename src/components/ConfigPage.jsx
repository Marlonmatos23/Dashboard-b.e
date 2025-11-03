import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar hook

// Um componente reutilizável para o toggle switch, para um visual moderno
const ToggleSwitch = ({ id, checked, onChange }) => {
  return (
    <label htmlFor={id} className="toggle-switch">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );
};

const ConfigPage = () => {
  // 2. Obter 't' (função de tradução) e 'i18n' (instância)
  const { t, i18n } = useTranslation();

  // Estados para gerir as configurações (valores de exemplo)
  const [settings, setSettings] = useState({
    // language: 'pt-br', // Removido, agora é global
    lowBatteryAlert: true,
    lowBatteryThreshold: 20,
    highMotorTempAlert: true,
    highMotorTempThreshold: 90,
    refreshRate: 5,
  });

  const handleToggleChange = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleValueChange = (key, value) => {
    const numericValue = !isNaN(parseFloat(value)) ? parseFloat(value) : value;
    setSettings(prev => ({ ...prev, [key]: numericValue }));
  };

  // 3. Handler para mudar o idioma globalmente
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  // Função para salvar as configurações
  const saveSettings = () => {
    console.log("Configurações salvas:", settings);
    alert(t('configSaveAlert')); // 4. Traduzir o alerta
  };

  // 5. Detectar idioma atual (simplificado para 'pt' ou 'en')
  const currentLang = i18n.language.startsWith('pt') ? 'pt' : 'en';

  return (
    <div className="config-page-container">
      {/* 6. Traduzir todos os textos estáticos */}
      <h1 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-primary)' }}>{t('configTitle')}</h1>

      {/* Seção de Configurações Gerais */}
      <section className="config-section">
        <h2 className="config-section-title">{t('configGeneral')}</h2>
        <div className="config-option">
          <div className="config-option-label">
            <strong>{t('configLangLabel')}</strong>
            <span>{t('configLangDesc')}</span>
          </div>
          <div className="config-option-control">
            <select
              value={currentLang} // Usar o idioma do i18n
              onChange={handleLanguageChange} // Usar o novo handler
            >
              <option value="pt">Português (Brasil)</option>
              <option value="en">English (US)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Seção de Alertas */}
      <section className="config-section">
        <h2 className="config-section-title">{t('configAlerts')}</h2>
        <div className="config-option">
          <div className="config-option-label">
            <strong>{t('configAlertBattery')}</strong>
            <span>{t('configAlertBatteryDesc')}</span>
          </div>
          <div className="config-option-control" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="number"
              value={settings.lowBatteryThreshold}
              onChange={(e) => handleValueChange('lowBatteryThreshold', e.target.value)}
              style={{ width: '60px' }}
              disabled={!settings.lowBatteryAlert}
            />
            <span>%</span>
            <ToggleSwitch id="low-battery-toggle" checked={settings.lowBatteryAlert} onChange={() => handleToggleChange('lowBatteryAlert')} />
          </div>
        </div>
        <div className="config-option">
          <div className="config-option-label">
            <strong>{t('configAlertMotorTemp')}</strong>
            <span>{t('configAlertMotorTempDesc')}</span>
          </div>
          <div className="config-option-control" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="number"
              value={settings.highMotorTempThreshold}
              onChange={(e) => handleValueChange('highMotorTempThreshold', e.target.value)}
              style={{ width: '60px' }}
              disabled={!settings.highMotorTempAlert}
            />
            <span>°C</span>
            <ToggleSwitch id="high-temp-toggle" checked={settings.highMotorTempAlert} onChange={() => handleToggleChange('highMotorTempAlert')} />
          </div>
        </div>
      </section>

       {/* Seção de Dados */}
       <section className="config-section">
        <h2 className="config-section-title">{t('configData')}</h2>
        <div className="config-option">
          <div className="config-option-label">
            <strong>{t('configRefreshLabel')}</strong>
            <span>{t('configRefreshDesc')}</span>
          </div>
          <div className="config-option-control">
            <select
              value={settings.refreshRate}
              onChange={(e) => handleValueChange('refreshRate', e.target.value)}
            >
              <option value={2}>{t('configRefresh2s')}</option>
              <option value={5}>{t('configRefresh5s')}</option>
              <option value={10}>{t('configRefresh10s')}</option>
              <option value={30}>{t('configRefresh30s')}</option>
            </select>
          </div>
        </div>
      </section>

      <button className="menu-button-base active config-save-btn" onClick={saveSettings}>
        {t('configSave')}
      </button>
    </div>
  );
};

export default ConfigPage;
