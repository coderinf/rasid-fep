import React, { useEffect, useState } from 'react';
import { Search, Filter, ExternalLink, AlertCircle, Clock, Globe, TrendingUp, TrendingDown, Minus, Eye, BookOpen, Calendar, Newspaper, Activity, Target, Zap } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { getRecentNews } from '../services/newsService';
import { fetchCompanies } from '../services/companyService';
import { Company, NewsItem } from '../types';

const NewsMonitor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'all' | 'en' | 'ar'>('all');
  const [sentiment, setSentiment] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      getRecentNews(20),
      fetchCompanies()
    ]).then(([news, comps]) => {
      setAllNews(news);
      setCompanies(comps);
      setIsLoading(false);
    });
  }, []);

  // Apply filters and sort by sentiment (positive/negative first, then neutral)
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
  }).sort((a, b) => {
    // Sort by sentiment: positive and negative first, then neutral
    const aAbs = Math.abs(a.sentiment);
    const bAbs = Math.abs(b.sentiment);
    
    // If both are neutral (low absolute values), sort by sentiment value
    if (aAbs <= 0.2 && bAbs <= 0.2) {
      return b.sentiment - a.sentiment;
    }
    
    // If one is neutral and other isn't, prioritize non-neutral
    if (aAbs <= 0.2 && bAbs > 0.2) return 1;
    if (aAbs > 0.2 && bAbs <= 0.2) return -1;
    
    // Both are non-neutral, sort by absolute sentiment (stronger first)
    return bAbs - aAbs;
  });

  const getSentimentBadgeColor = (score: number): string => {
    if (score > 0.6) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    if (score > 0.2) return 'bg-gradient-to-r from-green-400 to-green-500 text-white';
    if (score > -0.2) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    if (score > -0.6) return 'bg-gradient-to-r from-red-400 to-red-500 text-white';
    return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
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
  const positiveNews = filteredNews.filter(item => item.sentiment > 0.2).length;
  const negativeNews = filteredNews.filter(item => item.sentiment < -0.2).length;
  const neutralNews = filteredNews.length - positiveNews - negativeNews;
  
  return (
    <div className="space-y-6 bg-gray-950 min-h-screen p-6">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-2xl shadow-2xl p-8 animate-fade-in border border-blue-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                News Monitor
              </h1>
              <p className="text-lg text-blue-200">
                Real-time financial news monitoring and sentiment analysis
              </p>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-800/50 rounded-xl p-1 border border-blue-600">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-blue-300 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                    : 'text-blue-300 hover:text-white hover:bg-blue-800/50'
                }`}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* News Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-900/60 to-green-800/60 rounded-xl p-6 shadow-lg border border-emerald-600/50 hover:border-emerald-500/70 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-6 w-6 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300 bg-emerald-800/70 px-2 py-1 rounded-full">
              {positiveNews > 0 ? `${((positiveNews / filteredNews.length) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{positiveNews}</div>
          <div className="text-sm text-emerald-300">Positive News</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-900/60 to-indigo-800/60 rounded-xl p-6 shadow-lg border border-blue-600/50 hover:border-blue-500/70 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <Minus className="h-6 w-6 text-blue-400" />
            <span className="text-xs font-medium text-blue-300 bg-blue-800/70 px-2 py-1 rounded-full">
              {neutralNews > 0 ? `${((neutralNews / filteredNews.length) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{neutralNews}</div>
          <div className="text-sm text-blue-300">Neutral News</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-900/60 to-pink-800/60 rounded-xl p-6 shadow-lg border border-red-600/50 hover:border-red-500/70 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <TrendingDown className="h-6 w-6 text-red-400" />
            <span className="text-xs font-medium text-red-300 bg-red-800/70 px-2 py-1 rounded-full">
              {negativeNews > 0 ? `${((negativeNews / filteredNews.length) * 100).toFixed(0)}%` : '0%'}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{negativeNews}</div>
          <div className="text-sm text-red-300">Negative News</div>
        </div>
      </div>
      
      {/* Enhanced Filters Section */}
      <div className="bg-gradient-to-br from-gray-900 via-blue-900/30 to-indigo-900/30 rounded-xl shadow-lg p-4 animate-fade-in border border-blue-700/50">
        <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-blue-400" />
            </span>
            <input
              className="py-2 pl-10 pr-4 w-full bg-gray-800/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-700 text-white border border-blue-600/50 transition-all duration-200"
              placeholder="Search news content, titles, or companies..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center bg-gray-800/70 rounded-lg px-2 py-1.5 border border-blue-600/30">
              <Globe className="h-3 w-3 text-blue-400 mr-1.5" />
              <select
                className="bg-transparent text-blue-200 text-xs focus:outline-none focus:ring-0 border-0"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'all' | 'en' | 'ar')}
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            
            <div className="flex items-center bg-gray-800/70 rounded-lg px-2 py-1.5 border border-blue-600/30">
              <Filter className="h-3 w-3 text-blue-400 mr-1.5" />
              <select
                className="bg-transparent text-blue-200 text-xs focus:outline-none focus:ring-0 border-0"
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as 'all' | 'positive' | 'neutral' | 'negative')}
              >
                <option value="all">All Sentiment</option>
                <option value="positive">Positive Only</option>
                <option value="neutral">Neutral Only</option>
                <option value="negative">Negative Only</option>
              </select>
            </div>
            
            <select
              className="bg-gray-800/70 text-blue-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 border border-blue-600/50"
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

        {/* Results Summary */}
        <div className="mt-3 pt-3 border-t border-blue-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-300">
              Showing {filteredNews.length} of {allNews.length} news items
            </span>
            <div className="flex items-center space-x-3 text-xs text-blue-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></div>
                <span>Positive</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></div>
                <span>Neutral</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                <span>Negative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* News Content */}
      {isLoading ? (
        <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-indigo-900/20 rounded-xl shadow-lg p-8 animate-fade-in border border-blue-700/50">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        </div>
      ) : filteredNews.length > 0 ? (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4' 
            : 'space-y-3'
        }`}>
          {filteredNews.map((news: NewsItem) => (
            <div 
              key={news.id} 
              className={`bg-gradient-to-br from-gray-900 via-blue-900/20 to-indigo-900/20 rounded-lg shadow-md border border-blue-700/50 overflow-hidden hover:shadow-lg hover:border-blue-600/70 transition-all duration-300 hover:scale-102 ${
                viewMode === 'grid' ? 'h-full' : ''
              }`}
            >
              {/* News Header */}
              <div className="p-4 border-b border-blue-700/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-white mb-2 line-clamp-2 ${
                      viewMode === 'grid' ? 'text-base' : 'text-lg'
                    }`}>
                      {news.language === 'ar' && news.titleAr ? news.titleAr : news.title}
                    </h3>
                    
                    {/* Source and Time */}
                    <div className="flex items-center text-xs text-blue-300 mb-2">
                      <span className="font-medium text-blue-400">{news.source}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={news.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-2 flex-shrink-0 p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 rounded-md transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                {/* Sentiment and Language Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getSentimentBadgeColor(news.sentiment)}`}>
                    {getSentimentIcon(news.sentiment)}
                    <span className="ml-1">{getSentimentLabel(news.sentiment)}</span>
                  </span>
                  
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-800/50 text-blue-300 border border-blue-600/50">
                    <Globe className="h-3 w-3 mr-1" />
                    {news.language === 'en' ? 'English' : 'العربية'}
                  </span>
                </div>
              </div>

              {/* News Content */}
              <div className="p-4">
                <p className={`text-gray-300 mb-3 line-clamp-3 ${
                  viewMode === 'grid' ? 'text-xs' : 'text-sm'
                }`}>
                  {news.language === 'ar' && news.contentAr ? news.contentAr : news.content}
                </p>

                {/* Related Companies */}
                {news.relatedCompanies.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-xs font-medium text-blue-300 mb-1.5">
                      Related Companies:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {news.relatedCompanies.map(companyId => {
                        const company = companies.find(c => c.id === companyId);
                        return company ? (
                          <span 
                            key={companyId} 
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-700/50"
                          >
                            {company.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Detailed Time */}
                <div className="flex items-center text-xs text-blue-300">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Published: {format(new Date(news.publishedAt), 'MMM d, yyyy h:mm a')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 via-blue-900/20 to-indigo-900/20 rounded-xl shadow-lg p-12 animate-fade-in border border-blue-700/50">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No News Found</h2>
            <p className="text-blue-300">Try adjusting your filters to see more results.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsMonitor;