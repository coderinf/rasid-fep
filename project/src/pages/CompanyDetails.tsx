import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Globe, Users, TrendingUp, AlertCircle, Building2, BarChart3, Activity, Calendar, Target } from 'lucide-react';
import { fetchCompanies } from '../services/companyService';
import { Company } from '../types';
import SentimentTrend from '../components/company/SentimentTrend';
import CompanyNews from '../components/company/CompanyNews';

const CompanyDetails: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCompanies().then((data) => {
      setCompanies(data);
      setIsLoading(false);
    });
  }, []);

  const company = companies.find(c => c.ticker === ticker) || companies[0];

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 animate-fade-in border border-gray-700">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-600 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-6 w-40 bg-gray-600 rounded"></div>
                <div className="h-4 w-32 bg-gray-600 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-600 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="space-y-6 p-6">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 animate-fade-in border border-gray-700">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Company Not Found</h2>
            <p className="text-gray-400">The requested company could not be found.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-6 bg-gray-950 min-h-screen">
      {/* Enhanced Company Header */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-700">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-gray-800">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{company.name}</h1>
              <div className="flex items-center space-x-4 text-gray-300">
                <span className="inline-flex items-center px-3 py-1 bg-gray-800 rounded-full text-sm font-medium">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                  {company.ticker}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-gray-800 rounded-full text-sm font-medium">
                  <Globe className="h-4 w-4 mr-2 text-purple-400" />
                  {company.sector}
                </span>
              </div>
              <p className="text-lg text-gray-400 font-arabic mt-2">{company.nameAr}</p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 flex flex-wrap gap-3">
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105">
              <AlertCircle className="h-5 w-5 mr-2" />
              Set Alert
            </button>
            <a 
              href={`https://www.tadawul.com.sa/wps/portal/tadawul/market-participants/issuers/issuers-directory/${company.ticker}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gray-600 text-sm font-semibold rounded-xl text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 transform hover:scale-105"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Tadāwul Profile
            </a>
          </div>
        </div>
        
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 rounded-xl border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <span className="text-xs font-medium text-blue-300 bg-blue-900/50 px-2 py-1 rounded-full">+12%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">0.68</div>
            <div className="text-sm text-blue-300">Current Sentiment</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 rounded-xl border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Users className="h-6 w-6 text-purple-400" />
              <span className="text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">+22%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">238</div>
            <div className="text-sm text-purple-300">Social Mentions</div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 p-6 rounded-xl border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Globe className="h-6 w-6 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded-full">+8%</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">47</div>
            <div className="text-sm text-emerald-300">News Coverage</div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-6 rounded-xl border border-orange-700/30 hover:border-orange-600/50 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-6 w-6 text-orange-400" />
              <span className="text-xs font-medium text-orange-300 bg-orange-900/50 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-orange-300">Monitoring</div>
          </div>
        </div>
      </div>
      
      {/* Sentiment Trend Chart */}
      <SentimentTrend company={company} />
      
      {/* Company News */}
      <CompanyNews company={company} />
      
      {/* Additional Company Insights */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Company Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-400" />
              Market Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Volatility Index</span>
                <span className="text-white font-semibold">Medium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Risk Level</span>
                <span className="text-amber-400 font-semibold">Moderate</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Market Cap</span>
                <span className="text-white font-semibold">Large Cap</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
              Sentiment Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall Sentiment</span>
                <span className="text-emerald-400 font-semibold">Positive</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Trend Direction</span>
                <span className="text-blue-400 font-semibold">↗️ Upward</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Confidence Score</span>
                <span className="text-white font-semibold">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;