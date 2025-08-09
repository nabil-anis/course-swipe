import React from 'react';
import Navigation from '../components/Navigation';
import CourseCard from '../components/CourseCard';
import { useSwipe } from '../context/SwipeContext';
import { Heart, X } from 'lucide-react';

const HistoryPage = () => {
  const { savedCourses, ignoredCourses } = useSwipe();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Navigation />
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-serif text-gray-900">Your Course History</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Saved Courses */}
        <div>
          <div className="flex items-center mb-4">
            <Heart className="text-green-500 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900">Saved ({savedCourses.length})</h3>
          </div>
          <div className="space-y-4">
            {savedCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved courses yet</p>
            ) : (
              savedCourses.map(course => (
                <CourseCard key={course.id} course={course} type="saved" />
              ))
            )}
          </div>
        </div>

        {/* Ignored Courses */}
        <div>
          <div className="flex items-center mb-4">
            <X className="text-red-500 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900">Ignored ({ignoredCourses.length})</h3>
          </div>
          <div className="space-y-4">
            {ignoredCourses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No ignored courses yet</p>
            ) : (
              ignoredCourses.map(course => (
                <CourseCard key={course.id} course={course} type="ignored" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;