import React from 'react';
import { Button } from './ui/button';
import { X, Heart } from 'lucide-react';
import { useSwipe } from '../context/SwipeContext';
import { useToast } from '../hooks/use-toast';

const SwipeButtons = ({ course }) => {
  const { swipeLeft, swipeRight } = useSwipe();
  const { toast } = useToast();

  const handleIgnore = () => {
    swipeLeft(course);
  };

  const handleSave = () => {
    swipeRight(course);
    toast({
      title: "Course saved!",
      description: "Added to your saved courses",
      duration: 2000,
    });
  };

  return (
    <div className="flex justify-center space-x-8">
      {/* Ignore Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200"
        onClick={handleIgnore}
      >
        <X className="text-red-500" size={24} />
      </Button>

      {/* Save Button */}
      <Button
        variant="outline"
        size="lg"
        className="w-16 h-16 rounded-full border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
        onClick={handleSave}
      >
        <Heart className="text-green-500" size={24} />
      </Button>
    </div>
  );
};

export default SwipeButtons;