import React from 'react';
import { ModelConfig } from '../../types/traffic';

interface TrainingConfigProps {
  config: ModelConfig;
  onConfigChange: (config: ModelConfig) => void;
  dataSize: number;
}

export const TrainingConfig: React.FC<TrainingConfigProps> = ({
  config,
  onConfigChange,
  dataSize,
}) => {
  const availableFeatures = [
    'volume', 'speed', 'occupancy', 'hour', 'dayOfWeek', 'month', 
    'temperature', 'weather', 'isWeekend', 'isHoliday'
  ];

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = config.features.includes(feature)
      ? config.features.filter(f => f !== feature)
      : [...config.features, feature];
    
    onConfigChange({ ...config, features: newFeatures });
  };

  const handleHyperparameterChange = (key: string, value: any) => {
    onConfigChange({
      ...config,
      hyperparameters: { ...config.hyperparameters, [key]: value }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Training Configuration</h3>
      
      <div className="space-y-6">
        {/* Model Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Model Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['linear', 'neural', 'ensemble'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onConfigChange({ ...config, modelType: type })}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors capitalize ${
                  config.modelType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Features ({config.features.length} selected)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableFeatures.map((feature) => (
              <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.features.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {feature.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Training Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Validation Split
            </label>
            <input
              type="range"
              min="0.1"
              max="0.4"
              step="0.05"
              value={config.validationSplit}
              onChange={(e) => onConfigChange({ ...config, validationSplit: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10%</span>
              <span className="font-medium">{Math.round(config.validationSplit * 100)}%</span>
              <span>40%</span>
            </div>
          </div>

          {config.modelType === 'neural' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Epochs
              </label>
              <input
                type="number"
                min="10"
                max="500"
                value={config.epochs || 100}
                onChange={(e) => onConfigChange({ ...config, epochs: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {/* Neural Network Specific Parameters */}
        {config.modelType === 'neural' && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">Neural Network Parameters</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Rate
                </label>
                <select
                  value={config.hyperparameters.learningRate}
                  onChange={(e) => handleHyperparameterChange('learningRate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={0.1}>0.1</option>
                  <option value={0.01}>0.01</option>
                  <option value={0.001}>0.001</option>
                  <option value={0.0001}>0.0001</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Size
                </label>
                <select
                  value={config.batchSize || 32}
                  onChange={(e) => onConfigChange({ ...config, batchSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                  <option value={64}>64</option>
                  <option value={128}>128</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dropout Rate
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.1"
                  value={config.hyperparameters.dropout || 0.2}
                  onChange={(e) => handleHyperparameterChange('dropout', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-xs text-gray-500 mt-1">
                  {config.hyperparameters.dropout || 0.2}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};