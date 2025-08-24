import React, { useEffect, useState } from 'react';
import { fetchSectorSentiment } from '../services/companyService';
import { SectorSentiment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const SectorAnalysis: React.FC = () => {
  const [sortBy, setSortBy] = useState<'sentiment' | 'volume' | 'change'>('sentiment');
  const [sectorData, setSectorData] = useState<SectorSentiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchSectorSentiment().then((data) => {
      if (mounted) {
        setSectorData(data);
        setIsLoading(false);
      }
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

  // Generate colors for bars based on sentiment
  const getBarColor = (sentiment: number) => {
    if (sentiment > 0.3) return '#10b981'; // Green for positive
    if (sentiment > -0.3) return '#f59e0b'; // Yellow for neutral
    return '#ef4444'; // Red for negative
  };

  // Get sentiment trend icon
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };
  
  return (
    <div className="space-y-6 p-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Sector Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive analysis of market sentiment across different sectors
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center">
            <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">Sort by:</span>
            
            <div className="flex space-x-1 bg-white dark:bg-neutral-700 rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setSortBy('sentiment')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  sortBy === 'sentiment' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-600'
                }`}
              >
                Sentiment
              </button>
              <button
                onClick={() => setSortBy('volume')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  sortBy === 'volume' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-600'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setSortBy('change')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  sortBy === 'change' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-600'
                }`}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Enhanced Chart Section */}
        <div className="xl:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 animate-fade-in border border-gray-100 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sector Sentiment Comparison
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Positive</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span>Neutral</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span>Negative</span>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData}
                  layout="horizontal"
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  barGap={8}
                >
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e5e7eb" 
                    opacity={0.3}
                    vertical={false}
                  />
                  <XAxis
                    type="category"
                    dataKey="sector"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    height={80}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis
                    type="number"
                    domain={[-1, 1]}
                    tickFormatter={(tick) => tick.toFixed(1)}
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ 
                      value: 'Sentiment Score', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(3), 'Sentiment Score']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.75rem',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Bar
                    dataKey="averageSentiment"
                    name="Sentiment Score"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {sortedData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getBarColor(entry.averageSentiment)}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        
        {/* Enhanced Data Table Section */}
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 animate-fade-in border border-gray-100 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Sector Performance
          </h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
            {sortedData.map((sector, index) => (
              <div 
                key={sector.sector} 
                className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer border-l-4"
                style={{
                  borderLeftColor: getBarColor(sector.averageSentiment)
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {sector.sector}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(sector.change)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Sentiment:</span>
                    <span className={`ml-2 font-medium ${
                      sector.averageSentiment > 0.3 ? 'text-green-600 dark:text-green-400' :
                      sector.averageSentiment > -0.3 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-red-600 dark:text-red-400'
                    }`}>
                      {sector.averageSentiment.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Companies:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {sector.companies}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Volume:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {sector.volume}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Change:</span>
                    <span className={`ml-2 font-medium ${
                      sector.change > 0 ? 'text-green-600 dark:text-green-400' : 
                      sector.change < 0 ? 'text-red-600 dark:text-red-400' : 
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 shadow-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Top Sector</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {sortedData[0]?.sector || 'N/A'}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Score: {sortedData[0]?.averageSentiment.toFixed(3) || '0.000'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Sectors</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {sortedData.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Active monitoring
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
              <Filter className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Avg Sentiment</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {(sortedData.reduce((sum, sector) => sum + sector.averageSentiment, 0) / sortedData.length || 0).toFixed(3)}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Market overview
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <Minus className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorAnalysis;