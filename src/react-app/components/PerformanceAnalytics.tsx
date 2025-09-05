"use client";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Clock, Target, TrendingDown, Star, CheckCircle, AlertCircle } from 'lucide-react';

interface PerformanceData {
  performance: {
    statusDistribution: Record<string, number>;
    avgFulfillmentTime: number;
    orderFulfillmentRate: number;
    returnRate: number;
    customerSatisfaction: number;
  };
}

interface PerformanceAnalyticsProps {
  data: PerformanceData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function PerformanceAnalytics({ data }: PerformanceAnalyticsProps) {
  const statusData = Object.entries(data.performance.statusDistribution).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: (count / Object.values(data.performance.statusDistribution).reduce((a, b) => a + b, 0)) * 100
  }));

  // Mock performance trends data
  const performanceTrends = [
    { month: 'Jan', fulfillmentRate: 85, customerSat: 4.2, returnRate: 3.1 },
    { month: 'Feb', fulfillmentRate: 88, customerSat: 4.3, returnRate: 2.8 },
    { month: 'Mar', fulfillmentRate: 91, customerSat: 4.5, returnRate: 2.5 },
    { month: 'Apr', fulfillmentRate: 89, customerSat: 4.4, returnRate: 2.7 },
    { month: 'May', fulfillmentRate: 93, customerSat: 4.6, returnRate: 2.1 },
    { month: 'Jun', fulfillmentRate: data.performance.orderFulfillmentRate, customerSat: data.performance.customerSatisfaction, returnRate: data.performance.returnRate }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Fulfillment Time</p>
              <p className="text-2xl font-bold text-gray-900">{data.performance.avgFulfillmentTime} days</p>
              <p className="text-xs text-gray-500">Target: 2-3 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fulfillment Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.performance.orderFulfillmentRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Target: 95%+</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Return Rate</p>
              <p className="text-2xl font-bold text-gray-900">{data.performance.returnRate}%</p>
              <p className="text-xs text-gray-500">Target: &lt;3%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">{data.performance.customerSatisfaction}/5</p>
              <p className="text-xs text-gray-500">Target: 4.5+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="fulfillmentRate" stroke="#8884d8" name="Fulfillment Rate %" strokeWidth={2} />
            <Line type="monotone" dataKey="customerSat" stroke="#82ca9d" name="Customer Satisfaction" strokeWidth={2} />
            <Line type="monotone" dataKey="returnRate" stroke="#ffc658" name="Return Rate %" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percentage }) => `${status} ${percentage.toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Current Performance</h4>
            
            <div className="flex items-start space-x-3">
              {data.performance.orderFulfillmentRate >= 95 ? 
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> :
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              }
              <div>
                <p className="text-sm font-medium">Fulfillment Rate</p>
                <p className="text-xs text-gray-600">
                  {data.performance.orderFulfillmentRate >= 95 ? 
                    'Excellent fulfillment rate! Keep up the good work.' :
                    'Room for improvement. Target is 95%+ fulfillment rate.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {data.performance.avgFulfillmentTime <= 3 ? 
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> :
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              }
              <div>
                <p className="text-sm font-medium">Fulfillment Speed</p>
                <p className="text-xs text-gray-600">
                  {data.performance.avgFulfillmentTime <= 3 ? 
                    'Great fulfillment speed!' :
                    'Consider optimizing fulfillment process to reduce delivery time.'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              {data.performance.returnRate <= 3 ? 
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> :
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              }
              <div>
                <p className="text-sm font-medium">Return Rate</p>
                <p className="text-xs text-gray-600">
                  {data.performance.returnRate <= 3 ? 
                    'Low return rate indicates good product quality.' :
                    'Higher than ideal return rate. Review product quality and descriptions.'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Recommendations</h4>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Optimize Fulfillment</p>
              <p className="text-xs text-blue-600">
                Implement automated order processing to reduce fulfillment time.
              </p>
            </div>

            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-green-800">Customer Communication</p>
              <p className="text-xs text-green-600">
                Send proactive updates about order status to improve satisfaction.
              </p>
            </div>

            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Quality Control</p>
              <p className="text-xs text-purple-600">
                Regular quality checks can help maintain low return rates.
              </p>
            </div>

            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Performance Monitoring</p>
              <p className="text-xs text-orange-600">
                Set up alerts for key performance metrics to catch issues early.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Status Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Status Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statusData.map((status, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      status.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      status.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      status.status === 'Confirmed' ? 'bg-purple-100 text-purple-800' :
                      status.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {status.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{status.percentage.toFixed(1)}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {status.status === 'Delivered' ? '✅ Excellent' :
                     status.status === 'Shipped' ? '🚚 In Transit' :
                     status.status === 'Confirmed' ? '⏳ Processing' :
                     status.status === 'Pending' ? '⚠️ Needs Attention' :
                     '❌ Requires Review'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
