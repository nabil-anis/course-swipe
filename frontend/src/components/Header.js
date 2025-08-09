import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Switch } from './ui/switch';

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left: Brand */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-serif text-gray-900">CourseSwipe by NBL</h1>
        </div>

        {/* Right: Dark Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Sun size={18} className={isDarkMode ? 'text-gray-400' : 'text-yellow-500'} />
          <Switch
            checked={isDarkMode}
            onCheckedChange={toggleDarkMode}
            className="data-[state=checked]:bg-gray-800"
          />
          <Moon size={18} className={isDarkMode ? 'text-blue-400' : 'text-gray-400'} />
        </div>
      </div>

      {/* Bottom right: Made by NBL */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 font-serif">
        Made by NBL.
      </div>
    </header>
  );
};

export default Header;