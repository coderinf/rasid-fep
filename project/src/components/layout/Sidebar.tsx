import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Briefcase, Settings, FileText, Home, TrendingUp, Database, Activity, Target, Globe, Users, Zap } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700 shadow-2xl fixed left-0 top-0 h-screen overflow-y-auto">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 flex-shrink-0">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-white">Tadāwul Insights</h1>
            <p className="text-xs text-gray-400 font-medium">Professional Trading Platform</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-green-400" />
              <span className="ml-2 text-xs text-gray-300">Active</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">24/7</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="ml-2 text-xs text-gray-300">Markets</span>
            </div>
            <p className="text-lg font-bold text-white mt-1">+12</p>
          </div>
        </div>
      </div>
      
      {/* Enhanced Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Main Navigation
          </h3>
        </div>
        
        <NavLink
          to="/"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
          style={({ isActive }) => ({
            background: isActive ? 'linear-gradient(to right, #2563eb, #4f46e5)' : 'transparent',
            color: isActive ? 'white' : '#d1d5db',
            boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          })}
        >
          <div className="p-2 rounded-lg mr-3 transition-all duration-200 bg-gray-700/50 group-hover:bg-gray-600/50">
            <Home className="h-5 w-5" />
          </div>
          <span className="font-semibold">Dashboard</span>
        </NavLink>

        <NavLink
          to="/company/2222"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
          style={({ isActive }) => ({
            background: isActive ? 'linear-gradient(to right, #2563eb, #4f46e5)' : 'transparent',
            color: isActive ? 'white' : '#d1d5db',
            boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          })}
        >
          <div className="p-2 rounded-lg mr-3 transition-all duration-200 bg-gray-700/50 group-hover:bg-gray-600/50">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-semibold">Companies</span>
        </NavLink>

        <NavLink
          to="/sector-analysis"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
          style={({ isActive }) => ({
            background: isActive ? 'linear-gradient(to right, #2563eb, #4f46e5)' : 'transparent',
            color: isActive ? 'white' : '#d1d5db',
            boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          })}
        >
          <div className="p-2 rounded-lg mr-3 transition-all duration-200 bg-gray-700/50 group-hover:bg-gray-600/50">
            <BarChart3 className="h-5 w-5" />
          </div>
          <span className="font-semibold">Sector Analysis</span>
        </NavLink>

        <NavLink
          to="/news-monitor"
          className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
          style={({ isActive }) => ({
            background: isActive ? 'linear-gradient(to right, #2563eb, #4f46e5)' : 'transparent',
            color: isActive ? 'white' : '#d1d5db',
            boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
            transform: isActive ? 'scale(1.05)' : 'scale(1)'
          })}
        >
          <div className="p-2 rounded-lg mr-3 transition-all duration-200 bg-gray-700/50 group-hover:bg-gray-600/50">
            <FileText className="h-5 w-5" />
          </div>
          <span className="font-semibold">News Monitor</span>
        </NavLink>

        {/* Quick Actions Section */}
        <div className="pt-6 border-t border-gray-700 mt-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md group">
              <div className="p-2 rounded-lg mr-3 bg-gray-700/50 group-hover:bg-gray-600/50 transition-all duration-200">
                <Globe className="h-5 w-5" />
              </div>
              <span className="font-semibold">Market Overview</span>
            </button>
            
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md group">
              <div className="p-2 rounded-lg mr-3 bg-gray-700/50 group-hover:bg-gray-600/50 transition-all duration-200">
                <Users className="h-5 w-5" />
              </div>
              <span className="font-semibold">Top Performers</span>
            </button>
            
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md group">
              <div className="p-2 rounded-lg mr-3 bg-gray-700/50 group-hover:bg-gray-600/50 transition-all duration-200">
                <Zap className="h-5 w-5" />
              </div>
              <span className="font-semibold">Alerts</span>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700 mt-4">
          <NavLink
            to="/settings"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-md"
            style={({ isActive }) => ({
              background: isActive ? 'linear-gradient(to right, #2563eb, #4f46e5)' : 'transparent',
              color: isActive ? 'white' : '#d1d5db',
              boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
              transform: isActive ? 'scale(1.05)' : 'scale(1)'
            })}
          >
            <div className="p-2 rounded-lg mr-3 transition-all duration-200 bg-gray-700/50 group-hover:bg-gray-600/50">
              <Settings className="h-5 w-5" />
            </div>
            <span className="font-semibold">Preferences</span>
          </NavLink>
        </div>
      </nav>

      {/* Enhanced Footer */}
      <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 flex-shrink-0">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold text-white">Market Sentiment</p>
              <p className="text-xs text-green-400 font-medium">Live Updates</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Overall</span>
              <span className="text-sm font-bold text-green-400">+1.4%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Sectors</span>
              <span className="text-sm font-bold text-blue-400">12 Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">News</span>
              <span className="text-sm font-bold text-purple-400">+24</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;