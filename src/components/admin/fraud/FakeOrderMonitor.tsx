"use client";
import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  Eye, 
  TrendingUp,
  Users,
  Clock,
  Filter,
  Search,
  Download,
  RefreshCw,
  Flag,
  X,
  UserCheck,
  UserX,
  BarChart3
} from 'lucide-react';
import FraudDashboard from './FraudDashboard';
import BlockedEntitiesManager from './BlockedEntitiesManager';

interface Order {
  id: number;
  order_number: string;
  full_name: string;
  mobile_number: string;
  full_address: string;
  total_amount: number;
  fraud_score: number;
  fraud_reasons: string;
  is_flagged: boolean;
  status: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  ip_address: string;
  created_at: string;
}

interface Statistics {
  total: number;
  flagged: number;
  highRisk: number;
  blocked: number;
  fraudRate: string;
}

interface FraudSettings {
  detection: {
    enabled: boolean;
    autoBlock: boolean;
    scoreThreshold: number;
    duplicateOrderWindow: number;
    maxOrdersPerHour: number;
    maxOrdersPerDay: number;
  };
  rules: {
    duplicatePhone: { enabled: boolean; weight: number };
    duplicateAddress: { enabled: boolean; weight: number };
    rapidOrders: { enabled: boolean; weight: number };
    suspiciousPatterns: { enabled: boolean; weight: number };
    invalidPhone: { enabled: boolean; weight: number };
    vpnDetection: { enabled: boolean; weight: number };
    deviceFingerprint: { enabled: boolean; weight: number };
  };
  notifications: {
    emailAlerts: boolean;
    adminEmail: string;
    slackWebhook: string;
    realTimeAlerts: boolean;
  };
  whitelist: {
    trustedPhones: string[];
    trustedIPs: string[];
    trustedDevices: string[];
  };
  blacklist: {
    blockedPhones: string[];
    blockedIPs: string[];
    blockedKeywords: string[];
  };
}

export default function FakeOrderMonitor() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    flagged: 0,
    highRisk: 0,
    blocked: 0,
    fraudRate: '0'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monitor' | 'blocked'>('dashboard');
  const [timeframe, setTimeframe] = useState('24h');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeframe, statusFilter]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/admin/fake-orders?timeframe=${timeframe}&status=${statusFilter}`);
      const data = await response.json();
      setOrders(data.orders || []);
      setStatistics(data.statistics || statistics);
    } catch (error) {
      console.error('Failed to fetch fraud data:', error);
    } finally {
      setLoading(false);
    }
  };

  

  const handleOrderAction = async (orderId: number, action: string, reason?: string) => {
    try {
      await fetch('/api/admin/fake-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, orderId, reason })
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const getRiskColor = (riskLevel: string, score: number) => {
    if (riskLevel === 'critical' || score >= 80) return 'text-red-600 bg-red-50';
    if (riskLevel === 'high' || score >= 60) return 'text-orange-600 bg-orange-50';
    if (riskLevel === 'medium' || score >= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.order_number.toLowerCase().includes(searchLower) ||
        order.full_name.toLowerCase().includes(searchLower) ||
        order.mobile_number.includes(searchTerm)
      );
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            <div>
              <h1 className="text-2xl font-bold">Fake Order Detection</h1>
              <p className="text-red-100 mt-1">Monitor and control fraudulent orders with advanced detection</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="flex items-center px-4 py-2 bg-red-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Flag className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.flagged}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.highRisk}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Ban className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.blocked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fraud Rate</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.fraudRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('monitor')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monitor'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Order Monitor
            </button>
            <button
              onClick={() => setActiveTab('blocked')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'blocked'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserX className="w-4 h-4 inline mr-2" />
              Blocked Entities
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <FraudDashboard />
          </div>
        )}

        {/* Blocked Entities Tab */}
        {activeTab === 'blocked' && (
          <div className="p-6">
            <BlockedEntitiesManager />
          </div>
        )}

        {/* Monitor Tab */}
        {activeTab === 'monitor' && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-gray-400 mr-2" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Orders</option>
                    <option value="flagged">Flagged Only</option>
                    <option value="high_risk">High Risk</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.order_number}
                          </div>
                          <div className="text-sm text-gray-500">
                            ৳{order.total_amount} • {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.mobile_number}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(order.risk_level, order.fraud_score)}`}>
                            {order.fraud_score}/100
                          </span>
                          {order.is_flagged && (
                            <Flag className="w-4 h-4 text-red-500 ml-2" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'blocked' ? 'bg-red-100 text-red-800' :
                          order.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!order.is_flagged ? (
                          <button
                            onClick={() => handleOrderAction(order.id, 'flag', 'Manual flag')}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOrderAction(order.id, 'unflag')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOrderAction(order.id, 'block', 'Manual block')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOrderAction(order.id, 'whitelist')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <UserCheck className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Order Number</label>
                  <p className="text-sm text-gray-900">{selectedOrder.order_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Risk Score</label>
                  <p className={`text-sm font-semibold ${getRiskColor(selectedOrder.risk_level, selectedOrder.fraud_score)}`}>
                    {selectedOrder.fraud_score}/100 ({selectedOrder.risk_level})
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Customer Name</label>
                  <p className="text-sm text-gray-900">{selectedOrder.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone Number</label>
                  <p className="text-sm text-gray-900">{selectedOrder.mobile_number}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-sm text-gray-900">{selectedOrder.full_address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">IP Address</label>
                  <p className="text-sm text-gray-900">{selectedOrder.ip_address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Amount</label>
                  <p className="text-sm text-gray-900">৳{selectedOrder.total_amount}</p>
                </div>
              </div>
              
              {selectedOrder.fraud_reasons && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Fraud Reasons</label>
                  <div className="mt-2 p-3 bg-red-50 rounded border">
                    <p className="text-sm text-red-800">{selectedOrder.fraud_reasons}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    handleOrderAction(selectedOrder.id, 'whitelist');
                    setShowOrderDetails(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Whitelist
                </button>
                <button
                  onClick={() => {
                    handleOrderAction(selectedOrder.id, 'block', 'Manual review block');
                    setShowOrderDetails(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Block Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
