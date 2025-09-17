
import { Plan } from '@/types/dataTypes';

/**
 * Hook for accessing plan-related functionality
 * This hook now accepts the plan data and functions as parameters
 * instead of trying to access the DataContext directly
 */
export const usePlans = (planFunctions: {
  plans: Plan[];
  addPlan: (plan: Omit<Plan, "_id" | "createdAt" | "updatedAt">) => void;
  updatePlan: (plan: Plan) => void;
  deletePlan: (id: string) => void;
  getPlanById: (id: string) => Plan | undefined;
  formatPlanDuration: (durationType?: string, durationValue?: number) => string;
}) => {
  return planFunctions;
};