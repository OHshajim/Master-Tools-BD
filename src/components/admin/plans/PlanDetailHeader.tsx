
import React from 'react';
import BackButton from './BackButton';
import HeaderContent from './HeaderContent';

interface PlanDetailHeaderProps {
  planName: string;
  navigateBack: () => void;
  isNewPlan?: boolean;
}

const PlanDetailHeader: React.FC<PlanDetailHeaderProps> = ({ 
  planName, 
  navigateBack,
  isNewPlan = false
}) => {
  const title = isNewPlan ? "Create New Plan" : `Edit Plan: ${planName}`;
  const description = isNewPlan ? "Create a new subscription plan" : "Edit plan details and settings";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
      <div className="flex items-center mb-2">
        <BackButton onClick={navigateBack} />
        <HeaderContent title={title} description={description} />
      </div>
    </div>
  );
};

export default PlanDetailHeader;
