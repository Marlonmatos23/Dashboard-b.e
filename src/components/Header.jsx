// src/components/Header.jsx
import React from 'react'
import Clock from './Clock'
import './Header.css'
import { useTranslation } from 'react-i18next' // 1. Importar

const Header = () => {
  const { t } = useTranslation() // 2. Inicializar

  return (
    <header className="header">
      <div className="header-left">
        <Clock type="date" />
      </div>
      <div className="header-center">
        {t('headerTitle')} {/* 3. Usar o 't' */}
      </div>
      <div className="header-right">
        <Clock type="time" />
      </div>
    </header>
  )
}

export default Header
