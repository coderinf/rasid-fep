import React, { useEffect, useState } from 'react';
import { Check, Moon, Sun, Bell, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { fetchCompanies } from '../services/companyService';
import { Company, UserPreferences } from '../types';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [companies, setCompanies] = useState<Company[]>([]);
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'en',
    theme: theme as 'light' | 'dark',
    dashboardLayout: 'default',
    watchlist: ['1', '3', '4'],
    alertThresholds: {
      positive: 0.7,
      negative: -0.6,
    },
  });

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);
  
  const handleLanguageChange = (language: 'en' | 'ar') => {
    setPreferences(prev => ({ ...prev, language }));
  };
  
  const handleLayoutChange = (dashboardLayout: 'default' | 'compact' | 'detailed') => {
    setPreferences(prev => ({ ...prev, dashboardLayout }));
  };
  
  const handleWatchlistToggle = (companyId: string) => {
    setPreferences(prev => {
      const newWatchlist = prev.watchlist.includes(companyId)
        ? prev.watchlist.filter(id => id !== companyId)
        : [...prev.watchlist, companyId];
      
      return { ...prev, watchlist: newWatchlist };
    });
  };
  
  const handleThresholdChange = (type: 'positive' | 'negative', value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;
    
    setPreferences(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [type]: numValue,
      }
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Interface Preferences
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Language</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    preferences.language === 'en'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  <Globe className="h-5 w-5 mr-2" />
                  English
                  {preferences.language === 'en' && (
                    <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`flex items-center px-4 py-2 rounded-md font-arabic ${
                    preferences.language === 'ar'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  <Globe className="h-5 w-5 mr-2" />
                  العربية
                  {preferences.language === 'ar' && (
                    <Check className="h-4 w-4 mr-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Theme</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (theme === 'dark') toggleTheme();
                    setPreferences(prev => ({ ...prev, theme: 'light' }));
                  }}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    theme === 'light'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  <Sun className="h-5 w-5 mr-2" />
                  Light
                  {theme === 'light' && (
                    <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
                <button
                  onClick={() => {
                    if (theme === 'light') toggleTheme();
                    setPreferences(prev => ({ ...prev, theme: 'dark' }));
                  }}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  <Moon className="h-5 w-5 mr-2" />
                  Dark
                  {theme === 'dark' && (
                    <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Dashboard Layout</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleLayoutChange('default')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    preferences.dashboardLayout === 'default'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  Default
                  {preferences.dashboardLayout === 'default' && (
                    <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
                <button
                  onClick={() => handleLayoutChange('compact')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    preferences.dashboardLayout === 'compact'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  Compact
                  {preferences.dashboardLayout === 'compact' && (
                    <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
                <button
                  onClick={() => handleLayoutChange('detailed')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    preferences.dashboardLayout === 'detailed'
                      ? 'bg-primary-50 border-2 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                      : 'bg-white dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-600'
                  }`}
                >
                  Detailed
                  {preferences.dashboardLayout === 'detailed' && (
                    <Check className="h-4 w-4 ml-2 text-primary-600 dark:text-primary-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Alerts & Notifications
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Bell className="h-4 w-4 mr-2 text-primary-500" />
                Alert Thresholds
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Positive Sentiment (0 to 1):
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={preferences.alertThresholds.positive}
                    onChange={(e) => handleThresholdChange('positive', e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Alert when above: {preferences.alertThresholds.positive}</span>
                    <span>
                      {preferences.alertThresholds.positive >= 0.8 ? 'Very selective' : 
                       preferences.alertThresholds.positive >= 0.5 ? 'Balanced' : 
                       'More alerts'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Negative Sentiment (-1 to 0):
                  </label>
                  <input
                    type="range"
                    min="-1"
                    max="0"
                    step="0.1"
                    value={preferences.alertThresholds.negative}
                    onChange={(e) => handleThresholdChange('negative', e.target.value)}
                    className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Alert when below: {preferences.alertThresholds.negative}</span>
                    <span>
                      {preferences.alertThresholds.negative <= -0.8 ? 'Very selective' : 
                       preferences.alertThresholds.negative <= -0.5 ? 'Balanced' : 
                       'More alerts'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Company Watchlist</h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {companies.map(company => (
                  <label
                    key={company.id}
                    className="flex items-center px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-neutral-700"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.watchlist.includes(company.id)}
                      onChange={() => handleWatchlistToggle(company.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-gray-900 dark:text-white">{company.name}</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">({company.ticker})</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default Settings;