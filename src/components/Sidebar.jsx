import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';
import { useTranslation } from 'react-i18next'; // 1. Importar

const Sidebar = ({ selectedChart, onSelectChart }) => {
  const { t } = useTranslation(); // 2. Inicializar
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // 3. Mapear botões para chaves de tradução
  const chartButtons = [
    { id: 'all', labelKey: 'sidebarChartAll' }, 
    { id: 'battery', labelKey: 'sidebarChartBattery' },
    { id: 'speed', labelKey: 'sidebarChartSpeed' }, 
    { id: 'motorSpeed', labelKey: 'sidebarChartMotorRPM' },
    { id: 'motorTemp', labelKey: 'sidebarChartMotorTemp' }, 
    { id: 'controlTemp', labelKey: 'sidebarChartControlTemp' },
    { id: 'waves', labelKey: 'sidebarChartCurrent' }, 
    { id: 'autonomia', labelKey: 'sidebarChartAutonomy' },
    { id: 'capacidade', labelKey: 'sidebarChartCapacity' }, 
    { id: 'windSpeed', labelKey: 'sidebarChartWind' },
    { id: 'navigation', labelKey: 'sidebarChartNav' },
  ];

  return (
    <aside className="menu-container">
      <UserMenu />
      <hr style={{borderColor: 'var(--border-color)', margin: '15px 0'}}/>
      {/* 4. Usar 't' para os links principais */}
      <Link to="/" className={`menu-button-base ${isHomePage ? 'active' : ''}`}>{t('sidebarDashboard')}</Link>
      <Link to="/historico" className={`menu-button-base ${location.pathname === '/historico' ? 'active' : ''}`}>{t('sidebarHistory')}</Link>
      <Link to="/configuracao" className={`menu-button-base ${location.pathname === '/configuracao' ? 'active' : ''}`}>{t('sidebarConfig')}</Link>
      {isHomePage && (
        <>
          <hr style={{borderColor: 'var(--border-color)', margin: '15px 0'}}/>
          <h4 style={{color: 'var(--text-secondary)', paddingLeft: '15px', marginBottom: '5px'}}>{t('sidebarViewTitle')}</h4>
          {/* 5. Usar 't' para os botões de gráfico */}
          {chartButtons.map(button => (
            <button key={button.id} className={`menu-button-base ${selectedChart === button.id ? 'active' : ''}`} onClick={() => onSelectChart(button.id)}>
              {t(button.labelKey)}
            </button>
          ))}
        </>
      )}
    </aside>
  );
};
export default Sidebar;
