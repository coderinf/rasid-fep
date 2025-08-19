import React, { useEffect, useState } from 'react';
import { fetchSectorSentiment } from '../../services/companyService';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SectorHeatmap: React.FC = () => {
  const [sectorData, setSectorData] = useState<any[]>([]);
  
  useEffect(() => {
    let mounted = true;
    fetchSectorSentiment().then((data) => {
      if (mounted) setSectorData(data);
    });
    return () => { mounted = false; };
  }, []);
  
  // Sort sectors by sentiment
  const sortedSectors = [...sectorData].sort((a, b) => b.averageSentiment - a.averageSentiment);
  
  const getSentimentColor = (score: number): string => {
    // Create a gradient from red (negative) to green (positive)
    if (score > 0.5) return 'bg-green-500';
    if (score > 0.3) return 'bg-green-400';
    if (score > 0.1) return 'bg-green-300';
    if (score > -0.1) return 'bg-gray-300';
    if (score > -0.3) return 'bg-red-300';
    if (score > -0.5) return 'bg-red-400';
    return 'bg-red-500';
  };
  
  const getSentimentTextColor = (score: number): string => {
    if (score > 0.3 || score < -0.3) return 'text-white';
    return 'text-gray-900';
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Sector Sentiment Heatmap
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {sortedSectors.map((sector) => (
          <div 
            key={sector.sector}
            className={`rounded-lg p-3 ${getSentimentColor(sector.averageSentiment)} ${getSentimentTextColor(sector.averageSentiment)} transition-transform hover:scale-105 cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold">{sector.sector}</h3>
              {sector.change > 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="text-xl font-bold mb-1">{sector.averageSentiment.toFixed(2)}</div>
            <div className="flex justify-between items-center text-xs">
              <span>Volume: {sector.volume}</span>
              <span>{sector.companies} companies</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Negative</span>
          <div className="flex space-x-0.5">
            <div className="w-5 h-4 bg-red-500 rounded-l"></div>
            <div className="w-5 h-4 bg-red-400"></div>
            <div className="w-5 h-4 bg-red-300"></div>
            <div className="w-5 h-4 bg-gray-300"></div>
            <div className="w-5 h-4 bg-green-300"></div>
            <div className="w-5 h-4 bg-green-400"></div>
            <div className="w-5 h-4 bg-green-500 rounded-r"></div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">Positive</span>
        </div>
      </div>
    </div>
  );
};

export default SectorHeatmap;