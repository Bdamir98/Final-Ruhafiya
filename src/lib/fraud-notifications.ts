import { supabaseServer } from './supabase-server';

export interface FraudAlert {
  id: string;
  orderId: number;
  orderNumber: string;
  fraudScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  timestamp: string;
  isRead: boolean;
}

export class FraudNotificationService {
  private static instance: FraudNotificationService;
  private alerts: FraudAlert[] = [];
  private subscribers: ((alerts: FraudAlert[]) => void)[] = [];

  static getInstance(): FraudNotificationService {
    if (!FraudNotificationService.instance) {
      FraudNotificationService.instance = new FraudNotificationService();
    }
    return FraudNotificationService.instance;
  }

  // Add new fraud alert
  async addAlert(orderData: any, fraudResult: any): Promise<void> {
    const alert: FraudAlert = {
      id: `fraud_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      orderId: orderData.id,
      orderNumber: orderData.order_number,
      fraudScore: fraudResult.score,
      riskLevel: fraudResult.riskLevel,
      reasons: fraudResult.reasons,
      customerInfo: {
        name: orderData.full_name,
        phone: orderData.mobile_number,
        address: orderData.full_address
      },
      timestamp: new Date().toISOString(),
      isRead: false
    };

    this.alerts.unshift(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }

    // Store in database
    try {
      await supabaseServer
        .from('fraud_alerts')
        .insert({
          alert_id: alert.id,
          order_id: alert.orderId,
          order_number: alert.orderNumber,
          fraud_score: alert.fraudScore,
          risk_level: alert.riskLevel,
          reasons: alert.reasons.join(', '),
          customer_name: alert.customerInfo.name,
          customer_phone: alert.customerInfo.phone,
          customer_address: alert.customerInfo.address,
          is_read: false,
          created_at: alert.timestamp
        });
    } catch (error) {
      console.error('Failed to store fraud alert:', error);
    }

    // Notify subscribers
    this.notifySubscribers();

    // Send email notification if enabled
    await this.sendEmailNotification(alert);
  }

  // Get all alerts
  getAlerts(): FraudAlert[] {
    return this.alerts;
  }

  // Get unread alerts count
  getUnreadCount(): number {
    return this.alerts.filter(alert => !alert.isRead).length;
  }

  // Mark as read
  markAsRead(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.isRead = true;
      this.notifySubscribers();
      
      // Update in database (fire and forget)
      this.updateAlertInDatabase(alertId);
    }
  }

  // Mark all alerts as read
  markAllAsRead(): void {
    this.alerts.forEach(alert => alert.isRead = true);
    this.notifySubscribers();
    
    // Update in database (fire and forget)
    this.updateAllAlertsInDatabase();
  }

  // Helper method to update single alert
  private async updateAlertInDatabase(alertId: string): Promise<void> {
    try {
      await supabaseServer
        .from('fraud_alerts')
        .update({ is_read: true })
        .eq('alert_id', alertId);
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  }

  // Helper method to update all alerts
  private async updateAllAlertsInDatabase(): Promise<void> {
    try {
      await supabaseServer
        .from('fraud_alerts')
        .update({ is_read: true })
        .neq('alert_id', '');
    } catch (error) {
      console.error('Failed to update alerts:', error);
    }
  }

  // Subscribe to alerts
  subscribe(callback: (alerts: FraudAlert[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // Notify all subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.alerts));
  }

  // Send email notification
  private async sendEmailNotification(alert: FraudAlert): Promise<void> {
    // Email notifications disabled due to removal of settings management.
    return;
  }

  // Load alerts from database on initialization
  async loadAlertsFromDatabase(): Promise<void> {
    try {
      const { data: alerts } = await supabaseServer
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (alerts) {
        this.alerts = alerts.map(alert => ({
          id: alert.alert_id,
          orderId: alert.order_id,
          orderNumber: alert.order_number,
          fraudScore: alert.fraud_score,
          riskLevel: alert.risk_level,
          reasons: alert.reasons.split(', '),
          customerInfo: {
            name: alert.customer_name,
            phone: alert.customer_phone,
            address: alert.customer_address
          },
          timestamp: alert.created_at,
          isRead: alert.is_read
        }));
      }
    } catch (error) {
      console.error('Failed to load fraud alerts:', error);
    }
  }
}

// Export singleton instance
export const fraudNotificationService = FraudNotificationService.getInstance();
