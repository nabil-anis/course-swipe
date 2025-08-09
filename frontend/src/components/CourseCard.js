import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink } from 'lucide-react';

const CourseCard = ({ course, type }) => {
  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <h4 className="font-serif text-lg text-gray-900 mb-3 leading-tight">
          {course.course_name}
        </h4>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description.length > 120 
            ? course.description.substring(0, 120) + '...'
            : course.description
          }
        </p>

        <div className="border-t border-gray-200 pt-4">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gray-50 transition-colors"
            onClick={() => window.open(course.link, '_blank')}
          >
            <ExternalLink size={14} />
            <span>View Course</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;