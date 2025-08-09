import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SwipeContext = createContext();

export const useSwipe = () => {
  const context = useContext(SwipeContext);
  if (!context) {
    throw new Error('useSwipe must be used within a SwipeProvider');
  }
  return context;
};

export const SwipeProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedCourses, setSavedCourses] = useState([]);
  const [ignoredCourses, setIgnoredCourses] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [sessionId] = useState('anonymous'); // For now, using anonymous session

  // Fetch courses from Google Sheets via backend
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API}/courses`);
      setCourses(response.data.courses);
      
      // Also fetch existing swipe history
      await fetchSwipeHistory();
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's swipe history
  const fetchSwipeHistory = async () => {
    try {
      const response = await axios.get(`${API}/swipe-history/${sessionId}`);
      const { saved_courses, ignored_courses } = response.data;
      
      // Convert course IDs back to course objects
      setSavedCourses(prev => {
        const savedCourseObjects = courses.filter(course => saved_courses.includes(course.id));
        return savedCourseObjects;
      });
      
      setIgnoredCourses(prev => {
        const ignoredCourseObjects = courses.filter(course => ignored_courses.includes(course.id));
        return ignoredCourseObjects;
      });
      
    } catch (err) {
      console.error('Error fetching swipe history:', err);
    }
  };

  // Record swipe action to backend
  const recordSwipeAction = async (course, action) => {
    try {
      await axios.post(`${API}/swipe-history`, {
        course_id: course.id,
        action: action,
        session_id: sessionId
      });
    } catch (err) {
      console.error('Error recording swipe action:', err);
    }
  };

  const swipeRight = async (course) => {
    setSavedCourses(prev => [...prev, course]);
    setCurrentIndex(prev => prev + 1);
    setShowInstructions(false);
    await recordSwipeAction(course, 'save');
  };

  const swipeLeft = async (course) => {
    setIgnoredCourses(prev => [...prev, course]);
    setCurrentIndex(prev => prev + 1);
    setShowInstructions(false);
    await recordSwipeAction(course, 'ignore');
  };

  const restoreCourse = (course, fromType) => {
    if (fromType === 'saved') {
      setSavedCourses(prev => prev.filter(c => c.id !== course.id));
    } else {
      setIgnoredCourses(prev => prev.filter(c => c.id !== course.id));
    }
    // Note: For full functionality, we'd also want to remove from backend history
  };

  const getCurrentCourse = () => {
    return courses[currentIndex] || null;
  };

  const getRemainingCount = () => {
    return courses.length - currentIndex;
  };

  const refreshCourses = () => {
    fetchCourses();
  };

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Update saved/ignored courses when courses data changes
  useEffect(() => {
    if (courses.length > 0) {
      fetchSwipeHistory();
    }
  }, [courses]);

  const value = {
    courses,
    loading,
    error,
    currentIndex,
    savedCourses,
    ignoredCourses,
    showInstructions,
    swipeRight,
    swipeLeft,
    restoreCourse,
    getCurrentCourse,
    getRemainingCount,
    refreshCourses,
    setShowInstructions
  };

  return (
    <SwipeContext.Provider value={value}>
      {children}
    </SwipeContext.Provider>
  );
};