
import React from 'react';
import { Button } from '@/components/ui/button';

interface PlanNotFoundProps {
  navigateBack: () => void;
}

const PlanNotFound: React.FC<PlanNotFoundProps> = ({ navigateBack }) => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
      <p className="mb-4">The plan you are looking for does not exist.</p>
      <Button onClick={navigateBack}>View All Plans</Button>
    </div>
  );
};

export default PlanNotFound;
