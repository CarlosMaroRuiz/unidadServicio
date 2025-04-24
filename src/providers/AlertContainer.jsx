// AlertContainer.jsx
import React, { useState, useCallback } from 'react';
import Alert from '../components/Alert';

// Crear un contexto para las alertas
import { createContext, useContext } from 'react';

const AlertContext = createContext(null);

// Generador de ID único
const generateId = () => `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Provider para alertas
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Añadir una nueva alerta
  const addAlert = useCallback((alertData) => {
    const id = generateId();
    
    setAlerts(prevAlerts => [
      ...prevAlerts,
      {
        id,
        type: 'info',
        autoClose: true,
        autoCloseTime: 5000,
        ...alertData
      }
    ]);
    
    return id;
  }, []);

  // Cerrar una alerta por ID
  const closeAlert = useCallback((id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  }, []);

  // Funciones de conveniencia para diferentes tipos de alertas
  const showSuccess = useCallback((message, options = {}) => {
    return addAlert({ type: 'success', message, ...options });
  }, [addAlert]);

  const showError = useCallback((message, options = {}) => {
    return addAlert({ type: 'error', message, ...options });
  }, [addAlert]);

  const showInfo = useCallback((message, options = {}) => {
    return addAlert({ type: 'info', message, ...options });
  }, [addAlert]);

  const showWarning = useCallback((message, options = {}) => {
    return addAlert({ type: 'warning', message, ...options });
  }, [addAlert]);

  const value = {
    alerts,
    addAlert,
    closeAlert,
    showSuccess,
    showError,
    showInfo,
    showWarning
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {/* Contenedor de alertas */}
      <div className="fixed top-0 right-0 p-4 z-50 space-y-4">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            show={true}
            type={alert.type}
            title={alert.title}
            message={alert.message}
            actionLabel={alert.actionLabel || ''}
            autoClose={alert.autoClose ?? true}
            autoCloseTime={alert.autoCloseTime ?? 5000}
            onClose={() => closeAlert(alert.id)}
            onAction={alert.onAction ? () => alert.onAction() : undefined}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};

// Hook personalizado para usar alertas
export const useAlerts = () => {
  const context = useContext(AlertContext);
  
  if (!context) {
    throw new Error('useAlerts debe usarse dentro de un AlertProvider');
  }
  
  return context;
};