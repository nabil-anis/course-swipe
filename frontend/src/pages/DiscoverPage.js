import React from 'react';
import Navigation from '../components/Navigation';
import SwipeCard from '../components/SwipeCard';
import SwipeButtons from '../components/SwipeButtons';
import { useSwipe } from '../context/SwipeContext';

const DiscoverPage = () => {
  const { getCurrentCourse, currentIndex, courses, getRemainingCount } = useSwipe();
  const currentCourse = getCurrentCourse();

  if (!currentCourse) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Navigation />
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">All courses explored!</h2>
          <p className="text-gray-600">You've seen all available courses. Check your history to review your choices.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Navigation />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-900 mb-2">Discover Your Perfect Course</h2>
        <p className="text-gray-600">Swipe right to save courses you love, left to skip</p>
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