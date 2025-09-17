
import React from 'react';
import StarRating from './StarRating';

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating?: number;
}

const TestimonialCard = ({ name, role, content, rating = 5 }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <div className="flex-1">
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
        <StarRating rating={rating} />
      </div>
      <p className="text-gray-600">"{content}"</p>
    </div>
  );
};

export default TestimonialCard;
