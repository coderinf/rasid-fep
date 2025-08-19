export interface Company {
  id: string;
  ticker: string;
  name: string;
  nameAr: string;
  sector: string;
  logo: string;
}

export interface SentimentData {
  id: string;
  companyId: string;
  date: string;
  score: number; // -1 to 1, where -1 is very negative, 0 is neutral, 1 is very positive
  volume: number; // How many mentions/articles
}

export interface NewsItem {
  id: string;
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: number; // -1 to 1
  relatedCompanies: string[]; // Array of company IDs
  language: 'en' | 'ar';
}

export interface SectorSentiment {
  sector: string;
  averageSentiment: number;
  change: number; // Change from previous period
  volume: number;
  companies: number; // Number of companies in this sector
}

export type TimeRange = '1d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'all';

export interface UserPreferences {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  dashboardLayout: 'default' | 'compact' | 'detailed';
  watchlist: string[]; // Array of company IDs
  alertThresholds: {
    positive: number;
    negative: number;
  };
}