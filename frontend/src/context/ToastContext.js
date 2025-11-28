import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: '',
    type: 'success',
    visible: false,
  });
  const timeoutRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    setToast({ message, type, visible: true });
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, duration);
  }, [hideToast]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

