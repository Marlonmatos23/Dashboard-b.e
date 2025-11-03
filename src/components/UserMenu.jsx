import React from 'react';
import { Link } from 'react-router-dom';

// Este é um componente simples de placeholder para o UserMenu.
// Ele NÃO importa um ficheiro CSS próprio, para evitar erros de caminho.
// Os estilos estão no App.css global.
const UserMenu = () => {
  return (
    <div className="user-menu">
      <div className=""></div>
      <p className="username">LaCIS</p>
      <p className="status">Online</p>
      {/* Pode adicionar um link para uma página de perfil, se desejar */}
      {/* <Link to="/perfil">Ver Perfil</Link> */}
    </div>
  );
};

export default UserMenu;
