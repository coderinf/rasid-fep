import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { getNewsByCompany } from '../../services/newsService';
import { Company } from '../../types';

interface CompanyNewsProps {
  company: Company;
}

const CompanyNews: React.FC<CompanyNewsProps> = ({ company }) => {
  const [news, setNews] = useState<any[]>([]);
  
  useEffect(() => {
    getNewsByCompany(company.id, 20).then(setNews);
  }, [company.id]);
  
  const getSentimentBadgeColor = (score: number): string => {
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent News</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">{news.length} articles</span>
      </div>
      
      {news.length > 0 ? (
        <div className="space-y-4">
          {news.map((item) => (
            <div 
              key={item.id} 
              className="border-b border-gray-100 dark:border-neutral-700 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-medium text-gray-900 dark:text-white">
                  {item.language === 'ar' && item.titleAr ? item.titleAr : item.title}
                </h3>
                <a 
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 ml-2 flex-shrink-0"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {item.language === 'ar' && item.contentAr ? item.contentAr : item.content}
              </p>
              
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.source} • {format(new Date(item.publishedAt), 'MMM d, yyyy')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full ${getSentimentBadgeColor(item.sentiment)}`}>
                    {getSentimentLabel(item.sentiment)}
                  </span>
                </div>
                
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                  {item.language === 'en' ? 'English' : 'العربية'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No recent news found for {company.name}</p>
        </div>
      )}
    </div>
  );
};

export default CompanyNews;