import React from 'react';
import { Car, TrendingUp, Clock, MapPin } from 'lucide-react';
import { TrafficData } from '../../types/traffic';

interface StatsCardsProps {
  trafficData: TrafficData[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ trafficData }) => {
  const totalVolume = trafficData.reduce((sum, data) => sum + data.volume, 0);
  const avgSpeed = trafficData.length > 0 
    ? trafficData.reduce((sum, data) => sum + data.speed, 0) / trafficData.length 
    : 0;
  const peakHour = trafficData.length > 0 
    ? trafficData.reduce((prev, current) => 
        prev.volume > current.volume ? prev : current
      ).time 
    : 'N/A';
  const uniqueLocations = new Set(trafficData.map(data => data.location)).size;

  const stats = [
    {
      title: 'Total Volume',
      value: totalVolume.toLocaleString(),
      icon: Car,
      color: 'bg-blue-500',
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Average Speed',
      value: `${avgSpeed.toFixed(1)} mph`,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+3.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Peak Hour',
      value: peakHour,
      icon: Clock,
      color: 'bg-orange-500',
      change: '2 hrs earlier',
      changeType: 'neutral' as const,
    },
    {
      title: 'Locations',
      value: uniqueLocations.toString(),
      icon: MapPin,
      color: 'bg-purple-500',
      change: '+2 new',
      changeType: 'positive' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'positive' 
                  ? 'text-green-700 bg-green-100' 
                  : stat.changeType === 'negative'
                  ? 'text-red-700 bg-red-100'
                  : 'text-gray-700 bg-gray-100'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};