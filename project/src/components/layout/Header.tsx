import React, { useState } from 'react';
import { Bell, Menu, Search, X, Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 py-3 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="md:hidden text-gray-300 mr-4"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            className="py-2 pl-10 pr-4 bg-gray-700 rounded-md w-48 md:w-64 lg:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            placeholder={language === 'en' ? "Search companies, sectors, news..." : "ابحث عن الشركات، القطاعات، الأخبار..."}
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-300 hover:bg-gray-700 rounded-full"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="p-2 text-gray-300 hover:bg-gray-700 rounded-full"
          aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <Globe size={20} />
        </button>
        
        {/* Notifications */}
        <button 
          className="p-2 text-gray-300 hover:bg-gray-700 rounded-full relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        {/* User Profile */}
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <span className="text-sm font-semibold">JD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;