"use client";
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  ResponsiveContainer, ComposedChart
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, 
  Package, Calendar, Download, RefreshCw, Eye,
  MapPin, Clock, Star, Target
} from 'lucide-react';
import TrendsAnalytics from './TrendsAnalytics';
import ProductAnalytics from './ProductAnalytics';
import CustomerAnalytics from './CustomerAnalytics';
import GeographyAnalytics from './GeographyAnalytics';
import PerformanceAnalytics from './PerformanceAnalytics';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    totalProducts: number;
    totalCustomers: number;
    revenueGrowth: number;
    orderGrowth: number;
    conversionRate: number;
  };
  trends: Array<{
    date: string;
    orders: number;
    revenue: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  }>;
  products: Array<{
    name: string;
    orders: number;
    quantity: number;
    revenue: number;
    avgOrderValue: number;
  }>;
  customers: Array<{
    id: number;
    name: string;
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate: number | null;
  }>;
  geography: Array<{
    city: string;
    orders: number;
    revenue: number;
  }>;
  performance: {
    statusDistribution: Record<string, number>;
    avgFulfillmentTime: number;
    orderFulfillmentRate: number;
    returnRate: number;
    customerSatisfaction: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: dateRange.start,
        endDate: dateRange.end,
        metric: selectedMetric
      });
      
      const response = await fetch(`/api/admin/analytics?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, selectedMetric]);

  const exportData = (type: string) => {
    if (!analyticsData) return;
    
    let csvContent = '';
    let filename = '';
    
    switch (type) {
      case 'trends':
        csvContent = 'Date,Orders,Revenue,Pending,Confirmed,Shipped,Delivered,Cancelled\n' +
          analyticsData.trends.map(t => 
            `${t.date},${t.orders},${t.revenue},${t.pending},${t.confirmed},${t.shipped},${t.delivered},${t.cancelled}`
          ).join('\n');
        filename = 'analytics-trends.csv';
        break;
      case 'products':
        csvContent = 'Product,Orders,Quantity,Revenue,Avg Order Value\n' +
          analyticsData.products.map(p => 
            `"${p.name}",${p.orders},${p.quantity},${p.revenue},${p.avgOrderValue.toFixed(2)}`
          ).join('\n');
        filename = 'product-performance.csv';
        break;
      case 'customers':
        csvContent = 'Customer,Total Orders,Total Spent,Avg Order Value,Last Order\n' +
          analyticsData.customers.map(c => 
            `"${c.name}",${c.totalOrders},${c.totalSpent},${c.avgOrderValue.toFixed(2)},${c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'N/A'}`
          ).join('\n');
        filename = 'top-customers.csv';
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="border rounded px-2 py-1 text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="border rounded px-2 py-1 text-sm"
              />
            </div>
            
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="all">All Metrics</option>
              <option value="overview">Overview</option>
              <option value="trends">Trends</option>
              <option value="products">Products</option>
              <option value="customers">Customers</option>
              <option value="geography">Geography</option>
              <option value="performance">Performance</option>
            </select>
            
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 border-b">
          <nav className="flex space-x-8">
            {['overview', 'trends', 'products', 'customers', 'geography', 'performance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">৳{analyticsData.overview.totalRevenue.toLocaleString()}</p>
                </div>
                <div className={`flex items-center ${analyticsData.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.overview.revenueGrowth >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="ml-1 text-sm font-medium">{Math.abs(analyticsData.overview.revenueGrowth).toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-2">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalOrders.toLocaleString()}</p>
                </div>
                <div className={`flex items-center ${analyticsData.overview.orderGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analyticsData.overview.orderGrowth >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  <span className="ml-1 text-sm font-medium">{Math.abs(analyticsData.overview.orderGrowth).toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-2">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">৳{analyticsData.overview.avgOrderValue.toFixed(0)}</p>
                </div>
                <div className="flex items-center text-purple-600">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.conversionRate.toFixed(1)}%</p>
                </div>
                <div className="flex items-center text-orange-600">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-2">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Products</span>
                  <span className="font-medium">{analyticsData.overview.totalProducts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Customers</span>
                  <span className="font-medium">{analyticsData.overview.totalCustomers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue Growth</span>
                  <span className={`font-medium ${analyticsData.overview.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {analyticsData.overview.revenueGrowth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Fulfillment Rate</span>
                  <span className="font-medium">{analyticsData.performance.orderFulfillmentRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Fulfillment</span>
                  <span className="font-medium">{analyticsData.performance.avgFulfillmentTime} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Satisfaction</span>
                  <span className="font-medium flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {analyticsData.performance.customerSatisfaction}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Order Status</h3>
              <div className="space-y-2">
                {Object.entries(analyticsData.performance.statusDistribution).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional tabs will be rendered by separate components */}
      {activeTab === 'trends' && <TrendsAnalytics data={analyticsData} onExport={exportData} />}
      {activeTab === 'products' && <ProductAnalytics data={analyticsData} onExport={exportData} />}
      {activeTab === 'customers' && <CustomerAnalytics data={analyticsData} onExport={exportData} />}
      {activeTab === 'geography' && <GeographyAnalytics data={analyticsData} />}
      {activeTab === 'performance' && <PerformanceAnalytics data={analyticsData} />}
    </div>
  );
}
