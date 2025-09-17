
import { Plan } from '@/types/dataTypes';

/**
 * Service for managing plan slugs
 */
export const slugService = {
  /**
   * Generate a URL-safe slug from a string
   */
  generateSlug: (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  },

  /**
   * Check if a slug is unique among existing plans
   */
  isSlugUnique: (plans: Plan[], slug: string, excludePlanId?: string): boolean => {
    return !plans.some(plan => 
      plan.slug === slug && plan._id !== excludePlanId
    );
  },

  /**
   * Generate a unique slug for a plan
   */
  generateUniqueSlug: (plans: Plan[], baseName: string, excludePlanId?: string): string => {
    let slug = slugService.generateSlug(baseName);
    let counter = 1;
    
    while (!slugService.isSlugUnique(plans, slug, excludePlanId)) {
      slug = `${slugService.generateSlug(baseName)}-${counter}`;
      counter++;
    }
    
    return slug;
  },

  /**
   * Find plan by slug - only searches through public (non-draft) plans by default
   */
  findPlanBySlug: (plans: Plan[], slug: string, includeDrafts: boolean = false): Plan | undefined => {
    const searchPlans = includeDrafts ? plans : plans.filter(plan => !plan.isDraft);
    return searchPlans.find(plan => plan.slug === slug);
  }
};
