"use client";

import { useState, useEffect } from 'react';

interface AlertData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// Global alert system
let globalAlertCallback: ((alert: AlertData) => void) | null = null;

// Alert Dialog Component
export default function AlertDialog() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  useEffect(() => {
    // Register global callback
    globalAlertCallback = (alert: AlertData) => {
      const newAlert = {
        ...alert,
        id: alert.id || `alert-${Date.now()}-${Math.random()}`,
        duration: alert.duration || 5000
      };

      setAlerts(prev => [...prev, newAlert]);

      // Auto-remove after duration
      if (newAlert.duration > 0) {
        setTimeout(() => {
          removeAlert(newAlert.id);
        }, newAlert.duration);
      }
    };

    // Cleanup
    return () => {
      globalAlertCallback = null;
    };
  }, []);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-2 fade-in duration-300 ${getAlertStyles(alert.type)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <span className="text-lg">{getIcon(alert.type)}</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1">{alert.title}</h4>
              <p className="text-sm">{alert.message}</p>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Global alert functions
export const showAlert = (alert: Omit<AlertData, 'id'>) => {
  if (globalAlertCallback) {
    globalAlertCallback(alert as AlertData);
  } else {
    // Fallback to console if callback not ready
    console.log(`[${alert.type.toUpperCase()}] ${alert.title}: ${alert.message}`);
  }
};

export const showSuccessAlert = (title: string, message: string, duration?: number) => {
  showAlert({ type: 'success', title, message, duration });
};

export const showErrorAlert = (title: string, message: string, duration?: number) => {
  showAlert({ type: 'error', title, message, duration });
};

export const showWarningAlert = (title: string, message: string, duration?: number) => {
  showAlert({ type: 'warning', title, message, duration });
};

export const showInfoAlert = (title: string, message: string, duration?: number) => {
  showAlert({ type: 'info', title, message, duration });
};
