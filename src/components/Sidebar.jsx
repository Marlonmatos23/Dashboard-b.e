import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import UserMenu from './UserMenu';

const Sidebar = ({ selectedChart, onSelectChart }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const chartButtons = [
    { id: 'all', label: 'Todos os Gráficos' }, { id: 'battery', label: 'Status da Bateria' },
    { id: 'speed', label: 'Velocidade (KPH)' }, { id: 'motorSpeed', label: 'Motor (RPM)' },
    { id: 'motorTemp', label: 'Temp. do Motor' }, { id: 'controlTemp', label: 'Temp. do Controle' },
    { id: 'waves', label: 'Corrente' }, { id: 'autonomia', label: 'Autonomia' },
    { id: 'capacidade', label: 'Capacidade Restante' }, { id: 'windSpeed', label: 'Velocidade do Vento' },
    { id: 'navigation', label: 'Navegação' },
  ];
  return (
    <aside className="menu-container">
      <UserMenu />
      <hr style={{borderColor: 'var(--border-color)', margin: '15px 0'}}/>
      <Link to="/" className={`menu-button-base ${isHomePage ? 'active' : ''}`}>Dashboard</Link>
      <Link to="/historico" className={`menu-button-base ${location.pathname === '/historico' ? 'active' : ''}`}>Histórico</Link>
      <Link to="/configuracao" className={`menu-button-base ${location.pathname === '/configuracao' ? 'active' : ''}`}>Configuração</Link>
      {isHomePage && (
        <>
          <hr style={{borderColor: 'var(--border-color)', margin: '15px 0'}}/>
          <h4 style={{color: 'var(--text-secondary)', paddingLeft: '15px', marginBottom: '5px'}}>Visualizações</h4>
          {chartButtons.map(button => (
            <button key={button.id} className={`menu-button-base ${selectedChart === button.id ? 'active' : ''}`} onClick={() => onSelectChart(button.id)}>
              {button.label}
            </button>
          ))}
        </>
      )}
    </aside>
  );
};
export default Sidebar;
