import React, { createContext, useContext, useState } from 'react';
import { mockCourses } from '../data/mock';

const SwipeContext = createContext();

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (!context) {
    throw new Error('useSwipe must be used within a SwipeProvider');
  }
  return context;
};

export const SwipeProvider = ({ children }) => {
  const [courses] = useState(mockCourses);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCourses, setSavedCourses] = useState([]);
  const [ignoredCourses, setIgnoredCourses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);

  const swipeRight = (course) => {
    setSavedCourses(prev => [...prev, course]);
    setCurrentIndex(prev => prev + 1);
    setShowInstructions(false);
  };

  const swipeLeft = (course) => {
    setIgnoredCourses(prev => [...prev, course]);
    setCurrentIndex(prev => prev + 1);
    setShowInstructions(false);
  };

  const restoreCourse = (course, fromType) => {
    if (fromType === 'saved') {
      setSavedCourses(prev => prev.filter(c => c.id !== course.id));
    } else {
      setIgnoredCourses(prev => prev.filter(c => c.id !== course.id));
    }
  };

  const getCurrentCourse = () => {
    return courses[currentIndex] || null;
  };

  const getRemainingCount = () => {
    return courses.length - currentIndex;
  };

  const value = {
    courses,
    currentIndex,
    savedCourses,
    ignoredCourses,
    showInstructions,
    swipeRight,
    swipeLeft,
    restoreCourse,
    getCurrentCourse,
    getRemainingCount,
    setShowInstructions
  };

  return (
    <SwipeContext.Provider value={value}>
      {children}
    </SwipeContext.Provider>
  );
};