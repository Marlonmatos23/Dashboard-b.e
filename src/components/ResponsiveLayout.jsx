import React from 'react';
import './ResponsiveLayout.css';

const ResponsiveLayout = () => {
  return (
    <div className="responsive-container">
      <header className="header">Cabeçalho</header>
      <div className="main-content">
        <nav className="sidebar">Menu Lateral</nav>
        <div className="content">Conteúdo Principal</div>
      </div>
      <footer className="footer">Rodapé</footer>
    </div>
  );
};

export default ResponsiveLayout;
