import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Briefcase, Settings, FileText, Home, TrendingUp, Database } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700">
      <div className="p-4 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-primary-500" />
          <span className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">Tadāwul Insights</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sentiment Analysis Platform</p>
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        <NavLink
          to="/"
          className={({isActive}) => `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          <Home className="mr-3 h-5 w-5" />
          Dashboard
        </NavLink>

        <NavLink
          to="/company/2222"
          className={({isActive}) => `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          <Briefcase className="mr-3 h-5 w-5" />
          Companies
        </NavLink>

        <NavLink
          to="/sector-analysis"
          className={({isActive}) => `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          <BarChart2 className="mr-3 h-5 w-5" />
          Sector Analysis
        </NavLink>

        <NavLink
          to="/news-monitor"
          className={({isActive}) => `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
            isActive 
              ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
          }`}
        >
          <FileText className="mr-3 h-5 w-5" />
          News Monitor
        </NavLink>

        <div className="pt-4 border-t border-gray-200 dark:border-neutral-700 mt-4">
          <h3 className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Settings
          </h3>
          
          <NavLink
            to="/settings"
            className={({isActive}) => `mt-1 flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
              isActive 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}
          >
            <Settings className="mr-3 h-5 w-5" />
            Preferences
          </NavLink>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800">
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 text-primary-500" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Market Sentiment</p>
            <p className="text-xs text-success-500 font-medium">Positive (+1.4%)</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;