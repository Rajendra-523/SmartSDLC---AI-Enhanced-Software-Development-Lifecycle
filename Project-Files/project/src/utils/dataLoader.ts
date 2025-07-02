import { TrafficData } from '../types/traffic';

// Sample traffic data for demonstration
const generateSampleData = (): TrafficData[] => {
  const data: TrafficData[] = [];
  const locations = ['Highway 101', 'Interstate 5', 'Route 280', 'Highway 85', 'Interstate 880'];
  const weatherConditions = ['clear', 'cloudy', 'rain', 'fog'];
  
  const now = new Date();
  
  for (let i = 0; i < 1000; i++) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000)); // Every hour going back
    const hour = timestamp.getHours();
    const dayOfWeek = timestamp.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Create realistic traffic patterns
    let baseVolume = 50;
    if (hour >= 7 && hour <= 9) baseVolume = 120; // Morning rush
    else if (hour >= 17 && hour <= 19) baseVolume = 110; // Evening rush
    else if (hour >= 10 && hour <= 16) baseVolume = 80; // Daytime
    else if (hour >= 22 || hour <= 5) baseVolume = 20; // Night
    
    // Weekend adjustment
    if (isWeekend) baseVolume *= 0.7;
    
    const volume = Math.round(baseVolume + (Math.random() - 0.5) * 30);
    const speed = Math.round(65 - (volume / 150) * 30 + (Math.random() - 0.5) * 10);
    const occupancy = Math.round((volume / 150) * 100 + (Math.random() - 0.5) * 20);
    
    data.push({
      id: `traffic-${i}`,
      timestamp: timestamp.toISOString(),
      date: timestamp.toISOString().split('T')[0],
      time: timestamp.toTimeString().slice(0, 5),
      volume: Math.max(0, volume),
      speed: Math.max(25, Math.min(80, speed)),
      occupancy: Math.max(0, Math.min(100, occupancy)),
      location: locations[Math.floor(Math.random() * locations.length)],
      weather: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      temperature: Math.round(60 + (Math.random() - 0.5) * 40),
      visibility: Math.round(8 + Math.random() * 2),
      roadType: 'highway',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
      isHoliday: Math.random() < 0.05,
      isWeekend,
      hour,
      month: timestamp.getMonth() + 1,
      season: getSeason(timestamp.getMonth()),
    });
  }
  
  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

const getSeason = (month: number): string => {
  if (month >= 11 || month <= 1) return 'Winter';
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  return 'Fall';
};

export const loadTrafficData = async (): Promise<TrafficData[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would fetch from your API or load from uploaded files
  return generateSampleData();
};