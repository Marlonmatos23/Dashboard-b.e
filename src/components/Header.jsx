import React from 'react';
import Clock from './Clock';
import './Header.css';
import { useTranslation } from 'react-i18next'; 
import ConnectionIcon from './ConnectionIcon'; // Importar o novo componente de ícone

const Header = ({ connectionStatus }) => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header-left">
        <Clock type="date" />
      </div>
      <div className="header-center">
        {t('headerTitle')}
        {/* Usar o novo componente ConnectionIcon */}
        <ConnectionIcon status={connectionStatus} /> 
      </div>
      <div className="header-right">
        <Clock type="time" />
      </div>
    </header>
  );
};

export default Header;
