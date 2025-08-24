import React, { useEffect, useState } from 'react';
import { fetchSectorSentiment } from '../../services/companyService';
import { TrendingUp, TrendingDown, BarChart3, Users, Activity } from 'lucide-react';

const SectorHeatmap: React.FC = () => {
  const [sectorData, setSectorData] = useState<any[]>([]);
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
    return () => { mounted = false; };
  }, []);
  
  // Sort sectors by sentiment
  const sortedSectors = [...sectorData].sort((a, b) => b.averageSentiment - a.averageSentiment);
  
  const getSentimentColor = (score: number): string => {
    // Enhanced gradient with better color transitions
    if (score > 0.6) return 'from-emerald-500 to-green-500';
    if (score > 0.3) return 'from-green-400 to-emerald-400';
    if (score > 0.1) return 'from-green-300 to-green-400';
    if (score > -0.1) return 'from-gray-400 to-gray-500';
    if (score > -0.3) return 'from-red-300 to-red-400';
    if (score > -0.5) return 'from-red-400 to-red-500';
    return 'from-red-500 to-pink-500';
  };
  
  const getSentimentTextColor = (score: number): string => {
    if (score > 0.3 || score < -0.3) return 'text-white';
    return 'text-gray-900 dark:text-white';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <TrendingUp className="h-4 w-4 text-green-100" />;
    if (score < -0.2) return <TrendingDown className="h-4 w-4 text-red-100" />;
    return <Activity className="h-4 w-4 text-gray-100" />;
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 animate-fade-in border border-gray-100 dark:border-neutral-700">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Sector Sentiment Heatmap
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Market sentiment across different sectors
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {sectorData.length}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Active Sectors</div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Enhanced Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {sortedSectors.map((sector, index) => (
              <div 
                key={sector.sector}
                className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${getSentimentColor(sector.averageSentiment)} ${getSentimentTextColor(sector.averageSentiment)} transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group`}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-16 h-16 transform rotate-45 translate-x-8 -translate-y-8 bg-white rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 transform rotate-45 -translate-x-4 translate-y-4 bg-white rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-sm leading-tight">{sector.sector}</h3>
                    {getSentimentIcon(sector.averageSentiment)}
                  </div>
                  
                  <div className="text-2xl font-bold mb-2 drop-shadow-sm">
                    {sector.averageSentiment.toFixed(2)}
                  </div>
                  
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs opacity-90">
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {sector.companies}
                      </span>
                      <span className="font-medium">companies</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs opacity-90">
                      <span className="flex items-center">
                        <Activity className="h-3 w-3 mr-1" />
                        {sector.volume}
                      </span>
                      <span className="font-medium">volume</span>
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
              </div>
            ))}
          </div>
          
          {/* Enhanced Legend */}
          <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Sentiment Scale
              </h4>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Red = Negative • Green = Positive
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-1">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Negative</span>
              <div className="flex space-x-0.5">
                <div className="w-6 h-3 bg-gradient-to-r from-red-500 to-red-400 rounded-l-full"></div>
                <div className="w-6 h-3 bg-gradient-to-r from-red-400 to-red-300"></div>
                <div className="w-6 h-3 bg-gradient-to-r from-red-300 to-gray-400"></div>
                <div className="w-6 h-3 bg-gradient-to-r from-gray-400 to-gray-500"></div>
                <div className="w-6 h-3 bg-gradient-to-r from-gray-500 to-green-300"></div>
                <div className="w-6 h-3 bg-gradient-to-r from-green-300 to-green-400"></div>
                <div className="w-6 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-r-full"></div>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Positive</span>
            </div>
            
            {/* Sentiment Distribution */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-red-600 dark:text-red-400 font-semibold">
                  {sectorData.filter(s => s.averageSentiment < -0.2).length}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Negative</div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 dark:text-gray-400 font-semibold">
                  {sectorData.filter(s => s.averageSentiment >= -0.2 && s.averageSentiment <= 0.2).length}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 dark:text-green-400 font-semibold">
                  {sectorData.filter(s => s.averageSentiment > 0.2).length}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Positive</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SectorHeatmap;