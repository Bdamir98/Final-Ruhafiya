"use client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Download, Users, Star } from 'lucide-react';

interface CustomerData {
  customers: Array<{
    id: number;
    name: string;
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
    lastOrderDate: number | null;
  }>;
}

interface CustomerAnalyticsProps {
  data: CustomerData;
  onExport: (type: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function CustomerAnalytics({ data, onExport }: CustomerAnalyticsProps) {
  // Guard against undefined data
  if (!data || !data.customers || !Array.isArray(data.customers)) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No customer data available</p>
      </div>
    );
  }

  // Customer segmentation based on spending
  const customerSegments = data.customers.reduce((acc: any, customer) => {
    let segment = 'Low Value';
    if (customer.totalSpent > 10000) segment = 'High Value';
    else if (customer.totalSpent > 5000) segment = 'Medium Value';
    
    acc[segment] = (acc[segment] || 0) + 1;
    return acc;
  }, {});

  const segmentData = Object.entries(customerSegments).map(([segment, count]) => ({
    segment,
    count
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Top Customers</h3>
          <button
            onClick={() => onExport('customers')}
            className="flex items-center gap-2 px-3 py-1 text-sm border rounded hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Order Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.customers.map((customer) => {
                const daysSinceLastOrder = customer.lastOrderDate ? 
                  Math.floor((Date.now() - customer.lastOrderDate) / (1000 * 60 * 60 * 24)) : null;
                
                return (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.totalOrders}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{customer.totalSpent.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">৳{customer.avgOrderValue.toFixed(0)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        !daysSinceLastOrder ? 'bg-gray-100 text-gray-800' :
                        daysSinceLastOrder <= 30 ? 'bg-green-100 text-green-800' :
                        daysSinceLastOrder <= 90 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {!daysSinceLastOrder ? 'New' :
                         daysSinceLastOrder <= 30 ? 'Active' :
                         daysSinceLastOrder <= 90 ? 'At Risk' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Segmentation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ segment, percent }) => `${segment} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Customers by Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.customers.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSpent" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Order Frequency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.customers.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalOrders" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Total Customers</p>
                  <p className="text-sm text-gray-600">Active customer base</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">{data.customers.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Avg Customer Value</p>
                  <p className="text-sm text-gray-600">Average spending per customer</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ৳{data.customers.length > 0 ? 
                  Math.round(data.customers.reduce((sum, c) => sum + c.totalSpent, 0) / data.customers.length) : 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Repeat Customers</p>
                  <p className="text-sm text-gray-600">Customers with 2+ orders</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-purple-600">
                {data.customers.filter(c => c.totalOrders > 1).length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
