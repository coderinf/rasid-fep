import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { getRecentNews } from '../../services/newsService';
import { NewsItem } from '../../types';

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  
  useEffect(() => {
    getRecentNews(5).then(setNews);
  }, []);
  
  const getSentimentColor = (score: number): string => {
    if (score > 0.6) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (score > 0.2) return 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-400';
    if (score > -0.2) return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    if (score > -0.6) return 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };
  
  const getSentimentLabel = (score: number): string => {
    if (score > 0.6) return 'Very Positive';
    if (score > 0.2) return 'Positive';
    if (score > -0.2) return 'Neutral';
    if (score > -0.6) return 'Negative';
    return 'Very Negative';
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Latest Financial News</h2>
        <button className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {news.map((item) => (
          <div 
            key={item.id} 
            className="border-b border-gray-100 dark:border-neutral-700 pb-4 last:border-0 last:pb-0 animate-slide-up"
            style={{ animationDelay: `${parseInt(item.id) * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                {item.language === 'ar' && item.titleAr ? item.titleAr : item.title}
              </h3>
              <a 
                href={item.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <ExternalLink size={16} />
              </a>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
              {item.language === 'ar' && item.contentAr ? item.contentAr : item.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.source} • {format(new Date(item.publishedAt), 'MMM d, yyyy')}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentColor(item.sentiment)}`}>
                  {getSentimentLabel(item.sentiment)}
                </span>
              </div>
              
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {item.language.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;