import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, Globe, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchCompanies } from '../services/companyService';
import { Company } from '../types';
import SentimentTrend from '../components/company/SentimentTrend';
import CompanyNews from '../components/company/CompanyNews';

const CompanyDetails: React.FC = () => {
  const { ticker } = useParams<{ ticker: string }>();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    fetchCompanies().then(setCompanies);
  }, []);

  const company = companies.find(c => c.ticker === ticker) || companies[0];

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 animate-fade-in">
          <div className="h-6 w-40 bg-gray-200 dark:bg-neutral-700 rounded mb-2" />
          <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 animate-fade-in">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16 bg-gray-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{company.ticker} • {company.sector}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic mt-1">{company.nameAr}</p>
            </div>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <AlertCircle className="h-4 w-4 mr-2" />
              Set Alert
            </button>
            <a 
              href={`https://www.tadawul.com.sa/wps/portal/tadawul/market-participants/issuers/issuers-directory/${company.ticker}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-neutral-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Tadāwul Profile
            </a>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Sentiment</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">0.68</span>
              <span className="ml-2 text-sm font-medium text-success-500">+0.12</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Social Media Mentions</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">238</span>
              <span className="ml-2 text-sm font-medium text-success-500">+22%</span>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">News Coverage</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">47</span>
              <span className="ml-2 text-sm font-medium text-success-500">+8%</span>
            </div>
          </div>
        </div>
      </div>
      
      <SentimentTrend company={company} />
      
      <CompanyNews company={company} />
    </div>
  );
};

export default CompanyDetails;