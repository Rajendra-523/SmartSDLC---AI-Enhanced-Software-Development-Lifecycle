export interface TrafficData {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  volume: number;
  speed: number;
  occupancy: number;
  location: string;
  weather?: string;
  temperature?: number;
  visibility?: number;
  roadType?: string;
  dayOfWeek?: string;
  isHoliday?: boolean;
  isWeekend?: boolean;
  hour?: number;
  month?: number;
  season?: string;
}

export interface ModelMetrics {
  accuracy: number;
  mse: number;
  mae: number;
  r2Score: number;
  trainingTime: number;
}

export interface PredictionResult {
  predicted: number;
  actual?: number;
  confidence: number;
  timestamp: string;
}

export interface ModelConfig {
  modelType: 'linear' | 'neural' | 'ensemble';
  features: string[];
  hyperparameters: Record<string, any>;
  validationSplit: number;
  epochs?: number;
  batchSize?: number;
}