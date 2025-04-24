// Alert.jsx
import React, { useEffect } from 'react';

const Alert = ({ 
  show, 
  type = 'info', 
  title, 
  message, 
  actionLabel = '', 
  autoClose = true, 
  autoCloseTime = 5000, 
  onClose, 
  onAction 
}) => {
  // Determinar estilos según el tipo de alerta
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          iconPath: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
        };
      default: // info
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  };

  const styles = getAlertStyles();

  // Auto cerrar la alerta después del tiempo especificado
  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, autoCloseTime, onClose]);

  if (!show) return null;

  // Obtener el color del botón de acción
  const getActionButtonColor = () => {
    switch (type) {
      case 'success': return 'bg-green-500 hover:bg-green-600';
      case 'error': return 'bg-red-500 hover:bg-red-600';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div
      className={`fixed z-50 max-w-md w-full shadow-lg rounded-lg border overflow-hidden transition-all duration-300 ${styles.bgColor} ${styles.borderColor}`}
      style={{
        animation: 'slideInDown 0.3s ease-out forwards',
        right: '1rem',
        top: '1rem'
      }}
    >
      <div className="p-4 flex items-start">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.iconColor}`}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={styles.iconPath} 
            />
          </svg>
        </div>
        
        {/* Content */}
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium text-gray-800">{title}</h3>}
          <div className="text-sm text-gray-600">{message}</div>
          
          {/* Action button if provided */}
          {actionLabel && (
            <button
              className={`mt-2 px-4 py-1 text-sm text-white rounded-md ${getActionButtonColor()}`}
              onClick={onAction}
            >
              {actionLabel}
            </button>
          )}
        </div>
        
        {/* Close button */}
        <button
          type="button"
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={onClose}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Alert;