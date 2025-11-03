import React from 'react';
import { useTranslation } from 'react-i18next'; // 1. Importar

// Importe os seus logótipos locais
import logoAneel from '../assets/logos/aneel.png';
import logoUfpa from '../assets/logos/ufpa.png';
import logoFadesp from '../assets/logos/fadesp.png';
import logoWeg from '../assets/logos/weg.png';
import logoGhport from '../assets/logos/ghport.png';
import logoGtnav from '../assets/logos/gtnav.png';
import logoCemazon from '../assets/logos/ceamazon.png';

// Array com os dados dos patrocinadores para facilitar a renderização
const sponsors = [
  { name: 'ANEEL', logo: logoAneel },
  { name: 'UFPA', logo: logoUfpa },
  { name: 'FADESP', logo: logoFadesp },
  { name: 'WEG', logo: logoWeg },
  { name: 'GH Port', logo: logoGhport },
  { name: 'GTNAV', logo: logoGtnav },
  { name: 'CEMAZON', logo: logoCemazon },
];

const Footer = () => {
  const { t } = useTranslation(); // 2. Inicializar

  return (
    <footer className="footer-container">
      <div className="footer-content">
        <span className="footer-title">{t('footerSupport')}</span> {/* 3. Usar 't' */}
        <div className="footer-logos">
          {sponsors.map(sponsor => (
            <img 
              key={sponsor.name} 
              src={sponsor.logo} 
              alt={`Logótipo ${sponsor.name}`} 
              className="footer-logo-img"
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
