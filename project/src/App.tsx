import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import MarketOverview from './pages/MarketOverview';
import CompanyDetails from './pages/CompanyDetails';
import SectorAnalysis from './pages/SectorAnalysis';
import NewsMonitor from './pages/NewsMonitor';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="market-overview" element={<MarketOverview />} />
        <Route path="company/:ticker" element={<CompanyDetails />} />
        <Route path="sector-analysis" element={<SectorAnalysis />} />
        <Route path="news-monitor" element={<NewsMonitor />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;