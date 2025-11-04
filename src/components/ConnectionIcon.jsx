import React from 'react';
import './ConnectionIcon.css'; // Estilos para o ícone

const ConnectionIcon = ({ status }) => {
  let iconClass = "connection-icon";
  let titleText = ""; // Texto para acessibilidade (tooltip)

  // Determinar a classe CSS e o texto com base no status
  if (status === 'connected') {
    iconClass += " connected";
    titleText = "Conectado ao MQTT Broker";
  } else if (status === 'connecting') {
    iconClass += " connecting";
    titleText = "Conectando ao MQTT Broker...";
  } else { // 'disconnected'
    iconClass += " disconnected";
    titleText = "Desconectado do MQTT Broker";
  }

  return (
    <div className={iconClass} title={titleText}>
      {/* Ícone de tomada/plug (adaptado do seu anexo, mas com SVG para melhor escalabilidade) */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Plug (parte com o "dente") */}
        <path
          className="plug"
          d="M10 18V21C10 21.5523 10.4477 22 11 22H13C13.5523 22 14 21.5523 14 21V18"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Fio do plug */}
        <path
          className="plug-cable"
          d="M12 18V2"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Raio no plug */}
        <path
          className="lightning"
          d="M11 9L13 9L12 12L11 9Z"
          fill="currentColor"
        />
        {/* Tomada (a parte "fêmea" no alto) */}
        <path
          className="socket"
          d="M14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4C13.1046 4 14 4.89543 14 6Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="socket"
          d="M17 6C17 7.10457 16.1046 8 15 8C13.8954 8 13 7.10457 13 6C13 4.89543 13.8954 4 15 4C16.1046 4 17 4.89543 17 6Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default ConnectionIcon;
