import React, { useEffect, useState } from 'react';
import { fetchSectorSentiment } from '../services/companyService';
import { SectorSentiment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Filter } from 'lucide-react';

const SectorAnalysis: React.FC = () => {
  const [sortBy, setSortBy] = useState<'sentiment' | 'volume' | 'change'>('sentiment');
  const [sectorData, setSectorData] = useState<SectorSentiment[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchSectorSentiment().then((data) => {
      if (mounted) setSectorData(data);
    });
    return () => {
      mounted = false;
    };
  }, []);
  
  // Sort data based on selected criteria
  const sortedData = [...sectorData].sort((a, b) => {
    if (sortBy === 'sentiment') return b.averageSentiment - a.averageSentiment;
    if (sortBy === 'volume') return b.volume - a.volume;
    return b.change - a.change;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sector Analysis</h1>
        
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">Sort by:</span>
          
          <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
            <button
              onClick={() => setSortBy('sentiment')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                sortBy === 'sentiment' 
                  ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sentiment
            </button>
            <button
              onClick={() => setSortBy('volume')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                sortBy === 'volume' 
                  ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Volume
            </button>
            <button
              onClick={() => setSortBy('change')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                sortBy === 'change' 
                  ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Change
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sector Sentiment Comparison
          </h2>
          
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[-1, 1]}
                  tickFormatter={(tick) => tick.toFixed(1)}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="sector"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={90}
                />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(2), 'Sentiment Score']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                />
                <Bar
                  dataKey="averageSentiment"
                  name="Sentiment Score"
                  fill="#10b981"
                  radius={[4, 4, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sector Sentiment Data
          </h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sentiment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Companies
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
                {sortedData.map((sector) => (
                  <tr key={sector.sector} className="hover:bg-gray-50 dark:hover:bg-neutral-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {sector.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sector.averageSentiment > 0.3 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                        sector.averageSentiment > -0.3 ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {sector.averageSentiment.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`flex items-center ${
                        sector.change > 0 ? 'text-success-500' : 'text-error-500'
                      }`}>
                        {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {sector.volume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {sector.companies}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorAnalysis;