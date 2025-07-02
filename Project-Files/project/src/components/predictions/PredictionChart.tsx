import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PredictionResult } from '../../types/traffic';

interface PredictionChartProps {
  predictions: PredictionResult[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ predictions }) => {
  const chartData = predictions
    .slice()
    .reverse()
    .map((pred, index) => ({
      index: index + 1,
      predicted: pred.predicted,
      confidence: pred.confidence * 100,
      upperBound: pred.predicted * (1 + (1 - pred.confidence) * 0.5),
      lowerBound: pred.predicted * (1 - (1 - pred.confidence) * 0.5),
    }));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Prediction Trends</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="index" 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'Prediction #', position: 'insideBottom', offset: -5 }}
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
                typeof value === 'number' ? value.toFixed(1) : value,
                name === 'predicted' ? 'Predicted Volume' : 
                name === 'confidence' ? 'Confidence %' : name
              ]}
            />
            
            <Line
              type="monotone"
              dataKey="upperBound"
              stroke="#93c5fd"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
              name="Upper Bound"
            />
            <Line
              type="monotone"
              dataKey="lowerBound"
              stroke="#93c5fd"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
              name="Lower Bound"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name="Predicted Volume"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-600"></div>
          <span>Predicted Volume</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-blue-300 border-dashed border-t"></div>
          <span>Confidence Interval</span>
        </div>
      </div>
    </div>
  );
};