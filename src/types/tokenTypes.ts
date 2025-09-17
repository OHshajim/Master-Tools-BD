
export type TokenRole = 'external';

export type Token = {
  _id: string;
  name: string;
  role: TokenRole;
  token: string;
  expiresAt: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  lastUsed?: string;
  targetPlanIds?: string[];
};

export type CreateTokenRequest = {
  name: string;
  role: TokenRole;
  expiresAt: string;
  description?: string;
  targetPlanIds?: string[];
};
