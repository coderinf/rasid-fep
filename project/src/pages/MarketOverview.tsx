import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Globe, Users, Zap, Target, Activity, TrendingDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import StocksToWatch from '../components/dashboard/StocksToWatch';
import MarketSentimentInsights from '../components/dashboard/MarketSentimentInsights';
import { fetchMarketOverviewStats } from '../services/companyService';

const MarketOverview: React.FC = () => {
  const currentTime = new Date();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketOverviewStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              to="/"
              className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </Link>
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Market Overview
              </h1>
              <p className="text-lg text-gray-300">
                Comprehensive market analysis and stocks to watch
              </p>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 flex items-center space-x-8">
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-400 mb-1">
                <Globe className="h-4 w-4 mr-2" />
                Last Updated
              </div>
              <div className="text-xl font-semibold text-white">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-400">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-400 mb-1">
                <Activity className="h-4 w-4 mr-2" />
                Market Status
              </div>
              <div className="text-xl font-semibold text-green-400">
                Active
              </div>
              <div className="text-sm text-gray-400">
                Real-time data
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 rounded-xl p-6 shadow-lg border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded-full">
              {stats ? `${(stats.sentimentChange * 100).toFixed(1)}%` : '--'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats ? stats.totalStocks : '--'}
          </div>
          <div className="text-sm text-emerald-300">Stocks Monitored</div>
          <div className="mt-3 text-xs text-emerald-400">Active tracking</div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-300 bg-blue-900/50 px-2 py-1 rounded-full">
              {stats ? `${stats.activeSectors}` : '--'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats ? stats.activeSectors : '--'}
          </div>
          <div className="text-sm text-blue-300">Active Sectors</div>
          <div className="mt-3 text-xs text-blue-400">Market coverage</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 shadow-lg border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
              {stats ? `+${(stats.overallSentiment * 100).toFixed(1)}%` : '--'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats ? stats.positiveStocks : '--'}
          </div>
          <div className="text-sm text-purple-300">Positive Stocks</div>
          <div className="mt-3 text-xs text-purple-400">Market sentiment</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 rounded-xl p-6 shadow-lg border border-orange-700/30 hover:border-orange-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-xs font-medium text-orange-300 bg-orange-900/50 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats ? stats.negativeStocks : '--'}
          </div>
          <div className="text-sm text-orange-300">Negative Stocks</div>
          <div className="mt-3 text-xs text-orange-400">Real-time data</div>
        </div>
      </div>
      
      {/* Main Market Overview Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <StocksToWatch />
        <MarketSentimentInsights />
      </div>
      
      {/* Market Summary Footer */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Market Summary</h2>
            <p className="text-gray-400">Key market indicators and performance metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Market Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Positive Stocks</span>
                <span className="text-green-400 font-semibold">124</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Negative Stocks</span>
                <span className="text-red-400 font-semibold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Neutral</span>
                <span className="text-yellow-400 font-semibold">45</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Sector Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Top Sector</span>
                <span className="text-blue-400 font-semibold">Energy</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Bottom Sector</span>
                <span className="text-red-400 font-semibold">Utilities</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Most Active</span>
                <span className="text-purple-400 font-semibold">Financials</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-400" />
              Sentiment Trends
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Sentiment</span>
                <span className="text-green-400 font-semibold">+0.42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Change (24h)</span>
                <span className="text-blue-400 font-semibold">+0.08</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volatility</span>
                <span className="text-yellow-400 font-semibold">Medium</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-orange-400" />
              Market Alerts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">High Impact</span>
                <span className="text-red-400 font-semibold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Medium Impact</span>
                <span className="text-yellow-400 font-semibold">7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Low Impact</span>
                <span className="text-green-400 font-semibold">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
