import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { Cloud, Thermometer, Eye, Droplets } from 'lucide-react';
import { TrafficData } from '../../types/traffic';

interface WeatherAnalysisProps {
  trafficData: TrafficData[];
}

export const WeatherAnalysis: React.FC<WeatherAnalysisProps> = ({ trafficData }) => {
  const weatherData = React.useMemo(() => {
    const weatherStats = trafficData.reduce((acc, data) => {
      const weather = data.weather || 'clear';
      if (!acc[weather]) {
        acc[weather] = {
          weather,
          totalVolume: 0,
          avgSpeed: 0,
          count: 0,
        };
      }
      
      acc[weather].totalVolume += data.volume;
      acc[weather].avgSpeed += data.speed;
      acc[weather].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(weatherStats).map((stat: any) => ({
      weather: stat.weather,
      avgVolume: Math.round(stat.totalVolume / stat.count),
      avgSpeed: Math.round(stat.avgSpeed / stat.count),
      count: stat.count,
    }));
  }, [trafficData]);

  const temperatureData = React.useMemo(() => {
    return trafficData
      .filter(data => data.temperature !== undefined)
      .map(data => ({
        temperature: data.temperature,
        volume: data.volume,
        speed: data.speed,
      }));
  }, [trafficData]);

  const weatherImpact = React.useMemo(() => {
    const clearWeather = weatherData.find(w => w.weather === 'clear');
    if (!clearWeather) return [];

    return weatherData.map(weather => ({
      ...weather,
      volumeImpact: ((weather.avgVolume - clearWeather.avgVolume) / clearWeather.avgVolume * 100).toFixed(1),
      speedImpact: ((weather.avgSpeed - clearWeather.avgSpeed) / clearWeather.avgSpeed * 100).toFixed(1),
    }));
  }, [weatherData]);

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'rain':
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case 'fog':
        return <Eye className="h-5 w-5 text-gray-600" />;
      case 'snow':
        return <Cloud className="h-5 w-5 text-gray-400" />;
      default:
        return <Cloud className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-blue-600" />
            Traffic by Weather Condition
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="weather" 
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
                <Bar dataKey="avgVolume" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-600" />
            Temperature vs Traffic Volume
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="temperature" 
                  stroke="#6b7280"
                  fontSize={12}
                  label={{ value: 'Temperature (°F)', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  fontSize={12}
                  label={{ value: 'Volume', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: any, name: string) => [
                    value,
                    name === 'volume' ? 'Traffic Volume' : 'Temperature'
                  ]}
                />
                <Scatter dataKey="volume" fill="#ef4444" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Weather Impact Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weather Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Speed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Speed Impact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weatherImpact.map((weather, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getWeatherIcon(weather.weather)}
                      <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                        {weather.weather}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {weather.avgVolume}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {weather.avgSpeed} mph
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      parseFloat(weather.volumeImpact) > 0 ? 'text-green-600' : 
                      parseFloat(weather.volumeImpact) < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {weather.volumeImpact > 0 ? '+' : ''}{weather.volumeImpact}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      parseFloat(weather.speedImpact) > 0 ? 'text-green-600' : 
                      parseFloat(weather.speedImpact) < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {weather.speedImpact > 0 ? '+' : ''}{weather.speedImpact}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {weather.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <Droplets className="h-8 w-8 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Rain Impact</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {weatherData.find(w => w.weather === 'rain')?.avgVolume || 'N/A'}
          </div>
          <div className="text-sm text-blue-700">Average volume in rain</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Eye className="h-8 w-8 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Fog Impact</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {weatherData.find(w => w.weather === 'fog')?.avgSpeed || 'N/A'}
          </div>
          <div className="text-sm text-gray-700">Average speed in fog</div>
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <Cloud className="h-8 w-8 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">Clear Weather</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900 mb-1">
            {weatherData.find(w => w.weather === 'clear')?.avgVolume || 'N/A'}
          </div>
          <div className="text-sm text-yellow-700">Baseline volume</div>
        </div>

        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <Thermometer className="h-8 w-8 text-red-600" />
            <span className="text-sm font-medium text-red-700">Temperature</span>
          </div>
          <div className="text-2xl font-bold text-red-900 mb-1">
            {temperatureData.length > 0 
              ? Math.round(temperatureData.reduce((sum, d) => sum + d.temperature!, 0) / temperatureData.length)
              : 'N/A'
            }°F
          </div>
          <div className="text-sm text-red-700">Average temperature</div>
        </div>
      </div>
    </div>
  );
};