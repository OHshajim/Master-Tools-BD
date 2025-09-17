
import { DurationType } from "@/types/dataTypes";

/**
 * Format service functions for displaying data in user-friendly formats
 */
export const formatService = {
  /**
   * Format plan duration for display
   * @param durationType The type of duration (days, months, years)
   * @param durationValue The numeric duration value
   * @returns Formatted duration string (e.g., "per month", "per 3 months")
   */
  formatPlanDuration: (durationType?: DurationType | string, durationValue?: number): string => {
    if (!durationType || !durationValue) {
      return "per month"; // Default fallback
    }

    if (durationValue === 1) {
      // Singular form (e.g., "per day" instead of "per days")
      return `per ${durationType.slice(0, -1)}`;
    }
    
    return `per ${durationValue} ${durationType}`;
  }
};
