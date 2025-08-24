import React, { useEffect, useState } from 'react';
import { ExternalLink, Newspaper, Clock, Globe, TrendingUp, TrendingDown, Minus, Eye, Activity } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { getNewsByCompany } from '../../services/newsService';
import { Company } from '../../types';

interface CompanyNewsProps {
  company: Company;
}

const CompanyNews: React.FC<CompanyNewsProps> = ({ company }) => {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    getNewsByCompany(company.id, 20).then((data) => {
      setNews(data);
      setIsLoading(false);
    });
  }, [company.id]);
  
  const getSentimentColor = (score: number): string => {
    if (score > 0.6) return 'from-emerald-500 to-green-500';
    if (score > 0.2) return 'from-green-400 to-emerald-400';
    if (score > -0.2) return 'from-gray-400 to-gray-500';
    if (score > -0.6) return 'from-red-400 to-red-500';
    return 'from-red-500 to-pink-500';
  };
  
  const getSentimentLabel = (score: number): string => {
    if (score > 0.6) return 'Very Positive';
    if (score > 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.6) return 'Negative';
    return 'Very Negative';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <TrendingUp className="h-4 w-4" />;
    if (score < -0.2) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  // Calculate news statistics
  const positiveNews = news.filter(item => item.sentiment > 0.2).length;
  const negativeNews = news.filter(item => item.sentiment < -0.2).length;
  const neutralNews = news.length - positiveNews - negativeNews;
  
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-700">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Newspaper className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Recent News & Analysis</h2>
            <p className="text-gray-400">Latest coverage and sentiment analysis for {company.name}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-purple-400">{news.length}</div>
          <div className="text-sm text-gray-400">Total Articles</div>
        </div>
      </div>

      {/* News Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 rounded-xl p-6 border border-emerald-700/30">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded-full">
              {positiveNews > 0 ? `${((positiveNews / news.length) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{positiveNews}</div>
          <div className="text-sm text-emerald-300">Positive News</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 border border-blue-700/30">
          <div className="flex items-center justify-between mb-3">
            <Minus className="h-6 w-6 text-blue-400" />
            <span className="text-xs font-medium text-blue-300 bg-blue-900/50 px-2 py-1 rounded-full">
              {neutralNews > 0 ? `${((neutralNews / news.length) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{neutralNews}</div>
          <div className="text-sm text-blue-300">Neutral News</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/50 to-red-800/50 rounded-xl p-6 border border-red-700/30">
          <div className="flex items-center justify-between mb-3">
            <TrendingDown className="h-6 w-6 text-red-400" />
            <span className="text-xs font-medium text-red-300 bg-red-900/50 px-2 py-1 rounded-full">
              {negativeNews > 0 ? `${((negativeNews / news.length) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{negativeNews}</div>
          <div className="text-sm text-red-300">Negative News</div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-5 bg-neutral-700 rounded mb-3"></div>
              <div className="h-4 bg-neutral-700 rounded mb-4 w-3/4"></div>
              <div className="flex space-x-4">
                <div className="h-3 bg-neutral-700 rounded w-24"></div>
                <div className="h-3 bg-neutral-700 rounded w-20"></div>
                <div className="h-3 bg-neutral-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="space-y-6">
          {news.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden rounded-xl border border-neutral-700 p-6 hover:border-purple-500/50 hover:shadow-xl transition-all duration-300 hover:scale-102 animate-fade-in bg-neutral-800/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Sentiment Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getSentimentColor(item.sentiment)}`}></div>
              
              {/* Content */}
              <div className="ml-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-200 flex-1 mr-4">
                    {item.language === 'ar' && item.titleAr ? item.titleAr : item.title}
                  </h3>
                  <a 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 p-2 text-neutral-400 hover:text-purple-400 hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
                
                <p className="text-neutral-300 mb-4 line-clamp-2 leading-relaxed">
                  {item.language === 'ar' && item.contentAr ? item.contentAr : item.content}
                </p>
                
                {/* Enhanced Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Source and Time */}
                    <div className="flex items-center text-sm text-neutral-400">
                      <span className="font-semibold text-purple-400">{item.source}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                    </div>
                    
                    {/* Sentiment Badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSentimentColor(item.sentiment)} text-white shadow-sm`}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="ml-1">{getSentimentLabel(item.sentiment)}</span>
                    </span>
                  </div>
                  
                  {/* Language Badge */}
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-neutral-700 text-neutral-300 border border-neutral-600">
                    <Globe className="h-3 w-3 mr-1" />
                    {item.language === 'en' ? 'EN' : 'AR'}
                  </span>
                </div>
                
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Newspaper className="h-10 w-10 text-neutral-500" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-300 mb-2">No Recent News</h3>
          <p className="text-neutral-500 max-w-md mx-auto">
            No recent news articles found for {company.name}. This could indicate low media coverage or the company being in a quiet period.
          </p>
        </div>
      )}
      
      {/* News Summary Footer */}
      <div className="mt-8 pt-6 border-t border-neutral-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6 text-neutral-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Positive: {positiveNews}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
              Neutral: {neutralNews}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Negative: {negativeNews}
            </span>
          </div>
          
          <div className="text-xs text-neutral-500 flex items-center">
            <Activity className="h-3 w-3 mr-1" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyNews;