"use client";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  BarChart, Bar, AreaChart, Area, ResponsiveContainer, ComposedChart
} from 'recharts';
import { Download } from 'lucide-react';

interface TrendsData {
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
}

interface TrendsAnalyticsProps {
  data: TrendsData;
  onExport: (type: string) => void;
}

export default function TrendsAnalytics({ data, onExport }: TrendsAnalyticsProps) {
  // Guard against undefined data
  if (!data || !data.trends || !Array.isArray(data.trends)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No trends data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Revenue & Orders Trends</h3>
          <button
            onClick={() => onExport('trends')}
            className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (৳)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Order Status Distribution Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="pending" stackId="1" stroke="#fbbf24" fill="#fbbf24" name="Pending" />
            <Area type="monotone" dataKey="confirmed" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Confirmed" />
            <Area type="monotone" dataKey="shipped" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Shipped" />
            <Area type="monotone" dataKey="delivered" stackId="1" stroke="#10b981" fill="#10b981" name="Delivered" />
            <Area type="monotone" dataKey="cancelled" stackId="1" stroke="#ef4444" fill="#ef4444" name="Cancelled" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Orders Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
