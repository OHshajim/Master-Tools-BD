
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import PlanCard from './PlanCard';

const FeaturedPlans = () => {
  const { platforms, plans , loadPlans} = useData();
  const [homepagePlans, setHomepagePlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      await loadPlans();
      setHomepagePlans(plans.filter(plan => plan.showOnHomepage && plan.isDraft === false));
    };
    fetchPlans();
  }, [plans]);

  // Find platforms included in each plan
  const getPlatformNames = (platformIds: string[]) => {
    return platformIds
      .map(id => platforms.find(p => p._id === id)?.name)
      .filter(Boolean) as string[];
  };
  
  // Format duration for display
  const formatDuration = (plan): string => {
    if (!plan.durationType || !plan.durationValue) {
      return "per month"; // Default fallback
    }

    if (plan.durationValue === 1) {
      // Singular form (e.g., "per day" instead of "per days")
      return `per ${plan.durationType.slice(0, -1)}`;
    }
    
    return `per ${plan.durationValue} ${plan.durationType}`;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Featured Plans
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Choose from our most popular subscription plans and start learning today
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {homepagePlans.map((plan) => {
            const platformNames = getPlatformNames(plan.platforms);
            return (
              <PlanCard 
                key={plan._id}
                plan={plan}
                platformNames={platformNames}
                formatDuration={formatDuration}
              />
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/plans">
            <Button variant="outline">View All Plans</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPlans;
