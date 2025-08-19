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

export async function fetchSectorSentiment(): Promise<SectorSentiment[]> {
  const { data, error } = await supabase
    .from('company_tracking')
    .select('Sector, score');

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
    .limit(1);

  if (error || !data || data.length === 0) {
    console.error('Error fetching company score:', error);
    return 0;
  }

  const row = data[0] as CompanyTrackingRow;
  return typeof row.score === 'number' ? row.score : 0;
}

export async function fetchCompanySentimentSeries(companyId: string, days: number): Promise<SentimentData[]> {
  // Since we only have a current score in company_tracking, synthesize a flat series from it
  const currentScore = await fetchCompanyCurrentScore(companyId);
  const series: SentimentData[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    series.push({
      id: `${companyId}-${i}`,
      companyId,
      date: date.toISOString().split('T')[0],
      score: currentScore,
      volume: 0,
    });
  }

  return series;
}


