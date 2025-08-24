import React from 'react';
import { BarChart3, TrendingUp, Clock, Activity } from 'lucide-react';
import SentimentOverview from '../components/dashboard/SentimentOverview';
import SectorHeatmap from '../components/dashboard/SectorHeatmap';
import NewsFeed from '../components/dashboard/NewsFeed';

const Dashboard: React.FC = () => {
  const currentTime = new Date();
  
  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Market Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive overview of market sentiment and financial news
              </p>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-6">
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Clock className="h-4 w-4 mr-2" />
                Last Updated
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                <Activity className="h-4 w-4 mr-2" />
                Market Status
              </div>
              <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                Active
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Real-time data
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sentiment Overview Section */}
      <SentimentOverview />
      
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectorHeatmap />
        <NewsFeed />
      </div>
      
      {/* Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sectors</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">News Count</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Positive Sentiment</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">68%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Update Frequency</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">5min</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;