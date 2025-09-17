
export interface DraftPlatformStatus {
  _id: string;
  userId: string;
  planId: string;
  platformId: string;
  type: 'credential' | 'cookie';
  isDrafted: boolean;
  draftedAt: string;
  draftedBy: string;
}
