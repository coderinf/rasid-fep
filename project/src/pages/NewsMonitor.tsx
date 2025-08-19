import React, { useEffect, useState } from 'react';
import { Search, Filter, ExternalLink, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getRecentNews } from '../services/newsService';
import { fetchCompanies } from '../services/companyService';
import { Company, NewsItem } from '../types';

const NewsMonitor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'all' | 'en' | 'ar'>('all');
  const [sentiment, setSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    getRecentNews(20).then(setAllNews);
    fetchCompanies().then(setCompanies);
  }, []);

  // Apply filters
  const filteredNews = allNews.filter(news => {
    // Search filter
    if (searchTerm && !(
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (news.titleAr && news.titleAr.includes(searchTerm)) ||
      news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (news.contentAr && news.contentAr.includes(searchTerm))
    )) {
      return false;
    }

    // Language filter
    if (language !== 'all' && news.language !== language) {
      return false;
    }

    // Sentiment filter
    if (sentiment !== 'all') {
      if (sentiment === 'positive' && news.sentiment <= 0.2) return false;
      if (sentiment === 'neutral' && (news.sentiment < -0.2 || news.sentiment > 0.2)) return false;
      if (sentiment === 'negative' && news.sentiment >= -0.2) return false;
    }

    // Company filter
    if (companyFilter !== 'all' && !news.relatedCompanies.includes(companyFilter)) {
      return false;
    }

    return true;
  });

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">News Monitor</h1>
      </div>
      
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 pb-4 border-b border-gray-200 dark:border-neutral-700">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </span>
            <input
              className="py-2 pl-10 pr-4 w-full bg-gray-100 dark:bg-neutral-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
              placeholder="Search news content..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <Filter className="h-4 w-4 text-gray-400 mr-2" />
              <select
                className="bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'all' | 'en' | 'ar')}
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            
            <select
              className="bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={sentiment}
              onChange={(e) => setSentiment(e.target.value as 'all' | 'positive' | 'neutral' | 'negative')}
            >
              <option value="all">All Sentiment</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative Only</option>
            </select>
            
            <select
              className="bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-200 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="all">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.ticker})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredNews.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-neutral-700 mt-3">
            {filteredNews.map((news: NewsItem) => (
              <div key={news.id} className="py-4 animate-fade-in">
                <div className="flex justify-between mb-1">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {news.language === 'ar' && news.titleAr ? news.titleAr : news.title}
                    </h3>
                    <div className="flex flex-wrap items-center mt-1 gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {news.source} • {format(new Date(news.publishedAt), 'MMM d, yyyy h:mm a')}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSentimentBadgeColor(news.sentiment)}`}>
                        {getSentimentLabel(news.sentiment)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-neutral-700 dark:text-gray-300">
                        {news.language === 'en' ? 'English' : 'العربية'}
                      </span>
                    </div>
                  </div>
                  <a 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {news.language === 'ar' && news.contentAr ? news.contentAr : news.content}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {news.relatedCompanies.map(companyId => {
                    const company = companies.find(c => c.id === companyId);
                    return company ? (
                      <span key={companyId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300">
                        {company.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No news found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsMonitor;