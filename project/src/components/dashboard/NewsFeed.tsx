import React, { useEffect, useState } from 'react';
import { ExternalLink, Newspaper, Clock, Globe, TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { getRecentNews } from '../../services/newsService';
import { NewsItem } from '../../types';

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    getRecentNews(5).then((data) => {
      setNews(data);
      setIsLoading(false);
    });
  }, []);
  
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
    if (score > 0.2) return <TrendingUp className="h-3 w-3" />;
    if (score < -0.2) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 animate-fade-in border border-gray-100 dark:border-neutral-700">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Latest Financial News
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Real-time market updates and insights
            </p>
          </div>
        </div>
        
        <button className="inline-flex items-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
          <Eye className="h-4 w-4 mr-2" />
          View All
        </button>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded mb-3 w-3/4"></div>
              <div className="flex space-x-2">
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-700 p-4 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-md transition-all duration-300 hover:scale-102 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Sentiment Indicator Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getSentimentColor(item.sentiment)}`}></div>
              
              {/* Content */}
              <div className="ml-3">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                    {item.language === 'ar' && item.titleAr ? item.titleAr : item.title}
                  </h3>
                  <a 
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-3 flex-shrink-0 p-2 text-gray-400 hover:text-purple-500 dark:text-gray-500 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all duration-200"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                  {item.language === 'ar' && item.contentAr ? item.contentAr : item.content}
                </p>
                
                {/* Enhanced Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Source and Time */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{item.source}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}</span>
                    </div>
                    
                    {/* Sentiment Badge */}
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSentimentColor(item.sentiment)} text-white shadow-sm`}>
                      {getSentimentIcon(item.sentiment)}
                      <span className="ml-1">{getSentimentLabel(item.sentiment)}</span>
                    </span>
                  </div>
                  
                  {/* Language Badge */}
                  <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-300">
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
      )}
      
      {/* News Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Positive: {news.filter(n => n.sentiment > 0.2).length}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
              Neutral: {news.filter(n => n.sentiment >= -0.2 && n.sentiment <= 0.2).length}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Negative: {news.filter(n => n.sentiment < -0.2).length}
            </span>
          </div>
          
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;