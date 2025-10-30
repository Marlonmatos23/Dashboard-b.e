import React from 'react';

const Notification = ({ id, message, type = 'error', onClose }) => {
  // Fecha a notificação após 5 segundos
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`notification-item ${type}`}>
      <span className="notification-message">{message}</span>
      <button className="notification-close-btn" onClick={() => onClose(id)}>
        &times; {/* Símbolo de 'X' para fechar */}
      </button>
    </div>
  );
};

export default Notification;
