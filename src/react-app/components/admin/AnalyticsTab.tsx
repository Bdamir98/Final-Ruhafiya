"use client";
import React, { useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { RefreshCw, Download, Calendar, BarChart3, DollarSign, Users, Package, Target } from 'lucide-react';

interface AnalyticsTabProps {
  analyticsTab: 'overview' | 'sales' | 'customers' | 'orders' | 'products' | 'geography';
  analyticsData: any;
  analyticsLoading: boolean;
  analyticsDateRange: string;
  customStartDate: string;
  customEndDate: string;
  fetchAnalytics: () => void;
  exportAnalyticsData: () => void;
  setAnalyticsTab: (tab: 'overview' | 'sales' | 'customers' | 'orders' | 'products' | 'geography') => void;
  setAnalyticsDateRange: (range: string) => void;
  setCustomStartDate: (date: string) => void;
  setCustomEndDate: (date: string) => void;
}

export default function AnalyticsTab({
  analyticsTab,
  analyticsData,
  analyticsLoading,
  analyticsDateRange,
  customStartDate,
  customEndDate,
  fetchAnalytics,
  exportAnalyticsData,
  setAnalyticsTab,
  setAnalyticsDateRange,
  setCustomStartDate,
  setCustomEndDate
}: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h2>
            <p className="text-gray-600 mt-1">Comprehensive insights into your business performance</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={analyticsDateRange}
                onChange={(e) => setAnalyticsDateRange(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              disabled={analyticsLoading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {analyticsLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
            </button>

            {/* Export Button */}
            <button
              onClick={exportAnalyticsData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        {analyticsDateRange === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* Analytics Tabs */}
        <div className="flex flex-wrap gap-2 border-b pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'sales', label: 'Sales & Revenue', icon: DollarSign },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'orders', label: 'Orders', icon: null as any },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'geography', label: 'Geography', icon: Target },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setAnalyticsTab(id as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                analyticsTab === id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Content */}
      <div className="min-h-[600px]">
        <AnalyticsContent
          analyticsTab={analyticsTab}
          analyticsData={analyticsData}
          analyticsLoading={analyticsLoading}
        />
      </div>
    </div>
  );
}

interface AnalyticsContentProps {
  analyticsTab: string;
  analyticsData: any;
  analyticsLoading: boolean;
}

function AnalyticsContent({ analyticsTab, analyticsData, analyticsLoading }: AnalyticsContentProps) {
  return (
    (() => {
      const overviewData = analyticsData?.overview;

      switch (analyticsTab) {
        case 'overview':
          return (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {/* KPI Cards */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ৳{overviewData?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {overviewData?.totalOrders?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {overviewData?.totalCustomers?.toLocaleString() || '0'}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {overviewData?.activeProducts || '0'}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
            </div>
          );

        case 'sales':
        case 'overview':
          return (
            <div className="space-y-6">
              {/* Revenue Chart */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Order Trends</h3>
                {analyticsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={analyticsData?.sales || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [
                        name === 'revenue' ? `৳${value.toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]} />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" />
                      <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Sales Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Total Revenue</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ৳{analyticsData?.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Total Orders</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {analyticsData?.totalOrders?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Average Order Value</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    ৳{analyticsData?.avgOrderValue?.toLocaleString() || '0'}
                  </p>
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Charts and analytics for {analyticsTab}</div>
              </div>
            </div>
          );
      }
    })()
  );
}