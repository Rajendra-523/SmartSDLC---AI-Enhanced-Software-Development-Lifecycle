import React from 'react';
import { TrafficData } from '../../types/traffic';

interface HeatmapChartProps {
  trafficData: TrafficData[];
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ trafficData }) => {
  // Create heatmap data for hours vs days of week
  const heatmapData = React.useMemo(() => {
    const data: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));
    const counts: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));

    trafficData.forEach(item => {
      const date = new Date(item.timestamp);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      
      data[dayOfWeek][hour] += item.volume;
      counts[dayOfWeek][hour] += 1;
    });

    // Calculate averages
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        if (counts[day][hour] > 0) {
          data[day][hour] = Math.round(data[day][hour] / counts[day][hour]);
        }
      }
    }

    return data;
  }, [trafficData]);

  const maxValue = Math.max(...heatmapData.flat());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getIntensity = (value: number) => {
    const intensity = value / maxValue;
    return `rgba(59, 130, 246, ${intensity})`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Traffic Volume Heatmap</h3>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="grid grid-cols-25 gap-1 text-xs">
            {/* Header row with hours */}
            <div></div>
            {Array.from({ length: 24 }, (_, i) => (
              <div key={i} className="text-center text-gray-600 font-medium p-1">
                {i}
              </div>
            ))}
            
            {/* Data rows */}
            {days.map((day, dayIndex) => (
              <React.Fragment key={day}>
                <div className="text-gray-600 font-medium p-2 flex items-center">
                  {day}
                </div>
                {heatmapData[dayIndex].map((value, hourIndex) => (
                  <div
                    key={`${dayIndex}-${hourIndex}`}
                    className="aspect-square rounded border border-gray-200 flex items-center justify-center text-xs font-medium hover:border-gray-400 transition-colors cursor-pointer"
                    style={{ backgroundColor: getIntensity(value) }}
                    title={`${day} ${hourIndex}:00 - ${value} vehicles`}
                  >
                    {value > 0 ? value : ''}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <span>Low Traffic</span>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded border border-gray-200"
              style={{ backgroundColor: `rgba(59, 130, 246, ${(i + 1) * 0.2})` }}
            />
          ))}
        </div>
        <span>High Traffic</span>
      </div>
    </div>
  );
};