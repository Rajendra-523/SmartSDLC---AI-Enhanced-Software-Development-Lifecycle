import React from 'react';
import { Clock, TrendingUp, Target } from 'lucide-react';
import { PredictionResult } from '../../types/traffic';

interface PredictionHistoryProps {
  predictions: PredictionResult[];
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({ predictions }) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return 'text-green-600 bg-green-100';
    if (confidence > 0.8) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Prediction History</h3>
      
      <div className="space-y-4">
        {predictions.map((prediction, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg font-semibold text-gray-900">
                    {prediction.predicted} vehicles
                  </span>
                  {prediction.actual && (
                    <span className="text-sm text-gray-600">
                      (Actual: {prediction.actual})
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(prediction.timestamp)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                <Target className="h-3 w-3 mr-1" />
                {(prediction.confidence * 100).toFixed(1)}%
              </div>
              {prediction.actual && (
                <div className="text-xs text-gray-500 mt-1">
                  Error: {Math.abs(prediction.predicted - prediction.actual).toFixed(1)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {predictions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>No predictions yet</p>
        </div>
      )}
    </div>
  );
};