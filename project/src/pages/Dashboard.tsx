import React from 'react';
import SentimentOverview from '../components/dashboard/SentimentOverview';
import SectorHeatmap from '../components/dashboard/SectorHeatmap';
import NewsFeed from '../components/dashboard/NewsFeed';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
      
      <SentimentOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorHeatmap />
        <NewsFeed />
      </div>
    </div>
  );
};

export default Dashboard;