import React, { useState } from 'react';
import { TrendingUp, Calendar, MapPin, Zap } from 'lucide-react';
import { TrafficData, PredictionResult } from '../types/traffic';
import { PredictionForm } from './predictions/PredictionForm';
import { PredictionChart } from './predictions/PredictionChart';
import { PredictionHistory } from './predictions/PredictionHistory';

interface PredictionsProps {
  trafficData: TrafficData[];
}

export const Predictions: React.FC<PredictionsProps> = ({ trafficData }) => {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePrediction = async (formData: any) => {
    setIsLoading(true);
    
    // Simulate prediction API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPrediction: PredictionResult = {
      predicted: Math.round(50 + Math.random() * 100),
      confidence: 0.8 + Math.random() * 0.15,
      timestamp: new Date().toISOString(),
    };
    
    setPredictions(prev => [newPrediction, ...prev].slice(0, 10));
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Traffic Predictions</h2>
        <p className="text-gray-600">Generate accurate traffic volume predictions using trained models</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PredictionForm onPredict={handlePrediction} isLoading={isLoading} />
        </div>
        
        <div className="lg:col-span-2 space-y-8">
          {predictions.length > 0 && (
            <>
              <PredictionChart predictions={predictions} />
              <PredictionHistory predictions={predictions} />
            </>
          )}
          
          {predictions.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Predictions Yet</h3>
              <p className="text-gray-600 mb-6">
                Use the form on the left to generate your first traffic volume prediction
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Select date & time</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Choose location</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Get instant results</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Prediction Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-800">
          <div>
            <strong>Real-time Predictions:</strong> Get instant traffic volume forecasts
          </div>
          <div>
            <strong>Confidence Intervals:</strong> Understand prediction reliability
          </div>
          <div>
            <strong>Multiple Timeframes:</strong> Predict from minutes to hours ahead
          </div>
          <div>
            <strong>Weather Integration:</strong> Factor in weather conditions
          </div>
        </div>
      </div>
    </div>
  );
};