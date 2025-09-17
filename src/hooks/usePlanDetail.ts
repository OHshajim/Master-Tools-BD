import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/sonner';
import { planApi } from '@/services/planApi';

export const usePlanDetail = (planId: string | undefined) => {
  const { user } = useAuth();
  const { plans, platforms, validateCoupon, createOrder } = useData();
  const navigate = useNavigate();
  
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platformNames, setPlatformNames] = useState<string[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discount, setDiscount] = useState(0);

useEffect(() => {
    if (!planId) return;

    const GetPlan = async () => {
        try {
            setIsLoading(true);
            const selectedPlan = await planApi.getPlanById(planId);
            setPlan(selectedPlan);
            
            const getPlatformNames = (platformIds: string[]) => {
                return platformIds
                    .map((id) => platforms.find((p) => p._id === id)?.name)
                    .filter(Boolean) as string[];
            };

            if (selectedPlan?.platforms) {
                const names = getPlatformNames(selectedPlan.platforms);
                setPlatformNames(names);
            }
        } catch (error) {
            console.error("Error fetching plan:", error);
        } finally {
            setIsLoading(false);
        }
    };

    GetPlan();
}, [planId, platforms]);

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

  const handleBuyNow = () => {
    if (!user) {
      // Redirect to login if not authenticated
      toast.error("Please log in to purchase a plan");
      navigate('/login');
      return;
    }
    
    // Additional check for drafted plan before opening checkout
    if (plan?.isDraft) {
      toast.error("This plan is not available for purchase", {
        description: "The plan you're trying to purchase is currently not available.",
        duration: 5000
      });
      return;
    }
    
    setIsCheckoutOpen(true);
  };

  // Calculate the discounted price
  const discountedPrice = discount > 0
    ? plan?.price * (1 - discount / 100)
    : plan?.price;

  return {
    isLoading,
    plan,
    platformNames,
    isCheckoutOpen,
    setIsCheckoutOpen,
    discount,
    setDiscount,
    discountedPrice,
    formatDuration,
    handleBuyNow,
    user,
    validateCoupon,
    createOrder
  };
};
