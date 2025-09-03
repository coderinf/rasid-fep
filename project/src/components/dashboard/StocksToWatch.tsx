import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Star, Eye, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { companies, getCompanySentiment } from '../../data/mockData';
import { Company, SentimentData } from '../../types';

interface StockWatchItem {
  company: Company;
  currentSentiment: number;
  previousSentiment: number;
  sentimentChange: number;
  volume: number;
  trend: 'up' | 'down' | 'stable';
  watchlist: boolean;
}

const StocksToWatch: React.FC = () => {
  const [stocksToWatch, setStocksToWatch] = useState<StockWatchItem[]>([]);
  const [activeTab, setActiveTab] = useState<'trending' | 'gainers' | 'losers'>('trending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateStocksData = () => {
      const stocksData: StockWatchItem[] = companies.map(company => {
        const sentimentData = getCompanySentiment(company.id, 7); // Last 7 days
        const currentSentiment = sentimentData[0]?.score || 0;
        const previousSentiment = sentimentData[6]?.score || 0;
        const sentimentChange = currentSentiment - previousSentiment;
        const volume = sentimentData[0]?.volume || 0;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (sentimentChange > 0.1) trend = 'up';
        else if (sentimentChange < -0.1) trend = 'down';

        return {
          company,
          currentSentiment,
          previousSentiment,
          sentimentChange,
          volume,
          trend,
          watchlist: Math.random() > 0.7 // Random watchlist status
        };
      });

      // Sort by different criteria based on active tab
      const sortedData = [...stocksData].sort((a, b) => {
        switch (activeTab) {
          case 'trending':
            return Math.abs(b.sentimentChange) - Math.abs(a.sentimentChange);
          case 'gainers':
            return b.sentimentChange - a.sentimentChange;
          case 'losers':
            return a.sentimentChange - b.sentimentChange;
          default:
            return 0;
        }
      });

      setStocksToWatch(sortedData);
      setLoading(false);
    };

    generateStocksData();
  }, [activeTab]);

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.3) return 'text-green-400';
    if (sentiment < -0.3) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getSentimentIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-green-400" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-red-400" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.5) return 'Very Positive';
    if (sentiment > 0.2) return 'Positive';
    if (sentiment > -0.2) return 'Neutral';
    if (sentiment > -0.5) return 'Negative';
    return 'Very Negative';
  };

  const formatPercentage = (value: number) => {
    const percentage = (value * 100).toFixed(1);
    return `${value >= 0 ? '+' : ''}${percentage}%`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Stocks to Watch</h2>
            <p className="text-gray-400">Top stocks with significant sentiment changes</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'trending'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'gainers'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <ArrowUpRight className="h-4 w-4 inline mr-2" />
            Top Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'losers'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <ArrowDownRight className="h-4 w-4 inline mr-2" />
            Top Losers
          </button>
        </div>
      </div>

      {/* Stocks List */}
      <div className="space-y-4">
        {stocksToWatch.slice(0, 6).map((stock, index) => (
          <div
            key={stock.company.id}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-102 group"
          >
            <div className="flex items-center justify-between">
              {/* Company Info */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {stock.company.ticker}
                  </div>
                  {stock.watchlist && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {stock.company.name}
                    </h3>
                    {stock.trend === 'up' && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    )}
                    {stock.trend === 'down' && (
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{stock.company.sector}</p>
                </div>
              </div>

              {/* Sentiment Data */}
              <div className="flex items-center space-x-6">
                {/* Current Sentiment */}
                <div className="text-center">
                  <div className={`text-lg font-bold ${getSentimentColor(stock.currentSentiment)}`}>
                    {formatPercentage(stock.currentSentiment)}
                  </div>
                  <div className="text-xs text-gray-400">Current</div>
                </div>

                {/* Change */}
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    {getSentimentIcon(stock.trend)}
                    <span className={`text-sm font-semibold ${
                      stock.sentimentChange > 0 ? 'text-green-400' : 
                      stock.sentimentChange < 0 ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {formatPercentage(stock.sentimentChange)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">Change</div>
                </div>

                {/* Volume */}
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{stock.volume}</div>
                  <div className="text-xs text-gray-400">Mentions</div>
                </div>

                {/* Sentiment Label */}
                <div className="text-center min-w-[100px]">
                  <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                    stock.currentSentiment > 0.3 ? 'bg-green-500/20 text-green-400' :
                    stock.currentSentiment < -0.3 ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {getSentimentLabel(stock.currentSentiment)}
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-10 h-10 bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-all duration-200">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Sentiment Range</span>
                <span>{formatPercentage(stock.currentSentiment)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stock.currentSentiment > 0.3 ? 'bg-green-500' :
                    stock.currentSentiment < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{
                    width: `${Math.abs(stock.currentSentiment) * 100}%`,
                    marginLeft: stock.currentSentiment < 0 ? 'auto' : '0'
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Positive Sentiment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <span>Negative Sentiment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Neutral Sentiment</span>
            </div>
          </div>
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            View All Stocks →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StocksToWatch;
