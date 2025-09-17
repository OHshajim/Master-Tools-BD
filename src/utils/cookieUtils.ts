
/**
 * Utility functions for managing cookies for platform access
 */

// Define Chrome API types to handle the TypeScript errors
declare namespace chrome {
  namespace cookies {
    interface Cookie {
      name: string;
      value: string;
      domain: string;
      path?: string;
      secure?: boolean;
      httpOnly?: boolean;
      sameSite?: 'strict' | 'lax' | 'none';
      expirationDate?: number;
      url?: string;
    }
    
    function set(details: Cookie): Promise<Cookie>;
  }
}

/**
 * Parse cookie string data into an array of cookie objects
 * @param cookieData String containing cookie data
 * @returns Array of cookie objects with name, value, domain, etc.
 */
export function parseCookies(cookieData: string): any[] {
  try {
    // Try to parse the cookie data as JSON
    return JSON.parse(cookieData);
  } catch (error) {
    console.error('Error parsing cookie data:', error);
    throw new Error('Invalid cookie format');
  }
}

/**
 * Set cookies for a specific platform
 * @param cookieData Cookie data as string (JSON format)
 * @param domain Domain to set the cookies for
 * @returns Promise indicating success or failure
 */
export async function setCookiesForPlatform(cookieData: string, domain: string): Promise<boolean> {
  try {
    const cookies = parseCookies(cookieData);
    
    // Check if we have access to the Chrome extension API
    if (typeof chrome !== 'undefined' && chrome.cookies) {
      // Using Chrome extension API (for browser extensions)
      for (const cookie of cookies) {
        await chrome.cookies.set({
          url: `https://${domain}`,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain || `.${domain}`,
          path: cookie.path || '/',
          secure: cookie.secure || true,
          httpOnly: cookie.httpOnly || false,
          sameSite: cookie.sameSite || 'lax',
          expirationDate: cookie.expirationDate || (Date.now() / 1000) + 86400 * 30, // 30 days default
        });
      }
      return true;
    } else {
      // Fallback method for web pages (with limitations)
      // Note: This method has limitations due to browser security restrictions
      // It can only set cookies for the current domain
      cookies.forEach(cookie => {
        // For each cookie, create a cookie string
        const cookieString = `${cookie.name}=${cookie.value}; path=${cookie.path || '/'}; domain=${cookie.domain || domain}; ${cookie.secure ? 'secure;' : ''} ${cookie.httpOnly ? 'httpOnly;' : ''} max-age=${cookie.maxAge || 86400 * 30}`;
        
        // Try to set the cookie
        try {
          document.cookie = cookieString;
        } catch (e) {
          console.warn(`Failed to set cookie "${cookie.name}" due to browser security restrictions:`, e);
        }
      });
      
      console.warn('Using fallback cookie method. Due to browser security restrictions, direct cookie access may be limited.');
      return false;
    }
  } catch (error) {
    console.error('Error setting cookies:', error);
    throw new Error('Failed to set cookies');
  }
}

/**
 * Get a sanitized domain from a URL or domain string
 * @param domain Domain or URL
 * @returns Clean domain without protocol and www
 */
export function getSanitizedDomain(domain: string): string {
  // Remove protocol if present
  let cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Remove path, query parameters, etc.
  cleanDomain = cleanDomain.split('/')[0];
  
  return cleanDomain;
}
