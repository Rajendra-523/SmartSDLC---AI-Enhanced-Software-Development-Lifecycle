import React, { useState } from 'react';
import { Calendar, MapPin, Cloud, Clock } from 'lucide-react';

interface PredictionFormProps {
  onPredict: (data: any) => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ onPredict, isLoading }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    location: 'Highway 101',
    weather: 'clear',
    temperature: 70,
    isWeekend: false,
    isHoliday: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPredict(formData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Prediction Parameters</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-2" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Clock className="h-4 w-4 inline mr-2" />
            Time
          </label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="h-4 w-4 inline mr-2" />
            Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Highway 101">Highway 101</option>
            <option value="Interstate 5">Interstate 5</option>
            <option value="Route 280">Route 280</option>
            <option value="Highway 85">Highway 85</option>
            <option value="Interstate 880">Interstate 880</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Cloud className="h-4 w-4 inline mr-2" />
            Weather Conditions
          </label>
          <select
            value={formData.weather}
            onChange={(e) => handleChange('weather', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="clear">Clear</option>
            <option value="cloudy">Cloudy</option>
            <option value="rain">Rain</option>
            <option value="snow">Snow</option>
            <option value="fog">Fog</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature (°F)
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={formData.temperature}
            onChange={(e) => handleChange('temperature', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>20°F</span>
            <span className="font-medium">{formData.temperature}°F</span>
            <span>100°F</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isWeekend}
              onChange={(e) => handleChange('isWeekend', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Weekend</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isHoliday}
              onChange={(e) => handleChange('isHoliday', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Holiday</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Predicting...
            </>
          ) : (
            'Generate Prediction'
          )}
        </button>
      </form>
    </div>
  );
};