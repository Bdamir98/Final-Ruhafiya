import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Eye } from 'lucide-react';

interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable?: boolean;
}

interface AnalyticsInsightsProps {
  data: any;
  onActionClick?: (action: string) => void;
}

const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ data, onActionClick }) => {
  // Generate insights based on analytics data
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    if (data?.sales?.length > 1) {
      const recent = data.sales[data.sales.length - 1];
      const previous = data.sales[data.sales.length - 2];

      if (recent && previous) {
        // Revenue trend analysis
        if (recent.revenue > previous.revenue * 1.1) {
          insights.push({
            id: 'revenue-growth',
            type: 'positive',
            title: 'Revenue Increasing',
            description: `Revenue up ${(recent.revenue - previous.revenue) / previous.revenue * 100}% from last period`,
            impact: 'high',
            actionable: true
          });
        } else if (recent.revenue < previous.revenue * 0.9) {
          insights.push({
            id: 'revenue-decline',
            type: 'negative',
            title: 'Revenue Declining',
            description: `Revenue down ${Math.abs(recent.revenue - previous.revenue) / previous.revenue * 100}% from last period`,
            impact: 'high',
            actionable: true
          });
        }

        // Order trends
        if (recent.orders < previous.orders * 0.8) {
          insights.push({
            id: 'order-drop',
            type: 'warning',
            title: 'Order Drop Detected',
            description: 'Orders have decreased significantly compared to previous period',
            impact: 'medium',
            actionable: true
          });
        }
      }
    }

    // Customer insights
    if (data?.returningCustomers > 0) {
      const retentionRate = data.returningCustomers / (data.newCustomers + data.returningCustomers) * 100;
      if (retentionRate < 30) {
        insights.push({
          id: 'low-retention',
          type: 'warning',
          title: 'Low Customer Retention',
          description: `Only ${retentionRate.toFixed(1)}% of customers are returning`,
          impact: 'high',
          actionable: true
        });
      }
    }

    // Product insights
    if (data?.lowStock > 0) {
      insights.push({
        id: 'low-stock',
        type: 'warning',
        title: 'Low Stock Alert',
        description: `${data.lowStock} products are running low on stock`,
        impact: 'medium',
        actionable: true
      });
    }

    // Order completion insights
    if (data?.completionRate < 70) {
      insights.push({
        id: 'low-completion',
        type: 'negative',
        title: 'Low Order Completion Rate',
        description: `Only ${data.completionRate}% of orders are being completed`,
        impact: 'high',
        actionable: true
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Eye className="h-5 w-5 text-blue-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-medium text-gray-900 mb-2">No Insights Available</h4>
        <p className="text-gray-600">Analyzing your data... More insights will appear as data accumulates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`rounded-lg p-4 border-l-4 ${
            insight.type === 'positive' ? 'border-green-500 bg-green-50' :
            insight.type === 'negative' ? 'border-red-500 bg-red-50' :
            insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
            'border-blue-500 bg-blue-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getIcon(insight.type)}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-700">{insight.description}</p>
                {insight.actionable && onActionClick && (
                  <button
                    onClick={() => onActionClick(insight.id)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Take action →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsInsights;