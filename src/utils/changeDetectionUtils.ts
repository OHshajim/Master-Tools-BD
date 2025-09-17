
import { Credential, Cookie } from '@/types/dataTypes';

/**
 * Normalize platform ID for consistent comparison
 */
export const normalizePlatformId = (platformId: string, platform: string): string => {
  return platformId || platform || '';
};

/**
 * Compare two credentials to detect changes
 */
export const hasCredentialChanges = (
  original: Credential,
  updated: Partial<Credential & { platformId?: string; platform?: string }>
): boolean => {
  if (!original || !updated) return true;

  const originalPlatformId = normalizePlatformId(
    original.platformId || '', 
    original.platform || ''
  );
  const updatedPlatformId = normalizePlatformId(
    updated.platformId || '', 
    updated.platform || ''
  );

  return (
    originalPlatformId !== updatedPlatformId ||
    original.username !== updated.username ||
    original.password !== updated.password ||
    original.domain !== updated.domain ||
    original.planId !== updated.planId
  );
};

/**
 * Compare two cookies to detect changes
 */
export const hasCookieChanges = (
  original: Cookie,
  updated: Partial<Cookie & { platformId?: string; platform?: string; cookieData?: string }>
): boolean => {
  if (!original || !updated) return true;

  const originalPlatformId = normalizePlatformId(
    original.platformId || '', 
    original.platform || ''
  );
  const updatedPlatformId = normalizePlatformId(
    updated.platformId || '', 
    updated.platform || ''
  );

  const originalCookieData = original.cookieData || original.value || '';
  const updatedCookieData = updated.cookieData || updated.value || '';

  return (
    originalPlatformId !== updatedPlatformId ||
    originalCookieData !== updatedCookieData ||
    original.domain !== updated.domain ||
    original.planId !== updated.planId
  );
};

/**
 * Compare two arrays for deep equality
 */
export const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) return false;
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.every((val, index) => val === sorted2[index]);
};

/**
 * Compare two plans to detect changes
 */
export const hasPlanChanges = (
  original: any,
  updated: {
    name: string;
    description: string;
    price: number;
    platforms: string[];
    benefits: string[];
    stickerText?: string;
    stickerColor?: string;
    durationType: string;
    durationValue: number;
    slug: string;
    isDraft: boolean;
  }
): boolean => {
  if (!original || !updated) return true;

  // Filter empty benefits for comparison
  const originalBenefits = (original.benefits || []).filter((b: string) => b.trim() !== '');
  const updatedBenefits = updated.benefits.filter(b => b.trim() !== '');

  return (
    original.name !== updated.name ||
    original.description !== updated.description ||
    original.price !== updated.price ||
    !arraysEqual(original.platforms || [], updated.platforms) ||
    !arraysEqual(originalBenefits, updatedBenefits) ||
    (original.stickerText || '') !== (updated.stickerText || '') ||
    (original.stickerColor || '') !== (updated.stickerColor || '') ||
    (original.durationType || 'months') !== updated.durationType ||
    (original.durationValue || 1) !== updated.durationValue ||
    (original.slug || '') !== updated.slug ||
    (original.isDraft || false) !== updated.isDraft
  );
};
