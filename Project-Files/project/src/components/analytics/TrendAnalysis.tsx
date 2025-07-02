import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import { TrafficData } from '../../types/traffic';

interface TrendAnalysisProps {
  trafficData: TrafficData[];
}

export const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ trafficData }) => {
  const monthlyTrends = React.useMemo(() => {
    const monthlyData = trafficData.reduce((acc, data) => {
      const date = new Date(data.timestamp);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          volume: 0,
          speed: 0,
          count: 0,
        };
      }
      
      acc[monthKey].volume += data.volume;
      acc[monthKey].speed += data.speed;
      acc[monthKey].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(monthlyData)
      .map((data: any) => ({
        month: data.month,
        avgVolume: Math.round(data.volume / data.count),
        avgSpeed: Math.round(data.speed / data.count),
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [trafficData]);

  const growthMetrics = React.useMemo(() => {
    if (monthlyTrends.length < 2) return null;

    const latest = monthlyTrends[monthlyTrends.length - 1];
    const previous = monthlyTrends[monthlyTrends.length - 2];
    
    const volumeGrowth = ((latest.avgVolume - previous.avgVolume) / previous.avgVolume * 100);
    const speedChange = ((latest.avgSpeed - previous.avgSpeed) / previous.avgSpeed * 100);

    return {
      volumeGrowth: volumeGrowth.toFixed(1),
      speedChange: speedChange.toFixed(1),
      trend: volumeGrowth > 0 ? 'increasing' : 'decreasing',
    };
  }, [monthlyTrends]);

  const seasonalData = React.useMemo(() => {
    const seasons = {
      'Winter': { volume: 0, speed: 0, count: 0 },
      'Spring': { volume: 0, speed: 0, count: 0 },
      'Summer': { volume: 0, speed: 0, count: 0 },
      'Fall': { volume: 0, speed: 0, count: 0 },
    };

    trafficData.forEach(data => {
      const month = new Date(data.timestamp).getMonth();
      let season: keyof typeof seasons;
      
      if (month >= 11 || month <= 1) season = 'Winter';
      else if (month >= 2 && month <= 4) season = 'Spring';
      else if (month >= 5 && month <= 7) season = 'Summer';
      else season = 'Fall';

      seasons[season].volume += data.volume;
      seasons[season].speed += data.speed;
      seasons[season].count += 1;
    });

    return Object.entries(seasons).map(([season, data]) => ({
      season,
      avgVolume: data.count > 0 ? Math.round(data.volume / data.count) : 0,
      avgSpeed: data.count > 0 ? Math.round(data.speed / data.count) : 0,
    }));
  }, [trafficData]);

  return (
    <div className="space-y-8">
      {growthMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                parseFloat(growthMetrics.volumeGrowth) > 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {parseFloat(growthMetrics.volumeGrowth) > 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-600">Month-over-Month</span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              parseFloat(growthMetrics.volumeGrowth) > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {growthMetrics.volumeGrowth > 0 ? '+' : ''}{growthMetrics.volumeGrowth}%
            </div>
            <div className="text-sm text-gray-600">Volume Growth</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                parseFloat(growthMetrics.speedChange) > 0 ? 'bg-blue-100' : 'bg-orange-100'
              }`}>
                <Activity className={`h-6 w-6 ${
                  parseFloat(growthMetrics.speedChange) > 0 ? 'text-blue-600' : 'text-orange-600'
                }`} />
              </div>
              <span className="text-sm font-medium text-gray-600">Speed Change</span>
            </div>
            <div className={`text-2xl font-bold mb-1 ${
              parseFloat(growthMetrics.speedChange) > 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {growthMetrics.speedChange > 0 ? '+' : ''}{growthMetrics.speedChange}%
            </div>
            <div className="text-sm text-gray-600">Average Speed</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Trend Direction</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">
              {growthMetrics.trend}
            </div>
            <div className="text-sm text-gray-600">Overall Trend</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Traffic Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgVolume"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Average Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Seasonal Patterns</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seasonalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="season" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avgVolume"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Trend Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Key Observations</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Traffic volume shows {growthMetrics?.trend || 'stable'} trend over the analyzed period
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  {seasonalData.reduce((max, season) => season.avgVolume > max.avgVolume ? season : max).season} shows highest seasonal traffic
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>
                  Speed patterns correlate inversely with volume changes
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Seasonal Summary</h4>
            <div className="space-y-2">
              {seasonalData.map((season, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{season.season}</span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{season.avgVolume} vehicles</div>
                    <div className="text-xs text-gray-600">{season.avgSpeed} mph avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};