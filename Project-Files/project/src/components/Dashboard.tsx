import React from 'react';
import { TrafficData } from '../types/traffic';
import { StatsCards } from './dashboard/StatsCards';
import { TrafficChart } from './dashboard/TrafficChart';
import { HeatmapChart } from './dashboard/HeatmapChart';
import { RecentActivity } from './dashboard/RecentActivity';

interface DashboardProps {
  trafficData: TrafficData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ trafficData }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Traffic Intelligence Dashboard</h2>
        <p className="text-gray-600">Real-time traffic volume analysis and insights</p>
      </div>

      <StatsCards trafficData={trafficData} />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <TrafficChart trafficData={trafficData} />
        </div>
        <div>
          <RecentActivity trafficData={trafficData} />
        </div>
      </div>

      <HeatmapChart trafficData={trafficData} />
    </div>
  );
};