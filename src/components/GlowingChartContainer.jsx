import React from 'react';

// Este componente reutilizável adiciona um brilho animado a qualquer conteúdo filho (neste caso, os gráficos).
const GlowingChartContainer = ({ children, colors }) => {

  // Cores padrão caso nenhuma seja fornecida
  const defaultColors = {
    c1: 'var(--accent-primary)',
    c2: 'var(--accent-secondary)',
    c3: '#FFFFFF',
    c4: '#f39c12',
  };
  
  const finalColors = { ...defaultColors, ...colors };

  // Constrói a string do box-shadow dinamicamente
  const dynamicBoxShadow = `
    0.5em 0.5em 2.5em ${finalColors.c1}, 
    -0.5em 0.5em 2.5em ${finalColors.c2}, 
    0.5em -0.5em 2.5em ${finalColors.c3}, 
    -0.5em -0.5em 2.5em ${finalColors.c4}
  `;

  // CSS para a animação de rotação
  const styleSheet = `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  // Estilos inline para os elementos
  const styles = {
    wrapper: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    externalShadow: {
      width: '100%',
      height: '100%',
      borderRadius: '12px', // Usa o mesmo border-radius dos seus painéis
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      boxShadow: dynamicBoxShadow,
      animation: 'rotate 6s linear infinite', // Rotação mais lenta
      backgroundColor: 'var(--bg-panel)', // Cor de fundo do painel
    },
    contentHolder: {
      position: 'absolute',
      width: 'calc(100% - 4px)', // Um pouco menor para criar um efeito de borda
      height: 'calc(100% - 4px)',
      backgroundColor: 'var(--bg-panel)',
      borderRadius: '11px',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '15px',
      boxSizing: 'border-box',
    }
  };

  return (
    <>
      <style>{styleSheet}</style>
      <div style={styles.wrapper}>
        <div style={styles.externalShadow}>
          {/* Este div central não precisa de conteúdo, é apenas para a estrutura */}
        </div>
        <div style={styles.contentHolder}>
          {children} {/* O gráfico será renderizado aqui dentro */}
        </div>
      </div>
    </>
  );
};

export default GlowingChartContainer;
