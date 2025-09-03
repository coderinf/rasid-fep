import { supabase } from '../lib/supabase';
import { Company, SectorSentiment, SentimentData } from '../types';

type CompanyTrackingRow = {
  Symbol: number | string | null;
  Company_name: string | null;
  Trading_name: string | null;
  Sector: string | null;
  score: number | null;
  s_label: string | null;
};

export async function fetchCompanies(): Promise<Company[]> {
  const { data, error } = await supabase
    .from('company_tracking')
    .select('*');

  if (error || !data) {
    console.error('Error fetching companies from company_tracking:', error);
    return [];
  }

  return (data as CompanyTrackingRow[]).map((row) => ({
    id: String(row.Symbol ?? ''),
    ticker: String(row.Symbol ?? ''),
    name: row.Company_name ?? '',
    nameAr: row.Trading_name ?? '',
    sector: row.Sector ?? 'Unknown',
    logo: '',
  }));
}

export async function fetchTopSentimentCompanies(limit: number = 3): Promise<Company[]> {
  const { data, error } = await supabase
    .from('company_tracking')
    .select('*')
    .not('score', 'is', null)
    .order('score', { ascending: false });

  if (error || !data) {
    console.error('Error fetching sentiment companies:', error);
    return [];
  }

  if (data.length === 0) return [];

  // Get one top, one medium, and one low sentiment company
  const companies: Company[] = [];
  
  // Top sentiment company (highest score)
  if (data.length > 0) {
    const topCompany = data[0] as CompanyTrackingRow;
    companies.push({
      id: String(topCompany.Symbol ?? ''),
      ticker: String(topCompany.Symbol ?? ''),
      name: topCompany.Company_name ?? '',
      nameAr: topCompany.Trading_name ?? '',
      sector: topCompany.Sector ?? 'Unknown',
      logo: '',
    });
  }

  // Medium sentiment company (middle score)
  if (data.length > 2) {
    const middleIndex = Math.floor(data.length / 2);
    const mediumCompany = data[middleIndex] as CompanyTrackingRow;
    companies.push({
      id: String(mediumCompany.Symbol ?? ''),
      ticker: String(mediumCompany.Symbol ?? ''),
      name: mediumCompany.Company_name ?? '',
      nameAr: mediumCompany.Trading_name ?? '',
      sector: mediumCompany.Sector ?? 'Unknown',
      logo: '',
    });
  }

  // Low sentiment company (lowest score)
  if (data.length > 1) {
    const lowCompany = data[data.length - 1] as CompanyTrackingRow;
    companies.push({
      id: String(lowCompany.Symbol ?? ''),
      ticker: String(lowCompany.Symbol ?? ''),
      name: lowCompany.Company_name ?? '',
      nameAr: lowCompany.Trading_name ?? '',
      sector: lowCompany.Sector ?? 'Unknown',
      logo: '',
    });
  }

  return companies;
}

export async function fetchSectorSentiment(): Promise<SectorSentiment[]> {
  const { data, error } = await supabase
    .from('company_tracking')
    .select('Sector, score')
    .not('score', 'is', null); // Filter out companies with no sentiment score

  if (error || !data) {
    console.error('Error fetching sector sentiment:', error);
    return [];
  }

  const sectorToScores: Record<string, number[]> = {};

  (data as CompanyTrackingRow[]).forEach((row) => {
    const sector = row.Sector ?? 'Unknown';
    const score = typeof row.score === 'number' ? row.score : 0;
    if (!sectorToScores[sector]) sectorToScores[sector] = [];
    sectorToScores[sector].push(score);
  });

  const sectors: SectorSentiment[] = Object.entries(sectorToScores).map(([sector, scores]) => {
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    return {
      sector,
      averageSentiment: Number(average.toFixed(2)),
      change: 0,
      volume: scores.length,
      companies: scores.length,
    };
  });

  // Sort by average sentiment desc by default to keep UI similar
  sectors.sort((a, b) => b.averageSentiment - a.averageSentiment);
  return sectors;
}

export async function fetchCompanyCurrentScore(companyId: string): Promise<number> {
  const { data, error } = await supabase
    .from('company_tracking')
    .select('Symbol, score')
    .eq('Symbol', companyId)
    .not('score', 'is', null)
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching company score:', error);
    return 0;
  }

  const row = data[0] as CompanyTrackingRow;
  return typeof row.score === 'number' ? row.score : 0;
}

