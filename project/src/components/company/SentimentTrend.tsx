import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { fetchCompanySentimentSeries } from '../../services/companyService';
import { Company, TimeRange } from '../../types';

interface SentimentTrendProps {
  company: Company;
}

const SentimentTrend: React.FC<SentimentTrendProps> = ({ company }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');

  const getDays = (range: TimeRange): number => {
    switch (range) {
      case '1d': return 1;
      case '1w': return 7;
      case '1m': return 30;
      case '3m': return 90;
      case '6m': return 180;
      case '1y': return 365;
      case 'all': return 730;
      default: return 30;
    }
  };

  const [sentimentData, setSentimentData] = useState<any[]>([]);

  useEffect(() => {
    fetchCompanySentimentSeries(company.id, getDays(timeRange)).then(setSentimentData);
  }, [company.id, timeRange]);

  const reversedData = [...sentimentData].reverse();

  // Format data for the chart
  const chartData = reversedData.map(item => ({
    date: format(new Date(item.date), 'MMM dd'),
    sentiment: item.score,
    volume: item.volume
  }));

  // Calculate statistics
  const currentSentiment = sentimentData[0]?.score || 0;
  const averageSentiment = sentimentData.reduce((sum, item) => sum + item.score, 0) / sentimentData.length;
  const maxSentiment = Math.max(...sentimentData.map(item => item.score));
  const minSentiment = Math.min(...sentimentData.map(item => item.score));
  
  // Calculate change
  const previousSentiment = sentimentData[1]?.score || 0;
  const change = currentSentiment - previousSentiment;
  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sentiment Trend</h2>
        
        <div className="flex space-x-1 bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
          {(['1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current</span>
          <div className="mt-1">
            <span className={`text-2xl font-bold ${
              currentSentiment > 0 ? 'text-success-500' : 
              currentSentiment < 0 ? 'text-error-500' : 
              'text-gray-700 dark:text-gray-300'
            }`}>
              {currentSentiment.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Average</span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {averageSentiment.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Range</span>
          <div className="mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {minSentiment.toFixed(2)} to {maxSentiment.toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Change</span>
          <div className="mt-1">
            <span className={`text-2xl font-bold ${isPositive ? 'text-success-500' : 'text-error-500'}`}>
              {change > 0 ? '+' : ''}{change.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
            <ReferenceLine y={0} stroke="#9ca3af" />
            <Line
              type="monotone"
              dataKey="sentiment"
              stroke="#10b981"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This chart shows the sentiment trend for {company.name} over the selected time period.
          The sentiment score ranges from -1 (extremely negative) to 1 (extremely positive).
        </p>
      </div>
    </div>
  );
};

export default SentimentTrend;