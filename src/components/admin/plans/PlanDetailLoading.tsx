
import React from 'react';
import { Button } from '@/components/ui/button';

interface PlanDetailLoadingProps {
  navigateBack: () => void;
}

const PlanDetailLoading: React.FC<PlanDetailLoadingProps> = ({ navigateBack }) => {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <p>Loading plan details...</p>
      <Button onClick={navigateBack} className="mt-4">
        Back to Plans
      </Button>
    </div>
  );
};

export default PlanDetailLoading;
