
import { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import PlanCard from '@/components/home/PlanCard';

const Plans = () => {
  const { platforms, formatPlanDuration ,plans:data} = useData();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
      const fetchPlans = async () => {
          setPlans(data.filter((plan) => plan.isDraft == false));
      };
      fetchPlans();
  }, [data]);


  const getPlatformNames = (platformIds: string[]) => {
    return platformIds
      .map(id => platforms.find(p => p._id === id)?.name)
      .filter(Boolean) as string[];
  };

  // Format duration for display
  const formatDuration = (plan): string => {
    if (!plan?.durationType || !plan?.durationValue) {
      return "per month"; // Default fallback
    }

    if (plan.durationValue === 1) {
      // Singular form (e.g., "per day" instead of "per days")
      return `per ${plan.durationType.slice(0, -1)}`;
    }
    
    return `per ${plan.durationValue} ${plan.durationType}`;
  };

  return (
      <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
              <p className="text-gray-600 text-lg">
                  Select the perfect plan that fits your learning needs
              </p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan) => (
                  <PlanCard
                      key={plan._id}
                      plan={plan}
                      platformNames={getPlatformNames(plan.platforms)}
                      formatDuration={formatDuration}
                  />
              ))}
          </div>

          {plans.length === 0 && (
              <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No plans available.</p>
              </div>
          )}
      </div>
  );
};

export default Plans;
