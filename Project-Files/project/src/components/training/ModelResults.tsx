import React from 'react';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';
import { ModelMetrics } from '../../types/traffic';

interface ModelResultsProps {
  metrics: ModelMetrics;
}

export const ModelResults: React.FC<ModelResultsProps> = ({ metrics }) => {
  const getScoreColor = (score: number, isLower = false) => {
    const threshold = isLower ? 0.3 : 0.8;
    if (isLower) {
      return score < threshold ? 'text-green-600' : score < threshold * 2 ? 'text-yellow-600' : 'text-red-600';
    }
    return score > threshold ? 'text-green-600' : score > threshold * 0.7 ? 'text-yellow-600' : 'text-red-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
          Training Results
        </h3>
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          Training Complete
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="flex justify-center mb-2">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(metrics.accuracy)}`}>
            {(metrics.accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="flex justify-center mb-2">
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(metrics.r2Score)}`}>
            {metrics.r2Score.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">R² Score</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="flex justify-center mb-2">
            <Target className="h-8 w-8 text-orange-600" />
          </div>
          <div className={`text-2xl font-bold ${getScoreColor(metrics.mae, true)}`}>
            {metrics.mae.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">MAE</div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="flex justify-center mb-2">
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatTime(metrics.trainingTime)}
          </div>
          <div className="text-sm text-gray-600">Training Time</div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Performance Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Mean Squared Error:</span>
            <span className="ml-2 font-medium">{metrics.mse.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Mean Absolute Error:</span>
            <span className="ml-2 font-medium">{metrics.mae.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-gray-600">Model Quality:</span>
            <span className={`ml-2 font-medium ${
              metrics.accuracy > 0.9 ? 'text-green-600' : 
              metrics.accuracy > 0.8 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {metrics.accuracy > 0.9 ? 'Excellent' : 
               metrics.accuracy > 0.8 ? 'Good' : 'Needs Improvement'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Recommendation:</span>
            <span className="ml-2 font-medium text-blue-600">
              {metrics.accuracy > 0.85 ? 'Ready for Production' : 'Consider More Training'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Model
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Export Results
        </button>
      </div>
    </div>
  );
};