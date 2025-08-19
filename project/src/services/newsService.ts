import { supabase } from '../lib/supabase';
import { NewsItem, Company, SentimentData, SectorSentiment } from '../types';

// Helper function to convert sentiment label to score
const sentimentLabelToScore = (label: string | null): number => {
  if (!label) return 0;
  
  switch (label.toLowerCase()) {
    case 'positive':
    case 'إيجابي':
      return 0.7;
    case 'very_positive':
    case 'إيجابي جداً':
      return 1.0;
    case 'negative':
    case 'سلبي':
      return -0.7;
    case 'very_negative':
    case 'سلبي جداً':
      return -1.0;
    case 'neutral':
    case 'محايد':
    default:
      return 0.0;
  }
};

// Helper function to extract company IDs from stocks field
const extractCompanyIds = (stocks: string | null): string[] => {
  if (!stocks) return [];
  
  // Assuming stocks field contains comma-separated ticker symbols
  // You might need to adjust this based on your actual data format
  return stocks.split(',').map(s => s.trim()).filter(s => s.length > 0);
};

export const getRecentNews = async (count = 10): Promise<NewsItem[]> => {
  try {
    // Fetch from both news tables
    const [seNewsResult, argaamNewsResult] = await Promise.all([
      supabase
        .from('se_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(Math.ceil(count / 2)),
      
      supabase
        .from('argaam_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(Math.ceil(count / 2))
    ]);

    if (seNewsResult.error) throw seNewsResult.error;
    if (argaamNewsResult.error) throw argaamNewsResult.error;

    // Combine and transform the news
    const allNews = [
      ...(seNewsResult.data || []).map(item => ({
        id: `se_${item.id}`,
        title: item.title || 'No Title',
        titleAr: undefined, // SE news doesn't have Arabic titles
        content: item.content || '',
        contentAr: undefined,
        source: item.source || 'SE News',
        url: item.url || '',
        publishedAt: item.published_at || new Date().toISOString(),
        sentiment: sentimentLabelToScore(item.sentiment_label),
        relatedCompanies: extractCompanyIds(item.stocks),
        language: item.language || 'en'
      })),
      ...(argaamNewsResult.data || []).map(item => ({
        id: `argaam_${item.id}`,
        title: item.title || 'No Title',
        titleAr: undefined, // Argaam news doesn't have separate Arabic titles
        content: item.content || '',
        contentAr: undefined,
        source: item.source || 'Argaam',
        url: item.url || '',
        publishedAt: item.published_at || new Date().toISOString(),
        sentiment: sentimentLabelToScore(item.sentiment_label),
        relatedCompanies: extractCompanyIds(item.stocks),
        language: item.language || 'ar'
      }))
    ];

    // Sort by published date and return requested count
    return allNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, count);

  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export const getNewsByCompany = async (companyId: string, count = 20): Promise<NewsItem[]> => {
  try {
    // First get the company ticker
    const companyResult = await supabase
      .from('companies')
      .select('ticker')
      .eq('id', companyId)
      .single();

    if (companyResult.error || !companyResult.data) {
      throw new Error('Company not found');
    }

    const ticker = companyResult.data.ticker;

    // Search for news containing this ticker
    const [seNewsResult, argaamNewsResult] = await Promise.all([
      supabase
        .from('se_news')
        .select('*')
        .ilike('stocks', `%${ticker}%`)
        .order('published_at', { ascending: false })
        .limit(count),
      
      supabase
        .from('argaam_news')
        .select('*')
        .ilike('stocks', `%${ticker}%`)
        .order('published_at', { ascending: false })
        .limit(count)
    ]);

    if (seNewsResult.error) throw seNewsResult.error;
    if (argaamNewsResult.error) throw argaamNewsResult.error;

    // Transform and combine news
    const allNews = [
      ...(seNewsResult.data || []).map(item => ({
        id: `se_${item.id}`,
        title: item.title || 'No Title',
        titleAr: undefined,
        content: item.content || '',
        contentAr: undefined,
        source: item.source || 'SE News',
        url: item.url || '',
        publishedAt: item.published_at || new Date().toISOString(),
        sentiment: sentimentLabelToScore(item.sentiment_label),
        relatedCompanies: extractCompanyIds(item.stocks),
        language: item.language || 'en'
      })),
      ...(argaamNewsResult.data || []).map(item => ({
        id: `argaam_${item.id}`,
        title: item.title || 'No Title',
        titleAr: undefined,
        content: item.content || '',
        contentAr: undefined,
        source: item.source || 'Argaam',
        url: item.url || '',
        publishedAt: item.published_at || new Date().toISOString(),
        sentiment: sentimentLabelToScore(item.sentiment_label),
        relatedCompanies: extractCompanyIds(item.stocks),
        language: item.language || 'ar'
      }))
    ];

    return allNews
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, count);

  } catch (error) {
    console.error('Error fetching company news:', error);
    return [];
  }
}; 