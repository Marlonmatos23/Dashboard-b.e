import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar

// --- Função para obter cores dinâmicas com base na percentagem ---
const getBatteryColors = (percentage) => {
  // ... (lógica existente) ...
  if (percentage == null) {
    return { c1: 'var(--text-secondary)', c2: 'var(--text-secondary)', c3: 'var(--text-secondary)', c4: 'var(--text-secondary)' };
  }
  if (percentage > 70) {
    return { c1: 'var(--accent-primary)', c2: '#2ecc71', c3: '#FFFFFF', c4: 'var(--accent-secondary)' };
  }
  if (percentage > 30) {
    return { c1: '#f1c40f', c2: '#e67e22', c3: '#f39c12', c4: '#FFFFFF' };
  }
  return { c1: '#e74c3c', c2: '#c0392b', c3: '#f39c12', c4: '#e67e22' };
};

// 2. Aceitar 'title' como prop (ou usar hook t)
const BatteryPercentage = ({ percentage, loading, title }) => {
  const { t } = useTranslation(); // 3. Inicializar
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    // ... (lógica de animação existente) ...
    if (percentage == null) {
      setDisplayPercentage(0);
      return;
    }
    const targetPercentage = Math.round(percentage);
    if (Math.abs(targetPercentage - displayPercentage) < 2) {
      setDisplayPercentage(targetPercentage);
      return;
    }
    const interval = setInterval(() => {
      setDisplayPercentage(prev => {
        if (prev < targetPercentage) {
          return prev + 1;
        }
        if (prev > targetPercentage) {
          return prev - 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 20); 
    return () => clearInterval(interval);
  }, [percentage]); 

  const colors = getBatteryColors(loading ? null : percentage);
  
  const dynamicBoxShadow = `
    0.5em 0.5em 3em ${colors.c1}, 
    -0.5em 0.5em 3em ${colors.c2}, 
    0.5em -0.5em 3em ${colors.c3}, 
    -0.5em -0.5em 3em ${colors.c4}
  `;

  // ... (stylesheet e styles existentes) ...
  const styleSheet = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .loader-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      gap: 10px;
    }
  `;

  const styles = {
    title: { fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', margin: 0 },
    loader: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', scale: '0.8' },
    externalShadow: {
      width: '10em', height: '10em', borderRadius: '50%', display: 'flex',
      justifyContent: 'center', alignItems: 'center', position: 'relative',
      boxShadow: dynamicBoxShadow, animation: 'rotate 4s linear infinite', backgroundColor: '#212121',
    },
    central: {
      width: '10em', height: '10em', borderRadius: '50%',
      boxShadow: `inset 0.2em 0.2em 0.5em ${colors.c1}, inset -0.2em -0.2em 0.5em ${colors.c3}`,
    },
    intern: {
      position: 'absolute', color: 'white', zIndex: 1,
      fontSize: '2.5em', fontWeight: 'bold', textShadow: `0 0 10px ${colors.c1}`,
    }
  };


  if (loading && percentage == null) {
    return <div className="content-placeholder">{t('statusLoading')}</div>; // 4. Traduzir
  }

  return (
    <>
      <style>{styleSheet}</style>
      <div className="loader-container">
        {/* 5. Usar prop 'title' ou 't' */}
        <h3 style={styles.title}>{title || t('chartTitleBatteryPercent')}</h3>
        <div style={styles.loader}>
          <div style={styles.intern}>
            {percentage != null ? `${displayPercentage}%` : 'N/A'}
          </div>
          <div style={styles.externalShadow}>
            <div style={styles.central}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BatteryPercentage;
