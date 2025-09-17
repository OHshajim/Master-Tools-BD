
// Cookie types - Updated with userId for user-specific cookies
export interface Cookie {
  _id?: string;
  planId: string;
  platformId: string;
  platform?: string; // For backward compatibility
  name: string;
  value: string;
  cookieData?: string; // For backward compatibility
  domain?: string;
  updatedAt?: string;
  isPinned?: boolean;
  pinnedAt?: string;
  userId?: string; // New field for user-specific cookies
  isDrafted?: boolean; // Global draft status - hides from all users' Access Page
}
