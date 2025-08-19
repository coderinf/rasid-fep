import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { fetchCompanies, fetchCompanySentimentSeries } from '../../services/companyService';
import { Company, SentimentData, TimeRange } from '../../types';

const SentimentOverview: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  
  // Get days based on time range
  const getDays = (range: TimeRange): number => {
    switch (range) {
      case '1d': return 1;
      case '1w': return 7;
      case '1m': return 30;
      case '3m': return 90;
      case '6m': return 180;
      case '1y': return 365;
      case 'all': return 730; // 2 years for demo
      default: return 30;
    }
  };

  const [companies, setCompanies] = useState<Company[]>([]);
  const [seriesByCompanyId, setSeriesByCompanyId] = useState<Record<string, SentimentData[]>>({});

  useEffect(() => {
    fetchCompanies().then((list) => {
      setCompanies(list);
    });
  }, []);

  // Choose first three companies
  const selectedCompanies = useMemo(() => companies.slice(0, 3).map(c => c.id), [companies]);

  useEffect(() => {
    const days = getDays(timeRange);
    if (selectedCompanies.length === 0) return;
    Promise.all(selectedCompanies.map((id) => fetchCompanySentimentSeries(id, days))).then((all) => {
      const next: Record<string, SentimentData[]> = {};
      all.forEach((series, index) => {
        next[selectedCompanies[index]] = series;
      });
      setSeriesByCompanyId(next);
    });
  }, [selectedCompanies, timeRange]);

  const companyData = selectedCompanies.map(companyId => {
    const company = companies.find(c => c.id === companyId);
    const sentimentData = seriesByCompanyId[companyId] ?? [];
    return {
      name: company?.name || '',
      data: sentimentData,
      currentSentiment: sentimentData[0]?.score || 0,
      previousSentiment: sentimentData[1]?.score || 0
    };
  });

  // Prepare data for chart
  const chartData = [];
  const days = getDays(timeRange);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    
    const dataPoint: any = { date };
    
    selectedCompanies.forEach((id) => {
      const company = companies.find(c => c.id === id);
      const series = seriesByCompanyId[id] ?? [];
      const sentiment = series[days - i - 1];
      
      if (company && sentiment) {
        dataPoint[company.name] = sentiment.score;
      }
    });
    
    chartData.push(dataPoint);
  }

  // Calculate market average
  const marketAverage = chartData.map(point => {
    const values = selectedCompanies.map(id => {
      const company = companies.find(c => c.id === id);
      return company ? point[company.name] : null;
    }).filter(Boolean);
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    return { ...point, 'Market Average': avg };
  });

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Sentiment Overview</h2>
        
        <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
          {(['1d', '1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === range 
                  ? 'bg-white dark:bg-neutral-600 text-primary-600 dark:text-primary-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {companyData.map(company => {
          const change = company.currentSentiment - company.previousSentiment;
          const isPositive = change >= 0;
          
          return (
            <div key={company.name} className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{company.name}</span>
                <div className={`flex items-center text-xs font-medium ${
                  isPositive ? 'text-success-500' : 'text-error-500'
                }`}>
                  {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {Math.abs(change).toFixed(2)}
                </div>
              </div>
              <div className="mt-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {company.currentSentiment.toFixed(2)}
                </span>
                <span className="text-sm ml-1 text-gray-500 dark:text-gray-400">
                  {company.currentSentiment > 0.5 ? 'Very Positive' : 
                   company.currentSentiment > 0.2 ? 'Positive' :
                   company.currentSentiment > -0.2 ? 'Neutral' :
                   company.currentSentiment > -0.5 ? 'Negative' : 'Very Negative'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={marketAverage} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#9ca3af"
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              domain={[-1, 1]}
              tickFormatter={(tick) => tick.toFixed(1)}
              label={{ 
                value: 'Sentiment Score', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}
              formatter={(value: number) => [value.toFixed(2), 'Sentiment']}
            />
            <Legend />
            {companies
              .filter(company => selectedCompanies.includes(company.id))
              .map((company, index) => {
                const colors = ['#3B82F6', '#10B981', '#F59E0B'];
                return (
                  <Line
                    key={company.id}
                    type="monotone"
                    dataKey={company.name}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                );
              })}
            <Line
              type="monotone"
              dataKey="Market Average"
              stroke="#6366f1"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentOverview;