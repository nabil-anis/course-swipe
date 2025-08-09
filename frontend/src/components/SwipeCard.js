import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';
import { useSwipe } from '../context/SwipeContext';

const SwipeCard = ({ course }) => {
  const { swipeLeft, swipeRight, showInstructions } = useSwipe();
  const [exitX, setExitX] = useState(0);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      setExitX(300);
      setTimeout(() => swipeRight(course), 150);
    } else if (info.offset.x < -100) {
      setExitX(-300);
      setTimeout(() => swipeLeft(course), 150);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Instructions Overlay */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-70 z-10 rounded-xl flex items-center justify-center"
        >
          <div className="text-white text-center px-6">
            <p className="text-lg font-medium mb-2">Swipe right to save this course.</p>
            <p className="text-lg font-medium">Swipe left to ignore.</p>
          </div>
        </motion.div>
      )}

      <motion.div
        className="w-full"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ x: exitX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileDrag={{ scale: 1.05, cursor: "grabbing" }}
      >
        <Card className="w-full bg-white shadow-lg border-0 rounded-xl overflow-hidden">
          <div className="p-8">
            <h3 className="text-xl font-serif text-gray-900 mb-4 leading-tight">
              {course.course_name}
            </h3>
            
            <p className="text-gray-600 leading-relaxed mb-8 text-sm">
              {course.description}
            </p>

            <div className="border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(course.link, '_blank');
                }}
              >
                <ExternalLink size={16} />
                <span>View Course</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SwipeCard;