import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DataUpload } from './components/DataUpload';
import { ModelTraining } from './components/ModelTraining';
import { Predictions } from './components/Predictions';
import { Analytics } from './components/Analytics';
import { TrafficData } from './types/traffic';
import { loadTrafficData } from './utils/dataLoader';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const data = await loadTrafficData();
        setTrafficData(data);
      } catch (error) {
        console.error('Error loading traffic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleDataUpdate = (newData: TrafficData[]) => {
    setTrafficData(newData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TrafficTelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard trafficData={trafficData} />
        )}
        {activeTab === 'upload' && (
          <DataUpload onDataUpdate={handleDataUpdate} />
        )}
        {activeTab === 'training' && (
          <ModelTraining trafficData={trafficData} />
        )}
        {activeTab === 'predictions' && (
          <Predictions trafficData={trafficData} />
        )}
        {activeTab === 'analytics' && (
          <Analytics trafficData={trafficData} />
        )}
      </main>
    </div>
  );
}

export default App;