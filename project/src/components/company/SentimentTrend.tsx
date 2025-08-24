import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { fetchCompanySentimentSeries } from '../../services/companyService';
import { Company, TimeRange } from '../../types';
import { TrendingUp, TrendingDown, Activity, BarChart3, Target, Zap } from 'lucide-react';

interface SentimentTrendProps {
  company: Company;
}

const SentimentTrend: React.FC<SentimentTrendProps> = ({ company }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    fetchCompanySentimentSeries(company.id, getDays(timeRange)).then((data) => {
      setSentimentData(data);
      setIsLoading(false);
    });
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

  // Calculate additional metrics
  const volatility = Math.sqrt(sentimentData.reduce((sum, item) => sum + Math.pow(item.score - averageSentiment, 2), 0) / sentimentData.length);
  const positiveDays = sentimentData.filter(item => item.score > 0.2).length;
  const negativeDays = sentimentData.filter(item => item.score < -0.2).length;
  const neutralDays = sentimentData.length - positiveDays - negativeDays;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 animate-fade-in border border-gray-700">
      {/* Enhanced Header */}
      <div className="flex flex-wrap items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Sentiment Trend Analysis</h2>
            <p className="text-gray-400">Real-time sentiment tracking and market insights</p>
          </div>
        </div>
        
        <div className="flex space-x-1 bg-gray-800 rounded-xl p-1 border border-gray-600">
          {(['1w', '1m', '3m', '6m', '1y'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                timeRange === range 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 rounded-xl p-6 border border-blue-700/30 hover:border-blue-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="h-6 w-6 text-blue-400" />
            <span className="text-xs font-medium text-blue-300 bg-blue-900/50 px-2 py-1 rounded-full">
              {isPositive ? '+' : ''}{change.toFixed(3)}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{currentSentiment.toFixed(3)}</div>
          <div className="text-sm text-blue-300">Current Sentiment</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 rounded-xl p-6 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Activity className="h-6 w-6 text-purple-400" />
            <span className="text-xs font-medium text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
              {volatility.toFixed(3)}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{averageSentiment.toFixed(3)}</div>
          <div className="text-sm text-purple-300">Average Sentiment</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 rounded-xl p-6 border border-emerald-700/30 hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-6 w-6 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300 bg-emerald-900/50 px-2 py-1 rounded-full">
              {positiveDays}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{positiveDays}</div>
          <div className="text-sm text-emerald-300">Positive Days</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 rounded-xl p-6 border border-orange-700/30 hover:border-orange-600/50 transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-6 w-6 text-orange-400" />
            <span className="text-xs font-medium text-orange-300 bg-orange-900/50 px-2 py-1 rounded-full">
              {negativeDays}
            </span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{negativeDays}</div>
          <div className="text-sm text-orange-300">Negative Days</div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Main Sentiment Chart */}
          <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Sentiment Trend Line</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="sentiment"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#sentimentGradient)"
                    activeDot={{ r: 8, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Volume Analysis</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
                    axisLine={{ stroke: '#374151' }}
                    label={{ 
                      value: 'Volume', 
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
                    formatter={(value: number) => [value, 'Volume']}
                  />
                  <Bar 
                    dataKey="volume" 
                    fill="url(#volumeGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
              <h4 className="text-lg font-semibold text-white mb-4">Sentiment Distribution</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Positive Days</span>
                  <span className="text-green-400 font-semibold">{positiveDays}</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(positiveDays / sentimentData.length) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Neutral Days</span>
                  <span className="text-neutral-400 font-semibold">{neutralDays}</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-neutral-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(neutralDays / sentimentData.length) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Negative Days</span>
                  <span className="text-red-400 font-semibold">{negativeDays}</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(negativeDays / sentimentData.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
              <h4 className="text-lg font-semibold text-white mb-4">Key Metrics</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Volatility</span>
                  <span className="text-white font-semibold">{volatility.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Trend</span>
                  <span className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '↗️ Bullish' : '↘️ Bearish'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Confidence</span>
                  <span className="text-white font-semibold">
                    {Math.abs(currentSentiment) > 0.5 ? 'High' : Math.abs(currentSentiment) > 0.2 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700">
              <h4 className="text-lg font-semibold text-white mb-4">Analysis Summary</h4>
              <div className="space-y-3 text-sm text-neutral-300">
                <p>
                  {company.name} shows a {isPositive ? 'positive' : 'negative'} sentiment trend with 
                  {Math.abs(change) > 0.3 ? ' significant' : ' moderate'} changes over the selected period.
                </p>
                <p>
                  The sentiment score ranges from {minSentiment.toFixed(2)} to {maxSentiment.toFixed(2)}, 
                  indicating {volatility > 0.3 ? 'high' : volatility > 0.1 ? 'moderate' : 'low'} market volatility.
                </p>
                <p>
                  {positiveDays > negativeDays ? 'Overall positive sentiment' : 'Overall negative sentiment'} 
                  with {Math.max(positiveDays, negativeDays)} out of {sentimentData.length} days showing 
                  {positiveDays > negativeDays ? ' positive' : ' negative'} sentiment.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SentimentTrend;