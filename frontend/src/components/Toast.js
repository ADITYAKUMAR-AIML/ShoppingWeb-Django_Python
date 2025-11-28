import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <span>{message}</span>
      <button type="button" aria-label="Close notification" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Toast;

