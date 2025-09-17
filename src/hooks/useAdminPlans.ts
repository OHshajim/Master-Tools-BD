
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Plan, Platform } from '@/types/dataTypes';
import { toast } from '@/components/ui/sonner';
import { planValidationService } from '@/services/planValidationService';
import { planApi } from '@/services/planApi';

export const useAdminPlans = () => {
  const navigate = useNavigate();
  const {
      plans,
      platforms,
      orders,
      addPlan,
      updatePlan,
      deletePlan,
  } = useData();
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  
  // Count of currently selected homepage plans
  const [homepagePlansCount, setHomepagePlansCount] = useState(0);
  // Track the highest homepage order value
  const [nextHomepageOrder, setNextHomepageOrder] = useState(0);
  
  // Filter plans based on search query
  useEffect(() => {
      if (searchQuery) {
          const query = searchQuery.toLowerCase();
          setFilteredPlans(
              plans.filter(
                  (plan) =>
                      plan.name.toLowerCase().includes(query) ||
                      plan.description.toLowerCase().includes(query)
              )
          );
      } else {
          setFilteredPlans([...plans]);
      }
  }, [plans, searchQuery]);
  
  // Count homepage plans and determine next homepage order
  useEffect(() => {
    const homepagePlans = plans.filter(plan => plan.showOnHomepage);
    setHomepagePlansCount(homepagePlans.length);
    
    // Find the highest current order value
    if (homepagePlans.length > 0) {
      const highestOrder = Math.max(...homepagePlans.map(plan => 
        plan.homepageOrder !== undefined ? plan.homepageOrder : -1
      ));
      setNextHomepageOrder(highestOrder + 1);
    } else {
      setNextHomepageOrder(0);
    }
  }, [plans]);
  
  const handleCreatePlan = async (
      newPlan: Omit<Plan, "_id" | "createdAt" | "updatedAt">
  ) => {
      try {
          await addPlan(newPlan);
          setIsCreateDialogOpen(false);
      } catch (error) {
          toast.error("Failed to create plan");
          console.error(error);
      }
  };
  
  const handleDeletePlan = () => {
    if (!currentPlan) return;
    
    // Validate before deletion
    const validation = planValidationService.getPlanDeletionMessage(orders, currentPlan._id);
    
    if (!validation.canDelete) {
      toast.error(validation.message);
      setIsDeleteDialogOpen(false);
      setCurrentPlan(null);
      return;
    }
    
    try {
      // Archive the plan data before deletion
      const planData = {
        plan: currentPlan,
        relatedOrders: orders.filter(order => order.planId === currentPlan._id),
        deletedAt: new Date().toISOString()
      };
      
      deletePlan(currentPlan._id);
      setIsDeleteDialogOpen(false);
      setCurrentPlan(null);
      toast.success("Plan deleted successfully and archived");
    } catch (error) {
      toast.error("Failed to delete plan");
      console.error(error);
    }
  };
  
  const getPlatformNames = (platformIds: string[]): string[] => {
    return platformIds
      .map(id => platforms.find(p => p._id === id)?.name)
      .filter(Boolean) as string[];
  };
  
  const toggleHomepageDisplay = async (plan: Plan) => {
      if (!plan) return;

      try {
          const response = await planApi.TogglePlan(plan._id);
          toast.success(
              `Plan ${
                  response.plan.showOnHomepage ? "added to" : "removed from"
              } homepage`
          );
          updatePlan(response.plan);
      } catch (err) {
          console.error("Failed to update plan:", err);
          toast.error(err.message || "Failed to update homepage display");
      }
  };
  
  // Helper function to format duration display
  const formatDuration = (durationType: string, durationValue: number): string => {
    if (durationValue === 1) {
      // Singular form
      return `1 ${durationType.slice(0, -1)}`;
    }
    return `${durationValue} ${durationType}`;
  };

  // Helper function to check if a plan has active subscriptions
  const planHasActiveSubscriptions = (planId: string): boolean => {
    return planValidationService.hasActiveSubscriptions(orders, planId);
  };

  // Helper function to check if a plan has pending subscriptions
  const planHasPendingSubscriptions = (planId: string): boolean => {
    return planValidationService.hasPendingSubscriptions(orders, planId);
  };

  // Helper function to get active subscriptions count for a plan
  const getActiveSubscriptionsCount = (planId: string): number => {
    return planValidationService.getActiveSubscriptionsCount(orders, planId);
  };

  // Helper function to get pending subscriptions count for a plan
  const getPendingSubscriptionsCount = (planId: string): number => {
    return planValidationService.getPendingSubscriptionsCount(orders, planId);
  };

  // Helper function to check if plan can be deleted
  const canDeletePlan = (planId: string): boolean => {
    const validation = planValidationService.getPlanDeletionMessage(orders, planId);
    return validation.canDelete;
  };
  
  return {
    plans,
    filteredPlans,
    setFilteredPlans,
    searchQuery,
    setSearchQuery,
    homepagePlansCount,
    nextHomepageOrder,
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    currentPlan,
    setCurrentPlan,
    platforms,
    orders,
    handleCreatePlan,
    handleDeletePlan,
    toggleHomepageDisplay,
    getPlatformNames,
    formatDuration,
    planHasActiveSubscriptions,
    planHasPendingSubscriptions,
    getActiveSubscriptionsCount,
    getPendingSubscriptionsCount,
    canDeletePlan,
    navigate
  };
};
