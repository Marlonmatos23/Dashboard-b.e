import React, { Suspense } from 'react' // 1. Importar Suspense
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'
import './i18n'
import { useTranslation } from 'react-i18next'

// Componente wrapper para usar o hook t() no fallback
const LoadingFallback = () => {
  const { t } = useTranslation();
  return <div>{t('appLoading')}</div>;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. Envolver o App em Suspense */}
    <Suspense fallback={<LoadingFallback />}>
      <App />
    </Suspense>
  </React.StrictMode>
)
