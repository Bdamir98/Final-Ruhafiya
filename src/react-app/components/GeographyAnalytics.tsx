"use client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { MapPin, TrendingUp } from 'lucide-react';

interface GeographyData {
  geography: Array<{
    city: string;
    orders: number;
    revenue: number;
  }>;
}

interface GeographyAnalyticsProps {
  data: GeographyData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1'];

export default function GeographyAnalytics({ data }: GeographyAnalyticsProps) {
  // Guard against undefined data
  if (!data || !data.geography || !Array.isArray(data.geography)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No geography data available</p>
      </div>
    );
  }

  const totalRevenue = data.geography.reduce((sum, location) => sum + location.revenue, 0);
  const totalOrders = data.geography.reduce((sum, location) => sum + location.orders, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Geographic Distribution</h3>
          <MapPin className="w-5 h-5 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Cities</p>
                <p className="text-xl font-bold text-blue-600">{data.geography.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Top City Revenue</p>
                <p className="text-xl font-bold text-green-600">
                  ৳{data.geography[0]?.revenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <MapPin className="w-6 h-6 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Coverage</p>
                <p className="text-xl font-bold text-purple-600">
                  {data.geography.length > 0 ? '100%' : '0%'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Share</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.geography.map((location, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">#{index + 1}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{location.city}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{location.orders}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">৳{location.revenue.toLocaleString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {totalRevenue > 0 ? ((location.revenue / totalRevenue) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3">Revenue by City</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.geography}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.geography.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ city, percent }) => `${city} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {data.geography.slice(0, 8).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Orders by City</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.geography.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Geographic Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <h4 className="font-semibold text-blue-800">Top Performing City</h4>
            <p className="text-lg font-bold text-blue-600">{data.geography[0]?.city || 'N/A'}</p>
            <p className="text-sm text-blue-600">
              ৳{data.geography[0]?.revenue?.toLocaleString() || 0} revenue
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <h4 className="font-semibold text-green-800">Most Orders</h4>
            <p className="text-lg font-bold text-green-600">
              {data.geography.reduce((max, city) => city.orders > max.orders ? city : max, data.geography[0] || {city: 'N/A', orders: 0}).city}
            </p>
            <p className="text-sm text-green-600">
              {data.geography.reduce((max, city) => city.orders > max.orders ? city : max, data.geography[0] || {orders: 0}).orders} orders
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <h4 className="font-semibold text-purple-800">Avg Order Value</h4>
            <p className="text-lg font-bold text-purple-600">
              ৳{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}
            </p>
            <p className="text-sm text-purple-600">Across all cities</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <h4 className="font-semibold text-orange-800">Market Coverage</h4>
            <p className="text-lg font-bold text-orange-600">{data.geography.length}</p>
            <p className="text-sm text-orange-600">Cities served</p>
          </div>
        </div>
      </div>
    </div>
  );
}
