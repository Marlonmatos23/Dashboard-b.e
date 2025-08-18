import React from 'react';

// Estilos para o componente, podem ser movidos para um ficheiro CSS se preferir
const styles = {
  wrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: '20px',
    padding: '10px',
  },
  compassSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  compass: {
    position: 'relative',
    width: '120px',
    height: '120px',
  },
  compassRose: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '2px solid var(--border-color)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  needle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '4px',
    height: '50px',
    backgroundColor: 'var(--accent-primary)',
    transformOrigin: 'bottom center',
    borderRadius: '4px 4px 0 0',
    boxShadow: '0 0 10px var(--accent-primary)',
    transition: 'transform 0.5s ease-in-out',
  },
  headingValue: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
  },
  divider: {
    width: '1px',
    height: '80%',
    backgroundColor: 'var(--border-color)',
  },
  modeSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
  },
  modeTitle: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    margin: 0,
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  modeValue: {
    fontSize: '3rem',
    fontWeight: 'bold',
    lineHeight: 1,
  },
  modeDescription: {
    fontSize: '1rem',
    color: 'var(--text-primary)',
    margin: 0,
  }
};

const Compass = ({ heading, speedMode, loading }) => {
  // Define a cor e a descrição com base no modo de velocidade
  const getModeDetails = (mode) => {
    switch (mode) {
      case 'S':
        return { description: 'Sport', color: '#e74c3c' }; // Vermelho para Sport
      case 'E':
        return { description: 'Eco', color: '#2ecc71' }; // Verde para Eco
      default:
        return { description: 'Normal', color: 'var(--accent-primary)' };
    }
  };

  const modeDetails = getModeDetails(speedMode);

  if (loading) {
    return <div className="content-placeholder">A carregar Navegação...</div>;
  }

  return (
    <div style={styles.wrapper}>
      {/* Secção da Bússola */}
      <div style={styles.compassSection}>
        <div style={styles.compass}>
          <div style={styles.compassRose}></div>
          <div style={{...styles.needle, transform: `translate(-50%, -100%) rotate(${heading}deg)`}}></div>
          <div style={styles.headingValue}>{heading}°</div>
        </div>
      </div>

      {/* Divisor Vertical */}
      <div style={styles.divider}></div>

      {/* Secção do Modo de Operação */}
      <div style={styles.modeSection}>
        <span style={styles.modeTitle}>Modo</span>
        <span style={{...styles.modeValue, color: modeDetails.color}}>
          {speedMode || 'N/A'}
        </span>
        <span style={styles.modeDescription}>{modeDetails.description}</span>
      </div>
    </div>
  );
};

export default Compass;
