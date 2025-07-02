import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Calendar } from 'lucide-react';
import { TrafficData } from '../types/traffic';
import { LocationAnalysis } from './analytics/LocationAnalysis';
import { TimeAnalysis } from './analytics/TimeAnalysis';
import { WeatherAnalysis } from './analytics/WeatherAnalysis';
import { TrendAnalysis } from './analytics/TrendAnalysis';

interface AnalyticsProps {
  trafficData: TrafficData[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ trafficData }) => {
  const [activeAnalysis, setActiveAnalysis] = useState('location');

  const analysisTypes = [
    { id: 'location', label: 'Location Analysis', icon: BarChart3 },
    { id: 'time', label: 'Time Analysis', icon: Calendar },
    { id: 'weather', label: 'Weather Impact', icon: PieChart },
    { id: 'trends', label: 'Trend Analysis', icon: TrendingUp },
  ];

  const renderAnalysis = () => {
    switch (activeAnalysis) {
      case 'location':
        return <LocationAnalysis trafficData={trafficData} />;
      case 'time':
        return <TimeAnalysis trafficData={trafficData} />;
      case 'weather':
        return <WeatherAnalysis trafficData={trafficData} />;
      case 'trends':
        return <TrendAnalysis trafficData={trafficData} />;
      default:
        return <LocationAnalysis trafficData={trafficData} />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h2>
        <p className="text-gray-600">Deep insights into traffic patterns and trends</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {analysisTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setActiveAnalysis(type.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeAnalysis === type.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 shadow-md'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{type.label}</span>
            </button>
          );
        })}
      </div>

      {renderAnalysis()}
    </div>
  );
};