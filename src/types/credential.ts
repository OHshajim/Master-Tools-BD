
// Credential types - Updated with userId for user-specific credentials
export interface Credential {
  _id?: string;
  planId: string;
  platformId: string;
  platform?: string; // For backward compatibility
  username: string;
  password: string;
  email?: string;
  domain?: string;
  updatedAt?: string;
  userId?: string; // New field for user-specific credentials
  isDrafted?: boolean; // Global draft status - hides from all users' Access Page
}
