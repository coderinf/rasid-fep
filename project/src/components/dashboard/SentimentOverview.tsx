import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, subDays } from 'date-fns';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, Minus, Activity, Target } from 'lucide-react';
import { fetchTopSentimentCompaniesWithScores, fetchCompanySentimentSeries, fetchCompanySentimentChange } from '../../services/companyService';
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

  const [companies, setCompanies] = useState<Array<Company & { sentimentScore: number }>>([]);
  const [seriesByCompanyId, setSeriesByCompanyId] = useState<Record<string, SentimentData[]>>({});
  const [sentimentChanges, setSentimentChanges] = useState<Record<string, { current: number; previous: number; change: number }>>({});

  useEffect(() => {
    // Fetch top 3 companies by sentiment score with their scores
    fetchTopSentimentCompaniesWithScores(3).then((list) => {
      setCompanies(list);
    });
  }, []);

  // Use all fetched companies (top 3 by sentiment)
  const selectedCompanies = useMemo(() => companies.map(c => c.id), [companies]);

  useEffect(() => {
    const days = getDays(timeRange);
    if (selectedCompanies.length === 0) return;
    
    // Fetch sentiment series for all selected companies
    Promise.all(selectedCompanies.map((id) => fetchCompanySentimentSeries(id, days))).then((all) => {
      const next: Record<string, SentimentData[]> = {};
      all.forEach((series, index) => {
        next[selectedCompanies[index]] = series;
      });
      setSeriesByCompanyId(next);
    });

    // Fetch sentiment changes for all selected companies
    Promise.all(selectedCompanies.map((id) => fetchCompanySentimentChange(id))).then((all) => {
      const next: Record<string, { current: number; previous: number; change: number }> = {};
      all.forEach((change, index) => {
        next[selectedCompanies[index]] = change;
      });
      setSentimentChanges(next);
    });
  }, [selectedCompanies, timeRange]);

  const companyData = selectedCompanies.map(companyId => {
    const company = companies.find(c => c.id === companyId);
    const sentimentData = seriesByCompanyId[companyId] ?? [];
    const changeData = sentimentChanges[companyId];
    
    return {
      name: company?.name || '',
      data: sentimentData,
      currentSentiment: changeData?.current ?? sentimentData[0]?.score ?? 0,
      previousSentiment: changeData?.previous ?? sentimentData[1]?.score ?? 0,
      sentimentScore: company?.sentimentScore ?? 0
    };
  });

  // Prepare data for chart
  const chartData: Array<{ date: string; [key: string]: any }> = [];
  const days = getDays(timeRange);
  
  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'MMM dd');
    
    const dataPoint: { date: string; [key: string]: any } = { date };
    
    selectedCompanies.forEach((id) => {
      const company = companies.find(c => c.id === id);
      const series = seriesByCompanyId[id] ?? [];
      const sentiment = series[i]; // Use the correct index for chronological order
      
      if (company && sentiment) {
        dataPoint[company.name] = sentiment.score;
      } else if (company) {
        // If no sentiment data for this date, use a default value or previous value
        const previousSentiment = series[i + 1]?.score ?? 0;
        dataPoint[company.name] = previousSentiment;
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

  // Ensure we have data for all three companies
  const hasDataForAllCompanies = selectedCompanies.every(id => {
    const company = companies.find(c => c.id === id);
    return company && seriesByCompanyId[id] && seriesByCompanyId[id].length > 0;
  });

  // Get the actual companies that will be displayed
  const companiesToDisplay = companies.filter(company => 
    selectedCompanies.includes(company.id) && 
    chartData.some(point => point[company.name] !== undefined)
  );

  // Debug logging
  console.log('Selected Companies:', selectedCompanies);
  console.log('Companies Data:', companies);
  console.log('Series Data:', seriesByCompanyId);
  console.log('Chart Data:', chartData);
  console.log('Market Average:', marketAverage);
  console.log('Has Data For All Companies:', hasDataForAllCompanies);
  console.log('Companies To Display:', companiesToDisplay);

  return (
    <div className="space-y-6">
      {/* Enhanced Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Target className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm text-neutral-400">Time Range:</span>
        </div>
        
        <div className="flex space-x-1 bg-neutral-800 rounded-xl p-1 border border-neutral-600">
          {(['1d', '1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                timeRange === range 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Enhanced Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {companyData.map((company, index) => {
          const change = company.currentSentiment - company.previousSentiment;
          const isPositive = change >= 0;
          
          // Determine sentiment level based on index
          const sentimentLevels = ['Top Sentiment', 'Medium Sentiment', 'Low Sentiment'];
          const levelColors = ['text-emerald-400', 'text-yellow-400', 'text-red-400'];
          const bgColors = ['from-emerald-900/50 to-emerald-800/50', 'from-yellow-900/50 to-yellow-800/50', 'from-red-900/50 to-red-800/50'];
          const borderColors = ['border-emerald-700/30', 'border-yellow-700/30', 'border-red-700/30'];
          
          return (
            <div 
              key={company.name} 
              className={`bg-gradient-to-br ${bgColors[index]} rounded-xl p-6 border ${borderColors[index]} hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-sm font-bold uppercase ${levelColors[index]}`}>
                  {sentimentLevels[index]}
                </span>
                <div className={`flex items-center text-xs font-medium ${
                  isPositive ? 'text-emerald-300' : 'text-red-300'
                }`}>
                  {isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  {Math.abs(change).toFixed(2)}
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-sm font-medium text-neutral-300">{company.name}</span>
              </div>
              
              <div className="mb-4">
                <span className="text-3xl font-bold text-white">
                  {company.currentSentiment.toFixed(2)}
                </span>
                <span className="text-sm ml-2 text-neutral-400">
                  {company.currentSentiment > 0.5 ? 'Very Positive' : 
                   company.currentSentiment > 0.2 ? 'Positive' :
                   company.currentSentiment > -0.2 ? 'Neutral' :
                   company.currentSentiment > -0.5 ? 'Negative' : 'Very Negative'}
                </span>
              </div>

              {/* Sentiment Trend Indicator */}
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Previous: {company.previousSentiment.toFixed(2)}</span>
                <span className={`font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '↗️ Rising' : '↘️ Falling'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Chart */}
      <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Sentiment Trend Analysis</h3>
          <div className="flex items-center space-x-2 text-sm text-neutral-400">
            <span>Companies: {companiesToDisplay.length}/3</span>
            {companiesToDisplay.length < 3 && (
              <span className="text-yellow-400">⚠️</span>
            )}
          </div>
        </div>
        
        {companiesToDisplay.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-neutral-500" />
              </div>
              <p className="text-neutral-400">No sentiment data available for the selected time range</p>
            </div>
          </div>
        ) : (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis 
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  domain={[-1, 1]}
                  tickFormatter={(tick) => tick.toFixed(1)}
                  axisLine={{ stroke: '#374151' }}
                  label={{ 
                    value: 'Sentiment Score', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: 12 }
                  }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid #374151',
                    borderRadius: '0.75rem',
                    color: '#ffffff'
                  }}
                  formatter={(value: number) => [value.toFixed(3), 'Sentiment']}
                />
                <Legend />
                
                {/* Company Lines - Ensure all three are displayed */}
                {companiesToDisplay
                  .map((company, index) => {
                    const colors = ['#3B82F6', '#10B981', '#F59E0B'];
                    const companyName = company.name;
                    
                    return (
                      <Line
                        key={company.id}
                        type="monotone"
                        dataKey={companyName}
                        stroke={colors[index % colors.length]}
                        strokeWidth={3}
                        dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
                        name={`${companyName} (${company.ticker})`}
                      />
                    );
                  })}
                
                {/* Market Average Line */}
                <Line
                  type="monotone"
                  dataKey="Market Average"
                  stroke="#6366f1"
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, stroke: '#ffffff', strokeWidth: 2 }}
                  name="Market Average"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Chart Debug Info */}
        {!hasDataForAllCompanies && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <p className="text-yellow-300 text-sm">
              ⚠️ Only {companiesToDisplay.length} out of 3 companies have sentiment data for the selected time range.
              {companiesToDisplay.length < 3 && (
                <span className="block mt-1">
                  Missing data for: {companies.filter(c => selectedCompanies.includes(c.id) && !companiesToDisplay.includes(c)).map(c => c.name).join(', ')}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentOverview;