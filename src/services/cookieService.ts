// Cookie-related service functions

import { Cookie } from "@/types/dataTypes";

/**
 * Cookie service functions for managing cookies
 */
export const cookieService = {
  /**
   * Add a new cookie
   */
  addCookie: (cookies: Cookie[], cookie: Omit<Cookie, 'id'>): Cookie => {
    const newCookie = { 
      ...cookie, 
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      // Ensure consistent platformId - prioritize platformId over platform
      platformId: cookie.platformId || cookie.platform || '',
      // Ensure we have platform name for backward compatibility
      platform: cookie.platform || cookie.platformId || '',
      // Ensure we have a default value if not provided
      value: cookie.value || cookie.cookieData || '',
      domain: cookie.domain || getSanitizedDomain(cookie.platformId || cookie.platform || ''),
      isPinned: cookie.isPinned || false,
      pinnedAt: cookie.isPinned ? new Date().toISOString() : undefined,
      isDrafted: cookie.isDrafted || false
    };
    
    // Reset viewed status for new cookies by updating localStorage directly
    try {
      const viewedCookies = JSON.parse(localStorage.getItem('viewed_cookies') || '{}');
      delete viewedCookies[newCookie.id]; // Ensure new cookie is marked as not viewed
      localStorage.setItem('viewed_cookies', JSON.stringify(viewedCookies));
    } catch (error) {
      console.error('Error updating viewed cookies status:', error);
    }
    
    return newCookie;
  },

  /**
   * Normalize platform ID for consistent comparison
   */
  normalizePlatformId: (platformId: string, platform: string): string => {
    // Prioritize platformId if it exists and is a UUID (not just a number or empty)
    if (platformId && platformId.length > 10 && !(/^\d+$/.test(platformId))) {
      return platformId;
    }
    
    // Otherwise use platform name
    return platform || platformId || '';
  },

  /**
   * Update existing cookie if there are actual changes
   * Returns updated array if changes were made, original array otherwise
   */
  updateCookie: (cookies: Cookie[], cookie: Cookie): Cookie[] => {
    // Find the existing cookie
    const existingCookie = cookies.find(c => c._id === cookie._id);
    
    // If the cookie doesn't exist, no changes can be made
    if (!existingCookie) {
      return cookies;
    }
    
    // Normalize platform IDs for comparison using the improved logic
    const existingPlatformId = cookieService.normalizePlatformId(
      existingCookie.platformId || '', 
      existingCookie.platform || ''
    );
    const newPlatformId = cookieService.normalizePlatformId(
      cookie.platformId || '', 
      cookie.platform || ''
    );
    
    // Check if there are actual content changes (excluding isDrafted field)
    const hasContentChanges = 
      existingPlatformId !== newPlatformId ||
      existingCookie.cookieData !== cookie.cookieData ||
      existingCookie.domain !== cookie.domain ||
      existingCookie.planId !== cookie.planId;
    
    // Check if only draft status changed
    const onlyDraftChanged = 
      !hasContentChanges && 
      existingCookie.isDrafted !== cookie.isDrafted;
    
    console.log('Cookie update analysis:', {
      hasContentChanges,
      onlyDraftChanged,
      existingPlatformId,
      newPlatformId,
      existingDraft: existingCookie.isDrafted,
      newDraft: cookie.isDrafted,
      willUpdateTimestamp: hasContentChanges
    });
    
    // Update if there are content changes OR if only draft status changed
    if (hasContentChanges || onlyDraftChanged) {
      const updatedCookie = {
        ...cookie,
        // Only update updatedAt for content changes, not for draft status changes
        updatedAt: hasContentChanges ? new Date().toISOString() : existingCookie.updatedAt,
        // Preserve pinned status and timestamp
        isPinned: existingCookie.isPinned,
        pinnedAt: existingCookie.pinnedAt,
        // Ensure platformId consistency - use normalized version
        platformId: newPlatformId || existingCookie.platformId,
        platform: cookie.platform || existingCookie.platform
      };
      
      // Only reset viewed status for content changes, not for draft status changes
      if (hasContentChanges) {
        try {
          const viewedCookies = JSON.parse(localStorage.getItem('viewed_cookies') || '{}');
          delete viewedCookies[cookie.id]; // Mark as not viewed since content was updated
          localStorage.setItem('viewed_cookies', JSON.stringify(viewedCookies));
        } catch (error) {
          console.error('Error updating viewed cookies status:', error);
        }
      }
      
      return cookies.map(c => c.id === cookie.id ? updatedCookie : c);
    }
    
    // Return original array if no changes
    return cookies;
  },

  /**
   * Delete cookie
   */
  deleteCookie: (cookies: Cookie[], id: string): Cookie[] => {
    // Remove from viewed cookies in localStorage when deleted
    try {
      const viewedCookies = JSON.parse(localStorage.getItem('viewed_cookies') || '{}');
      delete viewedCookies[id];
      localStorage.setItem('viewed_cookies', JSON.stringify(viewedCookies));
    } catch (error) {
      console.error('Error updating viewed cookies status:', error);
    }
    
    return cookies.filter(c => c._id !== id);
  },

  /**
   * Get cookies for a plan
   */
  getCookiesForPlan: (cookies: Cookie[], planId: string): Cookie[] => {
    return cookies.filter(c => c.planId === planId);
  },

  /**
   * Toggle pinned status for a cookie
   */
  togglePinnedStatus: (cookies: Cookie[], id: string): Cookie[] => {
    return cookies.map(c => {
      if (c.id === id) {
        const isPinning = !c.isPinned;
        return { 
          ...c, 
          isPinned: isPinning,
          // Add pinned timestamp only when setting to pinned, otherwise remove it
          pinnedAt: isPinning ? new Date().toISOString() : undefined
        };
      }
      return c;
    });
  }
};

/**
 * Get a sanitized domain from a URL or platform name
 */
function getSanitizedDomain(platform: string): string {
  // Define specific mappings for common platforms
  const domainMap: Record<string, string> = {
    'udemy': 'udemy.com',
    'coursera': 'coursera.org',
    'skillshare': 'skillshare.com',
    'masterclass': 'masterclass.com',
    'canva': 'canva.com',
    'canva pro': 'canva.com',
    'grammarly': 'grammarly.com',
    'chatgpt': 'chat.openai.com',
    'quillbot': 'quillbot.com',
    'code academy': 'codecademy.com',
    'codecademy': 'codecademy.com',
    'udemy business': 'business.udemy.com',
    'coursera plus': 'coursera.org'
  };

  // Clean up platform name for domain
  const cleanPlatform = platform.toLowerCase().trim();
  
  // Return mapped domain or generate one based on platform name
  return domainMap[cleanPlatform] || `${cleanPlatform.replace(/\s+/g, '')}.com`;
}
