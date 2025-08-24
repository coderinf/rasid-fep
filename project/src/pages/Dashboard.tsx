import React from 'react';
import { BarChart3, TrendingUp, Globe, Users, Zap, Target, Activity, TrendingDown } from 'lucide-react';
import SentimentOverview from '../components/dashboard/SentimentOverview';
import SectorHeatmap from '../components/dashboard/SectorHeatmap';
import NewsFeed from '../components/dashboard/NewsFeed';

const Dashboard: React.FC = () => {
  const currentTime = new Date();
  
  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-900">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Market Dashboard
              </h1>
              <p className="text-lg text-gray-300">
                Comprehensive overview of market sentiment and financial insights
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
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 shadow-lg border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xs font-medium text-blue-300 bg-blue-900/50 px-2 py-1 rounded-full">+15%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">68%</div>
          <div className="text-sm text-blue-300">Positive Sentiment</div>
          <div className="mt-3 text-xs text-blue-400">Market confidence rising</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 shadow-lg border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Globe className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">+8%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">24</div>
          <div className="text-sm text-purple-300">Active Sectors</div>
          <div className="mt-3 text-xs text-purple-400">Diversified coverage</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 rounded-xl p-6 shadow-lg border border-green-700/30 hover:border-green-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-xs font-medium text-green-300 bg-green-900/50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">156</div>
          <div className="text-sm text-green-300">Companies</div>
          <div className="mt-3 text-xs text-green-400">Active monitoring</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 rounded-xl p-6 shadow-lg border border-orange-700/30 hover:border-orange-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-400" />
            </div>
            <span className="text-xs font-medium text-orange-300 bg-orange-900/50 px-2 py-1 rounded-full">Live</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">5min</div>
          <div className="text-sm text-orange-300">Update Frequency</div>
          <div className="mt-3 text-xs text-orange-400">Real-time data</div>
        </div>
      </div>
      
      {/* Sentiment Overview Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Market Sentiment Overview</h2>
            <p className="text-gray-400">Top performing stocks and market sentiment trends</p>
          </div>
        </div>
        <SentimentOverview />
      </div>
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectorHeatmap />
        <NewsFeed />
      </div>
      
      {/* Market Insights Footer */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Market Insights</h2>
            <p className="text-gray-400">Key market indicators and trends</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
              Bullish Indicators
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Positive Sectors</span>
                <span className="text-green-400 font-semibold">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Rising Sentiment</span>
                <span className="text-green-400 font-semibold">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Momentum</span>
                <span className="text-green-400 font-semibold">Strong</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingDown className="h-5 w-5 mr-2 text-red-400" />
              Bearish Indicators
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Negative Sectors</span>
                <span className="text-red-400 font-semibold">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Falling Sentiment</span>
                <span className="text-red-400 font-semibold">-8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Risk Level</span>
                <span className="text-yellow-400 font-semibold">Moderate</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-400" />
              Market Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Trend</span>
                <span className="text-blue-400 font-semibold">↗️ Bullish</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volatility</span>
                <span className="text-white font-semibold">Medium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Confidence</span>
                <span className="text-white font-semibold">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

