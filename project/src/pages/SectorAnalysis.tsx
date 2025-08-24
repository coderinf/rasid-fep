import React, { useEffect, useState } from 'react';
import { fetchSectorSentiment } from '../services/companyService';
import { SectorSentiment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, TrendingUp, TrendingDown, Minus, BarChart3, Activity, Target, Globe, Users, Zap } from 'lucide-react';

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

  // Calculate statistics
  const totalSectors = sectorData.length;
  const positiveSectors = sectorData.filter(s => s.averageSentiment > 0.3).length;
  const negativeSectors = sectorData.filter(s => s.averageSentiment < -0.3).length;
  const neutralSectors = totalSectors - positiveSectors - negativeSectors;
  const averageSentiment = sectorData.reduce((sum, s) => sum + s.averageSentiment, 0) / totalSectors;
  
  return (
    <div className="space-y-6 p-6 bg-slate-950 min-h-screen">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/50 to-indigo-900/50 rounded-2xl shadow-2xl p-8 animate-fade-in border border-blue-800/30">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Sector Analysis
              </h1>
              <p className="text-lg text-blue-200">
                Professional market sentiment analysis across all sectors
              </p>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 flex items-center space-x-4">
            <div className="flex items-center text-blue-300">
              <Filter className="h-5 w-5 mr-2" />
              <span className="text-sm mr-3">Sort by:</span>
            </div>
            
            <div className="flex space-x-1 bg-slate-800/80 rounded-xl p-1 border border-blue-700/50">
              <button
                onClick={() => setSortBy('sentiment')}
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  sortBy === 'sentiment' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-blue-300 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                Sentiment
              </button>
              <button
                onClick={() => setSortBy('volume')}
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  sortBy === 'volume' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-blue-300 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setSortBy('change')}
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                  sortBy === 'change' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-blue-300 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-6 shadow-lg border border-blue-700/40 hover:border-blue-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-300 bg-blue-800/50 px-2 py-1 rounded-full">
              {totalSectors}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalSectors}</div>
          <div className="text-sm text-blue-300">Total Sectors</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-900/60 to-green-900/60 rounded-xl p-6 shadow-lg border border-emerald-700/40 hover:border-emerald-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-300 bg-emerald-800/50 px-2 py-1 rounded-full">
              {positiveSectors > 0 ? `${((positiveSectors / totalSectors) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{positiveSectors}</div>
          <div className="text-sm text-emerald-300">Positive Sectors</div>
        </div>
        
        <div className="bg-gradient-to-br from-amber-900/60 to-yellow-900/60 rounded-xl p-6 shadow-lg border border-amber-700/40 hover:border-amber-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/30 rounded-xl flex items-center justify-center">
              <Minus className="h-6 w-6 text-amber-400" />
            </div>
            <span className="text-xs font-medium text-amber-300 bg-amber-800/50 px-2 py-1 rounded-full">
              {neutralSectors > 0 ? `${((neutralSectors / totalSectors) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{neutralSectors}</div>
          <div className="text-sm text-amber-300">Neutral Sectors</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/60 to-pink-900/60 rounded-xl p-6 shadow-lg border border-red-700/40 hover:border-red-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-xs font-medium text-red-300 bg-red-800/50 px-2 py-1 rounded-full">
              {negativeSectors > 0 ? `${((negativeSectors / totalSectors) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{negativeSectors}</div>
          <div className="text-sm text-red-300">Negative Sectors</div>
        </div>
      </div>
      
      {/* Enhanced Chart Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/30 rounded-xl shadow-lg p-6 animate-fade-in border border-blue-800/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Sector Sentiment Comparison
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
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
                  stroke="#374151" 
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis
                  type="category"
                  dataKey="sector"
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                  height={80}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  type="number"
                  domain={[-1, 1]}
                  tickFormatter={(tick) => tick.toFixed(1)}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: '#374151' }}
                  tickLine={false}
                  label={{ 
                    value: 'Sentiment Score', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 }
                  }}
                />
                <Tooltip
                  formatter={(value: number) => [value.toFixed(3), 'Sentiment Score']}
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff'
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
      <div className="bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/30 rounded-xl shadow-lg p-6 animate-fade-in border border-blue-800/30">
        <h2 className="text-xl font-semibold text-white mb-6">
          Sector Performance
        </h2>
        
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {sortedData.map((sector, index) => (
            <div 
              key={sector.sector} 
              className="bg-slate-800/50 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer border-l-4 border border-blue-700"
              style={{
                borderLeftColor: getBarColor(sector.averageSentiment)
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white text-sm">
                  {sector.sector}
                </h3>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(sector.change)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400">Sentiment:</span>
                  <span className={`ml-2 font-medium ${
                    sector.averageSentiment > 0.3 ? 'text-green-600 dark:text-green-400' :
                    sector.averageSentiment > -0.3 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {sector.averageSentiment.toFixed(3)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Companies:</span>
                  <span className="ml-2 font-medium text-white">
                    {sector.companies}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Volume:</span>
                  <span className="ml-2 font-medium text-white">
                    {sector.volume}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Change:</span>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-900/60 to-green-900/60 rounded-xl p-6 shadow-lg border border-emerald-700/40 hover:border-emerald-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-400">Top Sector</p>
              <p className="text-2xl font-bold text-white">
                {sortedData[0]?.sector || 'N/A'}
              </p>
              <p className="text-sm text-emerald-300">
                Score: {sortedData[0]?.averageSentiment.toFixed(3) || '0.000'}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/30 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-6 shadow-lg border border-blue-700/40 hover:border-blue-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-400">Total Sectors</p>
              <p className="text-2xl font-bold text-white">
                {sortedData.length}
              </p>
              <p className="text-sm text-blue-300">
                Active monitoring
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center">
              <Filter className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/60 to-violet-900/60 rounded-xl p-6 shadow-lg border border-purple-700/40 hover:border-purple-600/60 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-400">Avg Sentiment</p>
              <p className="text-2xl font-bold text-white">
                {(sortedData.reduce((sum, sector) => sum + sector.averageSentiment, 0) / sortedData.length || 0).toFixed(3)}
              </p>
              <p className="text-sm text-purple-300">
                Market overview
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
              <Minus className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorAnalysis;