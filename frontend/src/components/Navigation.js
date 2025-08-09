import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Compass, History } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex justify-center mb-8">
      <div className="flex bg-white rounded-full border border-gray-200 shadow-sm overflow-hidden">
        <Button
          variant={location.pathname === '/' ? 'default' : 'ghost'}
          className={`rounded-full px-6 py-2 flex items-center space-x-2 transition-all ${
            location.pathname === '/' 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => navigate('/')}
        >
          <Compass size={16} />
          <span>Discover</span>
        </Button>
        <Button
          variant={location.pathname === '/history' ? 'default' : 'ghost'}
          className={`rounded-full px-6 py-2 flex items-center space-x-2 transition-all ${
            location.pathname === '/history' 
              ? 'bg-black text-white hover:bg-gray-800' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
          onClick={() => navigate('/history')}
        >
          <History size={16} />
          <span>History</span>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;