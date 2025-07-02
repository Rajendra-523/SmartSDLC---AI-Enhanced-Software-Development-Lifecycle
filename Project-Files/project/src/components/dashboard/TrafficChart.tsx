import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrafficData } from '../../types/traffic';

interface TrafficChartProps {
  trafficData: TrafficData[];
}

export const TrafficChart: React.FC<TrafficChartProps> = ({ trafficData }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Process data based on time range
  const processedData = React.useMemo(() => {
    const now = new Date();
    let filteredData = trafficData;

    switch (timeRange) {
      case '24h':
        filteredData = trafficData.filter(data => {
          const dataTime = new Date(data.timestamp);
          return now.getTime() - dataTime.getTime() <= 24 * 60 * 60 * 1000;
        });
        break;
      case '7d':
        filteredData = trafficData.filter(data => {
          const dataTime = new Date(data.timestamp);
          return now.getTime() - dataTime.getTime() <= 7 * 24 * 60 * 60 * 1000;
        });
        break;
      case '30d':
        filteredData = trafficData.filter(data => {
          const dataTime = new Date(data.timestamp);
          return now.getTime() - dataTime.getTime() <= 30 * 24 * 60 * 60 * 1000;
        });
        break;
    }

    // Group data by hour for better visualization
    const groupedData = filteredData.reduce((acc, data) => {
      const hour = new Date(data.timestamp).getHours();
      const key = `${hour}:00`;
      
      if (!acc[key]) {
        acc[key] = {
          time: key,
          volume: 0,
          speed: 0,
          occupancy: 0,
          count: 0,
        };
      }
      
      acc[key].volume += data.volume;
      acc[key].speed += data.speed;
      acc[key].occupancy += data.occupancy;
      acc[key].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData).map((item: any) => ({
      time: item.time,
      volume: Math.round(item.volume / item.count),
      speed: Math.round(item.speed / item.count),
      occupancy: Math.round(item.occupancy / item.count),
    }));
  }, [trafficData, timeRange]);

  const Chart = chartType === 'line' ? LineChart : BarChart;
  const DataComponent = chartType === 'line' ? Line : Bar;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-xl font-bold text-gray-900">Traffic Volume Trends</h3>
        
        <div className="flex space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['line', 'bar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                  chartType === type
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <Chart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
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
            <Legend />
            <DataComponent
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              fill="#3b82f6"
              strokeWidth={2}
              name="Volume"
            />
            <DataComponent
              type="monotone"
              dataKey="speed"
              stroke="#10b981"
              fill="#10b981"
              strokeWidth={2}
              name="Speed"
            />
          </Chart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};