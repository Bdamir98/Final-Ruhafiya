"use client";
import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, X } from 'lucide-react';

interface FraudAlert {
  id: string;
  orderNumber: string;
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  customerName: string;
  timestamp: string;
  isRead: boolean;
}

export default function FraudAlertBadge() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchAlerts();
    // Poll for new alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/fake-orders?timeframe=24h&status=flagged');
      const data = await response.json();
      
      if (data.orders) {
        const fraudAlerts: FraudAlert[] = data.orders
          .filter((order: any) => order.fraud_score >= 50)
          .slice(0, 10)
          .map((order: any) => ({
            id: order.id.toString(),
            orderNumber: order.order_number,
            fraudScore: order.fraud_score,
            riskLevel: order.risk_level,
            customerName: order.full_name,
            timestamp: order.created_at,
            isRead: false
          }));
        
        setAlerts(fraudAlerts);
        setUnreadCount(fraudAlerts.length);
      }
    } catch (error) {
      console.error('Failed to fetch fraud alerts:', error);
    }
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Fraud Alerts</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No fraud alerts
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !alert.isRead ? 'bg-red-50' : ''
                  }`}
                  onClick={() => markAsRead(alert.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="font-medium text-sm text-gray-900">
                          Order {alert.orderNumber}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(alert.riskLevel)}`}>
                          {alert.fraudScore}/100
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.customerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {alerts.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  // Navigate to fraud section - you can implement this
                  window.location.hash = '#fraud';
                }}
                className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Fraud Alerts
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
