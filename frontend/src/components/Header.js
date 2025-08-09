import React, { useState } from 'react';
import { Moon, Sun, DollarSign, User, Globe } from 'lucide-react';
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
          <p className="text-sm text-gray-600 font-light">Because learning should feel like a perfect match.</p>
        </div>

        {/* Right: Icons and Dark Mode Toggle */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-gray-400">
            <DollarSign size={20} />
            <User size={20} />
            <Globe size={20} />
          </div>
          
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
      </div>

      {/* Bottom right: Made by NBL */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 font-serif">
        Made by NBL.
      </div>
    </header>
  );
};

export default Header;