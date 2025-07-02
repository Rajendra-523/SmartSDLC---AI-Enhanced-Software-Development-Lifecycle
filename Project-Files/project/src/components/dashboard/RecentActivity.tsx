import React from 'react';
import { Clock, MapPin, TrendingUp, TrendingDown } from 'lucide-react';
import { TrafficData } from '../../types/traffic';

interface RecentActivityProps {
  trafficData: TrafficData[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ trafficData }) => {
  const recentData = React.useMemo(() => {
    return trafficData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [trafficData]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getVolumeStatus = (volume: number) => {
    if (volume > 100) return { icon: TrendingUp, color: 'text-red-500', label: 'High' };
    if (volume > 50) return { icon: TrendingUp, color: 'text-yellow-500', label: 'Medium' };
    return { icon: TrendingDown, color: 'text-green-500', label: 'Low' };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
      
      <div className="space-y-4">
        {recentData.map((data, index) => {
          const status = getVolumeStatus(data.volume);
          const StatusIcon = status.icon;
          
          return (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`p-2 rounded-lg ${status.color === 'text-red-500' ? 'bg-red-100' : status.color === 'text-yellow-500' ? 'bg-yellow-100' : 'bg-green-100'}`}>
                <StatusIcon className={`h-4 w-4 ${status.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {data.location}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(data.timestamp)}</span>
                  </div>
                  <span className={`font-medium ${status.color}`}>
                    {data.volume} vehicles
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {data.speed} mph
                </div>
                <div className="text-xs text-gray-600">
                  {status.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {recentData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No recent activity data available</p>
        </div>
      )}
    </div>
  );
};