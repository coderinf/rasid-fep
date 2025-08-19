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
    <header className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 py-3 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300 mr-4"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </span>
          <input
            className="py-2 pl-10 pr-4 bg-gray-100 dark:bg-neutral-700 rounded-md w-48 md:w-64 lg:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
            placeholder={language === 'en' ? "Search companies, news..." : "ابحث عن الشركات، الأخبار..."}
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button 
          onClick={toggleLanguage}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
          aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
        >
          <Globe size={20} />
        </button>
        
        <button 
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full relative"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-error-500 rounded-full"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
          <span className="text-sm font-semibold">JD</span>
        </div>
      </div>
    </header>
  );
};

export default Header;