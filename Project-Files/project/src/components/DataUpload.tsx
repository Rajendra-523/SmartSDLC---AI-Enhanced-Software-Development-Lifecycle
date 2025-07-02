import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { TrafficData } from '../types/traffic';
import { parseCSVData } from '../utils/dataParser';

interface DataUploadProps {
  onDataUpdate: (data: TrafficData[]) => void;
}

export const DataUpload: React.FC<DataUploadProps> = ({ onDataUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadedData, setUploadedData] = useState<TrafficData[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      setUploadStatus('error');
      setUploadMessage('Please upload a CSV file');
      return;
    }

    setUploadStatus('uploading');
    setUploadMessage('Processing file...');

    try {
      const text = await file.text();
      const parsedData = parseCSVData(text);
      
      setUploadedData(parsedData);
      onDataUpdate(parsedData);
      setUploadStatus('success');
      setUploadMessage(`Successfully uploaded ${parsedData.length} records`);
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Error parsing CSV file. Please check the format.');
      console.error('Upload error:', error);
    }
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <Upload className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Data Upload</h2>
        <p className="text-gray-600">Upload your traffic data CSV files for analysis</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            isDragging
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gray-100 rounded-full">
                <FileText className="h-12 w-12 text-gray-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop your CSV file here
              </h3>
              <p className="text-gray-600 mb-4">
                or click to browse your files
              </p>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Choose File
              </label>
            </div>
          </div>
        </div>

        {uploadStatus !== 'idle' && (
          <div className={`mt-6 p-4 rounded-lg border ${getStatusColor()}`}>
            <div className="flex items-center space-x-3">
              {getStatusIcon()}
              <span className="font-medium">{uploadMessage}</span>
            </div>
          </div>
        )}

        {uploadedData.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Speed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Occupancy
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {uploadedData.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(row.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.speed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.occupancy}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {uploadedData.length > 5 && (
              <p className="mt-4 text-sm text-gray-600">
                Showing first 5 rows of {uploadedData.length} total records
              </p>
            )}
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Expected CSV Format</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>Your CSV file should contain the following columns:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li><strong>timestamp</strong> - Date and time (YYYY-MM-DD HH:MM:SS)</li>
            <li><strong>location</strong> - Location identifier or name</li>
            <li><strong>volume</strong> - Number of vehicles</li>
            <li><strong>speed</strong> - Average speed in mph</li>
            <li><strong>occupancy</strong> - Road occupancy percentage</li>
            <li><strong>weather</strong> - Weather conditions (optional)</li>
            <li><strong>temperature</strong> - Temperature in Fahrenheit (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};