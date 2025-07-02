import Papa from 'papaparse';
import { TrafficData } from '../types/traffic';

export const parseCSVData = (csvText: string): TrafficData[] => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.toLowerCase().trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  return result.data.map((row: any, index: number) => {
    const timestamp = row.timestamp || `${row.date} ${row.time}` || new Date().toISOString();
    const date = new Date(timestamp);
    
    return {
      id: row.id || `parsed-${index}`,
      timestamp,
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5),
      volume: parseInt(row.volume) || 0,
      speed: parseFloat(row.speed) || 0,
      occupancy: parseFloat(row.occupancy) || 0,
      location: row.location || 'Unknown',
      weather: row.weather || 'clear',
      temperature: parseFloat(row.temperature) || undefined,
      visibility: parseFloat(row.visibility) || undefined,
      roadType: row.roadtype || row.road_type || 'highway',
      dayOfWeek: getDayOfWeek(date),
      isHoliday: row.isholiday === 'true' || row.is_holiday === 'true' || false,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      hour: date.getHours(),
      month: date.getMonth() + 1,
      season: getSeason(date.getMonth()),
    };
  });
};

const getDayOfWeek = (date: Date): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const getSeason = (month: number): string => {
  if (month >= 11 || month <= 1) return 'Winter';
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  return 'Fall';
};