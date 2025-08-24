import React, { useEffect, useState } from 'react';
import { fetchSectorSentiment } from '../../services/companyService';
import { SectorSentiment } from '../../types';
import { TrendingUp, TrendingDown, Minus, Users, Activity, BarChart3, Globe, Target } from 'lucide-react';

const SectorHeatmap: React.FC = () => {
  const [sectorData, setSectorData] = useState<SectorSentiment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchSectorSentiment().then((data) => {
      setSectorData(data);
      setIsLoading(false);
    });
  }, []);

  const getSentimentColor = (score: number): string => {
    if (score > 0.6) return 'from-emerald-500 to-green-500';
    if (score > 0.2) return 'from-green-400 to-emerald-400';
    if (score > -0.2) return 'from-gray-400 to-gray-500';
    if (score > -0.6) return 'from-red-400 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  const getSentimentTextColor = (score: number): string => {
    if (score > 0.6) return 'text-emerald-400';
    if (score > 0.2) return 'text-green-400';
    if (score > -0.2) return 'text-gray-400';
    if (score > -0.6) return 'text-red-400';
    return 'text-red-400';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <TrendingUp className="h-4 w-4" />;
    if (score < -0.2) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getSentimentLabel = (score: number): string => {
    if (score > 0.6) return 'Very Positive';
    if (score > 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.6) return 'Negative';
    return 'Very Negative';
  };

  // Calculate statistics
  const totalSectors = sectorData.length;
  const positiveSectors = sectorData.filter(s => s.averageSentiment > 0.2).length;
  const negativeSectors = sectorData.filter(s => s.averageSentiment < -0.2).length;
  const neutralSectors = totalSectors - positiveSectors - negativeSectors;

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sector Heatmap</h2>
            <p className="text-gray-400">Market sector sentiment analysis and performance</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-700">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sector Heatmap</h2>
            <p className="text-gray-400">Market sector sentiment analysis and performance</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-400">{totalSectors}</div>
          <div className="text-sm text-gray-400">Active Sectors</div>
        </div>
      </div>

      {/* Sector Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 border border-green-700/30">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-6 w-6 text-green-400" />
            <span className="text-xs font-medium text-green-300 bg-green-900/50 px-2 py-1 rounded-full">
              {positiveSectors > 0 ? `${((positiveSectors / totalSectors) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{positiveSectors}</div>
          <div className="text-sm text-green-300">Positive Sectors</div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-700/30">
          <div className="flex items-center justify-between mb-3">
            <Minus className="h-6 w-6 text-gray-400" />
            <span className="text-xs font-medium text-gray-300 bg-gray-900/50 px-2 py-1 rounded-full">
              {neutralSectors > 0 ? `${((neutralSectors / totalSectors) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{neutralSectors}</div>
          <div className="text-sm text-gray-300">Neutral Sectors</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 rounded-xl p-6 border border-red-700/30">
          <div className="flex items-center justify-between mb-3">
            <TrendingDown className="h-6 w-6 text-red-400" />
            <span className="text-xs font-medium text-red-300 bg-red-900/50 px-2 py-1 rounded-full">
              {negativeSectors > 0 ? `${((negativeSectors / totalSectors) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{negativeSectors}</div>
          <div className="text-sm text-red-300">Negative Sectors</div>
        </div>
      </div>

      {/* Enhanced Sector Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {sectorData.map((sector, index) => (
          <div
            key={sector.sector}
                            className="group relative overflow-hidden rounded-xl border border-gray-700 p-4 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in bg-gray-800/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Sentiment Indicator Bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getSentimentColor(sector.averageSentiment)}`}></div>
            
            {/* Content */}
            <div className="ml-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
                  {sector.sector}
                </h3>
                <div className="flex-shrink-0">
                  {getSentimentIcon(sector.averageSentiment)}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                                          <span className="text-gray-400">Sentiment</span>
                  <span className={`font-semibold ${getSentimentTextColor(sector.averageSentiment)}`}>
                    {sector.averageSentiment.toFixed(2)}
                  </span>
                </div>
                
                                 <div className="flex items-center justify-between text-xs">
                                           <span className="text-gray-400">Companies</span>
                        <div className="flex items-center text-gray-300">
                     <Users className="h-3 w-3 mr-1" />
                     <span className="font-semibold">{sector.companies}</span>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-between text-xs">
                                           <span className="text-gray-400">Volume</span>
                        <div className="flex items-center text-gray-300">
                     <Activity className="h-3 w-3 mr-1" />
                     <span className="font-semibold">{sector.volume.toLocaleString()}</span>
                   </div>
                 </div>
              </div>
              
              {/* Sentiment Badge */}
              <div className="mt-3">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getSentimentColor(sector.averageSentiment)} text-white shadow-sm`}>
                  {getSentimentLabel(sector.averageSentiment)}
                </span>
              </div>
              
              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Legend */}
              <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2 text-purple-400" />
          Sentiment Scale & Distribution
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentiment Scale */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Sentiment Scale</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Very Positive</span>
                <div className="w-16 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                <span className="text-xs text-emerald-400">0.6+</span>
              </div>
              <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Positive</span>
                <div className="w-16 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
                <span className="text-xs text-green-400">0.2+</span>
              </div>
              <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Neutral</span>
                <div className="w-16 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full"></div>
                <span className="text-xs text-gray-400">±0.2</span>
              </div>
              <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Negative</span>
                <div className="w-16 h-2 bg-gradient-to-r from-red-400 to-red-500 rounded-full"></div>
                <span className="text-xs text-red-400">-0.2-</span>
              </div>
              <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-400">Very Negative</span>
                <div className="w-16 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                <span className="text-xs text-red-400">-0.6-</span>
              </div>
            </div>
          </div>
          
          {/* Distribution */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Market Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Positive Sectors</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-white font-semibold">{positiveSectors}</span>
                  <span className="text-xs text-gray-400">({positiveSectors > 0 ? ((positiveSectors / totalSectors) * 100).toFixed(0) : 0}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Neutral Sectors</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm text-white font-semibold">{neutralSectors}</span>
                  <span className="text-xs text-gray-400">({neutralSectors > 0 ? ((neutralSectors / totalSectors) * 100).toFixed(0) : 0}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Negative Sectors</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-white font-semibold">{negativeSectors}</span>
                  <span className="text-xs text-neutral-400">({negativeSectors > 0 ? ((negativeSectors / totalSectors) * 100).toFixed(0) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorHeatmap;