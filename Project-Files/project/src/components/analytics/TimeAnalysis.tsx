import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Clock, Calendar, TrendingUp } from 'lucide-react';
import { TrafficData } from '../../types/traffic';

interface TimeAnalysisProps {
  trafficData: TrafficData[];
}

export const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ trafficData }) => {
  const hourlyData = React.useMemo(() => {
    const hourlyStats = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      volume: 0,
      speed: 0,
      count: 0,
    }));

    trafficData.forEach(data => {
      const hour = new Date(data.timestamp).getHours();
      hourlyStats[hour].volume += data.volume;
      hourlyStats[hour].speed += data.speed;
      hourlyStats[hour].count += 1;
    });

    return hourlyStats.map(stat => ({
      hour: `${stat.hour}:00`,
      volume: stat.count > 0 ? Math.round(stat.volume / stat.count) : 0,
      speed: stat.count > 0 ? Math.round(stat.speed / stat.count) : 0,
    }));
  }, [trafficData]);

  const weeklyData = React.useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weeklyStats = days.map(day => ({
      day,
      volume: 0,
      speed: 0,
      count: 0,
    }));

    trafficData.forEach(data => {
      const dayIndex = new Date(data.timestamp).getDay();
      weeklyStats[dayIndex].volume += data.volume;
      weeklyStats[dayIndex].speed += data.speed;
      weeklyStats[dayIndex].count += 1;
    });

    return weeklyStats.map(stat => ({
      day: stat.day.slice(0, 3),
      volume: stat.count > 0 ? Math.round(stat.volume / stat.count) : 0,
      speed: stat.count > 0 ? Math.round(stat.speed / stat.count) : 0,
    }));
  }, [trafficData]);

  const peakHours = React.useMemo(() => {
    const sorted = [...hourlyData].sort((a, b) => b.volume - a.volume);
    return sorted.slice(0, 3);
  }, [hourlyData]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {peakHours.map((peak, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                index === 0 ? 'bg-red-100' : index === 1 ? 'bg-orange-100' : 'bg-yellow-100'
              }`}>
                <Clock className={`h-6 w-6 ${
                  index === 0 ? 'text-red-600' : index === 1 ? 'text-orange-600' : 'text-yellow-600'
                }`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                index === 0 ? 'bg-red-100 text-red-700' : 
                index === 1 ? 'bg-orange-100 text-orange-700' : 
                'bg-yellow-100 text-yellow-700'
              }`}>
                #{index + 1} Peak
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{peak.hour}</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{peak.volume} vehicles</p>
            <p className="text-sm text-gray-600">{peak.speed} mph average speed</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-600" />
            Hourly Traffic Patterns
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="hour" 
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
                  dataKey="volume"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-600" />
            Weekly Traffic Patterns
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
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
                  dataKey="volume"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
          Time-based Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {Math.max(...hourlyData.map(h => h.volume))}
            </div>
            <div className="text-sm text-gray-600">Peak Hour Volume</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {Math.min(...hourlyData.filter(h => h.volume > 0).map(h => h.volume))}
            </div>
            <div className="text-sm text-gray-600">Off-Peak Volume</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {weeklyData.reduce((max, day) => day.volume > max.volume ? day : max).day}
            </div>
            <div className="text-sm text-gray-600">Busiest Day</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {(hourlyData.reduce((sum, h) => sum + h.volume, 0) / hourlyData.filter(h => h.volume > 0).length).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600">Daily Average</div>
          </div>
        </div>
      </div>
    </div>
  );
};