export async function fetchCompanySentimentSeries(companyId: string, days: number): Promise<SentimentData[]> {
  // Get current score from database
  const currentScore = await fetchCompanyCurrentScore(companyId);
  
  // For now, create a realistic series with some variation around the current score
  // In a real implementation, this would come from historical sentiment data
  const series: SentimentData[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Add some realistic variation to the sentiment score
    // This simulates daily sentiment fluctuations
    const variation = (Math.random() - 0.5) * 0.2; // ±0.1 variation
    const adjustedScore = Math.max(-1, Math.min(1, currentScore + variation));
    
    series.push({
      id: `${companyId}-${i}`,
      companyId,
      date: date.toISOString().split('T')[0],
      score: Number(adjustedScore.toFixed(3)),
      volume: Math.floor(Math.random() * 100) + 10, // Random volume between 10-110
    });
  }

  // Sort by date (oldest first) for proper chart display
  series.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return series;
}

// New function to get sentiment change for a company
export async function fetchCompanySentimentChange(companyId: string): Promise<{ current: number; previous: number; change: number }> {
  const currentScore = await fetchCompanyCurrentScore(companyId);
  
  // For demo purposes, simulate a previous score with some variation
  // In production, this would come from historical data
  const previousScore = Math.max(-1, Math.min(1, currentScore + (Math.random() - 0.5) * 0.3));
  const change = currentScore - previousScore;
  
  return {
    current: Number(currentScore.toFixed(3)),
    previous: Number(previousScore.toFixed(3)),
    change: Number(change.toFixed(3))
  };
}

// Enhanced function to get top sentiment companies with their current scores
export async function fetchTopSentimentCompaniesWithScores(limit: number = 3): Promise<Array<Company & { sentimentScore: number }>> {
  const { data, error } = await supabase
    .from('company_tracking')
    .select('*')
    .not('score', 'is', null)
    .order('score', { ascending: false });

  if (error || !data) {
    console.error('Error fetching sentiment companies with scores:', error);
    return [];
  }

  if (data.length === 0) return [];

  // Get one top, one medium, and one low sentiment company with scores
  const companies: Array<Company & { sentimentScore: number }> = [];
  
  // Top sentiment company (highest score)
  if (data.length > 0) {
    const topCompany = data[0] as CompanyTrackingRow;
    companies.push({
      id: String(topCompany.Symbol ?? ''),
      ticker: String(topCompany.Symbol ?? ''),
      name: topCompany.Company_name ?? '',
      nameAr: topCompany.Trading_name ?? '',
      sector: topCompany.Sector ?? 'Unknown',
      logo: '',
      sentimentScore: typeof topCompany.score === 'number' ? topCompany.score : 0,
    });
  }

  // Medium sentiment company (middle score)
  if (data.length > 2) {
    const middleIndex = Math.floor(data.length / 2);
    const mediumCompany = data[middleIndex] as CompanyTrackingRow;
    companies.push({
      id: String(mediumCompany.Symbol ?? ''),
      ticker: String(mediumCompany.Symbol ?? ''),
      name: mediumCompany.Company_name ?? '',
      nameAr: mediumCompany.Trading_name ?? '',
      sector: mediumCompany.Sector ?? 'Unknown',
      logo: '',
      sentimentScore: typeof mediumCompany.score === 'number' ? mediumCompany.score : 0,
    });
  }

  // Low sentiment company (lowest score)
  if (data.length > 1) {
    const lowCompany = data[data.length - 1] as CompanyTrackingRow;
    companies.push({
      id: String(lowCompany.Symbol ?? ''),
      ticker: String(lowCompany.Symbol ?? ''),
      name: lowCompany.Company_name ?? '',
      nameAr: lowCompany.Trading_name ?? '',
      sector: lowCompany.Sector ?? 'Unknown',
      logo: '',
      sentimentScore: typeof lowCompany.score === 'number' ? lowCompany.score : 0,
    });
  }

  return companies;
}

export async function fetchMarketOverviewStats() {
  // Fetch total stocks
  const { count: totalStocks } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true });

  // Fetch active sectors
  const { count: activeSectors } = await supabase
    .from('companies')
    .select('sector', { count: 'exact', head: true });

  // Fetch sentiment stats from sector_sentiment
  const { data: sectorSentiment } = await supabase
    .from('sector_sentiment')
    .select('average_sentiment, change_from_previous')
    .order('date', { ascending: false })
    .limit(1)
    .single();

  // Fetch positive/negative/neutral stocks from company_sentiment
  const { data: sentimentRows } = await supabase
    .from('company_sentiment')
    .select('sentiment_score');

  let positiveStocks = 0, negativeStocks = 0, neutralStocks = 0;
  if (sentimentRows) {
    sentimentRows.forEach((row: any) => {
      if (row.sentiment_score > 0.2) positiveStocks++;
      else if (row.sentiment_score < -0.2) negativeStocks++;
      else neutralStocks++;
    });
  }

  return {
    totalStocks: totalStocks || 0,
    activeSectors: activeSectors || 0,
    overallSentiment: sectorSentiment?.average_sentiment ?? 0,
    sentimentChange: sectorSentiment?.change_from_previous ?? 0,
    positiveStocks,
    negativeStocks,
    neutralStocks,
  };
}


