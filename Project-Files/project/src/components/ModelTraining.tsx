import React, { useState } from 'react';
import { Brain, Play, Settings, BarChart3 } from 'lucide-react';
import { TrafficData, ModelConfig, ModelMetrics } from '../types/traffic';
import { TrainingConfig } from './training/TrainingConfig';
import { TrainingProgress } from './training/TrainingProgress';
import { ModelResults } from './training/ModelResults';

interface ModelTrainingProps {
  trafficData: TrafficData[];
}

export const ModelTraining: React.FC<ModelTrainingProps> = ({ trafficData }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    modelType: 'neural',
    features: ['volume', 'speed', 'occupancy', 'hour', 'dayOfWeek'],
    hyperparameters: {
      learningRate: 0.001,
      hiddenLayers: [64, 32],
      dropout: 0.2,
    },
    validationSplit: 0.2,
    epochs: 100,
    batchSize: 32,
  });
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);

  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setModelMetrics(null);

    // Simulate training progress
    const progressInterval = setInterval(() => {
      setTrainingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsTraining(false);
          // Simulate model metrics
          setModelMetrics({
            accuracy: 0.85 + Math.random() * 0.1,
            mse: 50 + Math.random() * 20,
            mae: 15 + Math.random() * 10,
            r2Score: 0.8 + Math.random() * 0.15,
            trainingTime: 120 + Math.random() * 60,
          });
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Model Training</h2>
        <p className="text-gray-600">Configure and train machine learning models for traffic prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TrainingConfig
            config={modelConfig}
            onConfigChange={setModelConfig}
            dataSize={trafficData.length}
          />

          {isTraining && (
            <TrainingProgress progress={trainingProgress} />
          )}

          {modelMetrics && (
            <ModelResults metrics={modelMetrics} />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Dataset Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Records:</span>
                <span className="font-medium">{trafficData.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Training Set:</span>
                <span className="font-medium">
                  {Math.round(trafficData.length * (1 - modelConfig.validationSplit)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Validation Set:</span>
                <span className="font-medium">
                  {Math.round(trafficData.length * modelConfig.validationSplit).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Features:</span>
                <span className="font-medium">{modelConfig.features.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="h-5 w-5 mr-2 text-blue-600" />
              Training Controls
            </h3>
            <button
              onClick={handleStartTraining}
              disabled={isTraining || trafficData.length === 0}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                isTraining || trafficData.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isTraining ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Training...
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-2" />
                  Start Training
                </>
              )}
            </button>

            {trafficData.length === 0 && (
              <p className="mt-3 text-sm text-gray-500 text-center">
                Upload data first to start training
              </p>
            )}
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Model Types
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <div>
                <strong>Linear Regression:</strong> Fast, interpretable baseline model
              </div>
              <div>
                <strong>Neural Network:</strong> Deep learning for complex patterns
              </div>
              <div>
                <strong>Ensemble:</strong> Combines multiple models for best accuracy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};