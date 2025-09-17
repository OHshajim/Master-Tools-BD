
import React from 'react';

interface HeaderContentProps {
  title: string;
  description: string;
}

const HeaderContent: React.FC<HeaderContentProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default HeaderContent;
