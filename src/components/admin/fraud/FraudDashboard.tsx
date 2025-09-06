"use client";
import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Users,
  Clock,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FraudStats {
  total: number;
  flagged: number;
  highRisk: number;
  blocked: number;
  fraudRate: string;
}

interface RiskFactor {
  reason: string;
  count: number;
}

interface HourlyTrend {
  hour: number;
  total: number;
  flagged: number;
  avgScore: number;
}

export default function FraudDashboard() {
  const [stats, setStats] = useState<FraudStats>({
    total: 0,
    flagged: 0,
    highRisk: 0,
    blocked: 0,
    fraudRate: '0'
  });
  const [topRiskFactors, setTopRiskFactors] = useState<RiskFactor[]>([]);
  const [hourlyTrend, setHourlyTrend] = useState<HourlyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/fake-orders/stats?timeframe=24');
      const data = await response.json();
      
      setStats(data.statistics || stats);
      setTopRiskFactors(data.topRiskFactors || []);
      setHourlyTrend(data.hourlyTrend || []);
    } catch (error) {
      console.error('Failed to fetch fraud stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged</p>
              <p className="text-2xl font-bold text-gray-900">{stats.flagged}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highRisk}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked</p>
              <p className="text-2xl font-bold text-gray-900">{stats.blocked}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Fraud Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.fraudRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">24-Hour Fraud Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                tickFormatter={(hour) => `${hour}:00`}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(hour) => `${hour}:00`}
                formatter={(value, name) => [
                  value,
                  name === 'total' ? 'Total Orders' :
                  name === 'flagged' ? 'Flagged Orders' : 'Avg Score'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="total"
              />
              <Line 
                type="monotone" 
                dataKey="flagged" 
                stroke="#EF4444" 
                strokeWidth={2}
                name="flagged"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Risk Factors */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold">Top Risk Factors</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRiskFactors} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis 
                type="category" 
                dataKey="reason" 
                width={120}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="count" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Factors List */}
      {topRiskFactors.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Factor Details</h3>
          <div className="space-y-3">
            {topRiskFactors.map((factor, index) => (
              <div key={factor.reason} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{factor.reason}</span>
                </div>
                <span className="text-sm font-bold text-orange-600">{factor.count} occurrences</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
