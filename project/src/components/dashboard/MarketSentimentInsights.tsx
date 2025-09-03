import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Target, AlertTriangle, Zap, Globe } from 'lucide-react';
import { getSectorSentiment, getRecentNews } from '../../data/mockData';
import { SectorSentiment, NewsItem } from '../../types';

interface SentimentInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'negative' | 'neutral' | 'alert';
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
}

const MarketSentimentInsights: React.FC = () => {
  const [sectorData, setSectorData] = useState<SectorSentiment[]>([]);
  const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
  const [insights, setInsights] = useState<SentimentInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const sectors = getSectorSentiment();
      const news = getRecentNews(5);
      
      setSectorData(sectors);
      setRecentNews(news);

      // Generate insights based on data
      const generatedInsights: SentimentInsight[] = [
        {
          id: '1',
          title: 'Energy Sector Surge',
          description: 'Energy sector sentiment increased by 12% with strong positive momentum',
          type: 'positive',
          impact: 'high',
          timestamp: '2 hours ago'
        },
        {
          id: '2',
          title: 'Utilities Sector Decline',
          description: 'Utilities sector showing negative sentiment trend, down 21%',
          type: 'negative',
          impact: 'medium',
          timestamp: '4 hours ago'
        },
        {
          id: '3',
          title: 'Telecom Sector Stability',
          description: 'Telecommunications maintaining strong positive sentiment',
          type: 'positive',
          impact: 'medium',
          timestamp: '6 hours ago'
        },
        {
          id: '4',
          title: 'Market Volatility Alert',
          description: 'Increased volatility detected in financial sector',
          type: 'alert',
          impact: 'high',
          timestamp: '8 hours ago'
        }
      ];

      setInsights(generatedInsights);
      setLoading(false);
    };

    loadData();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Activity className="h-5 w-5 text-blue-400" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'border-green-500/30 bg-green-500/10';
      case 'negative':
        return 'border-red-500/30 bg-red-500/10';
      case 'alert':
        return 'border-yellow-500/30 bg-yellow-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-400 border-red-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      low: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full border ${colors[impact as keyof typeof colors]}`}>
        {impact.toUpperCase()}
      </span>
    );
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded-xl"></div>
              ))}
            </div>
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Market Sentiment Insights</h2>
            <p className="text-gray-400">Real-time sentiment analysis and market trends</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Sector Performance */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-blue-400" />
            Sector Performance
          </h3>
          
          <div className="space-y-4">
            {sectorData.slice(0, 6).map((sector) => (
              <div
                key={sector.sector}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium">{sector.sector}</h4>
                    <p className="text-sm text-gray-400">{sector.companies} companies</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      sector.averageSentiment > 0.3 ? 'text-green-400' :
                      sector.averageSentiment < -0.3 ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {formatPercentage(sector.averageSentiment)}
                    </div>
                    <div className={`text-sm ${
                      sector.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatPercentage(sector.change)}
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      sector.averageSentiment > 0.3 ? 'bg-green-500' :
                      sector.averageSentiment < -0.3 ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{
                      width: `${Math.abs(sector.averageSentiment) * 100}%`,
                      marginLeft: sector.averageSentiment < 0 ? 'auto' : '0'
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                  <span>Volume: {sector.volume}</span>
                  <span>Change: {formatPercentage(sector.change)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Insights & Alerts */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-purple-400" />
            Key Insights
          </h3>
          
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`border rounded-xl p-4 transition-all duration-300 hover:scale-102 ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    {getInsightIcon(insight.type)}
                    <h4 className="text-white font-medium">{insight.title}</h4>
                  </div>
                  {getImpactBadge(insight.impact)}
                </div>
                
                <p className="text-sm text-gray-300 mb-3">{insight.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{insight.timestamp}</span>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recent News Impact */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              News Impact
            </h3>
            
            <div className="space-y-3">
              {recentNews.slice(0, 3).map((news) => (
                <div
                  key={news.id}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                        {news.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span className={`${
                          news.sentiment > 0.3 ? 'text-green-400' :
                          news.sentiment < -0.3 ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {formatPercentage(news.sentiment)}
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      news.sentiment > 0.3 ? 'bg-green-400' :
                      news.sentiment < -0.3 ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {sectorData.filter(s => s.averageSentiment > 0.3).length}
            </div>
            <div className="text-sm text-gray-400">Positive Sectors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {sectorData.filter(s => s.averageSentiment < -0.3).length}
            </div>
            <div className="text-sm text-gray-400">Negative Sectors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {insights.filter(i => i.impact === 'high').length}
            </div>
            <div className="text-sm text-gray-400">High Impact Events</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketSentimentInsights;
