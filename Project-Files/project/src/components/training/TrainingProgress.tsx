import React from 'react';
import { Brain, Clock } from 'lucide-react';

interface TrainingProgressProps {
  progress: number;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({ progress }) => {
  const estimatedTimeRemaining = Math.max(0, Math.round((100 - progress) * 2)); // 2 seconds per percent

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <Brain className="h-6 w-6 mr-2 text-blue-600" />
          Training in Progress
        </h3>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          {estimatedTimeRemaining}s remaining
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(progress)}
            </div>
            <div className="text-sm text-gray-600">Epochs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {(0.8 + (progress / 100) * 0.15).toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {(100 - progress * 0.5).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Loss</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(0.75 + (progress / 100) * 0.2).toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Val Acc</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Training Log</h4>
          <div className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto">
            <div>Epoch {Math.round(progress)}/100 - loss: {(100 - progress * 0.5).toFixed(4)} - accuracy: {(0.8 + (progress / 100) * 0.15).toFixed(4)}</div>
            {progress > 10 && <div>Validation accuracy improved from {(0.75).toFixed(4)} to {(0.75 + (progress / 100) * 0.2).toFixed(4)}</div>}
            {progress > 25 && <div>Learning rate adjusted to {(0.001 * Math.pow(0.95, Math.floor(progress / 25))).toExponential(2)}</div>}
            {progress > 50 && <div>Early stopping patience: {Math.max(1, 10 - Math.floor(progress / 10))}/10</div>}
          </div>
        </div>
      </div>
    </div>
  );
};