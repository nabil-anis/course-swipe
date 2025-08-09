import React from 'react';
import Navigation from '../components/Navigation';
import SwipeCard from '../components/SwipeCard';
import SwipeButtons from '../components/SwipeButtons';
import { useSwipe } from '../context/SwipeContext';
import { Button } from '../components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';

const DiscoverPage = () => {
  const { getCurrentCourse, currentIndex, courses, getRemainingCount, loading, error, refreshCourses } = useSwipe();
  const currentCourse = getCurrentCourse();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Navigation />
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <h2 className="text-2xl font-serif text-gray-900 mb-2">Loading courses...</h2>
          <p className="text-gray-600">Fetching the latest courses from Google Sheets</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Navigation />
        <div className="text-center">
          <h2 className="text-2xl font-serif text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={refreshCourses}
            className="flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Navigation />
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">All courses explored!</h2>
          <p className="text-gray-600 mb-6">You've seen all available courses. Check your history to review your choices.</p>
          <Button 
            onClick={refreshCourses}
            className="flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Refresh Courses</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Navigation />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-900 mb-2">Discover Your Perfect Course</h2>
        <p className="text-gray-600">Because learning should feel like a perfect match.</p>
      </div>

      <div className="flex justify-center mb-6">
        <SwipeCard course={currentCourse} />
      </div>

      <SwipeButtons course={currentCourse} />

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          {currentIndex + 1} of {courses.length} courses
        </p>
      </div>
    </div>
  );
};

export default DiscoverPage;