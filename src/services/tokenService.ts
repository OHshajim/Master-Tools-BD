
import { secureApi } from '@/hooks/axios/useAxios';
import { Token, CreateTokenRequest } from '@/types/tokenTypes';
import { jwtTokenUtils } from '@/utils/jwtUtils';

export const tokenService = {
  /**
   * Create a new API token
   */
  createToken: async( tokenData: CreateTokenRequest) => {
    const newToken: Token = {
      _id: crypto.randomUUID(),
      name: tokenData.name,
      role: tokenData.role,
      token: jwtTokenUtils.generateToken({
        name: tokenData.name,
        role: tokenData.role,
        isExternal: true, // Always true since only external tokens are supported
        description: tokenData.description || '',
        targetPlanIds: tokenData.targetPlanIds || []
      }, tokenData.expiresAt),
      expiresAt: tokenData.expiresAt,
      description: tokenData.description,
      isActive: true,
      createdAt: new Date().toISOString(),
      targetPlanIds: tokenData.targetPlanIds
    };
    const { data } = await secureApi.post("/api/tokens", newToken);
    return data;
  },

  /**
   * Update token status
   */
  updateTokenStatus: async( tokenId: string, isActive: boolean)=> {
    const { data } = await secureApi.patch(
        `/api/tokens/${tokenId}/status`,
        {
            isActive,
        }
    );
    return data;
  },

  /**
   * Delete token
   */
  deleteToken: async( tokenId: string) => {
    await secureApi.delete(`/api/tokens/${tokenId}`);
  },

  /**
   * Update last used timestamp
   */
  updateLastUsed: async( tokenId: string) => {
    const { data } = await secureApi.patch(
        `/api/tokens/${tokenId}/lastUsed`
    );
    return data;
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (token: Token): boolean => {
    return new Date() > new Date(token.expiresAt);
  },

  /**
   * Get tokens for specific platform/plan
   */
  getTokensForPlan: (tokens: Token[], planId: string): Token[] => {
    return tokens.filter(token => 
      token.isActive && 
      !tokenService.isTokenExpired(token) &&
      (token.targetPlanIds?.includes(planId) || !token.targetPlanIds)
    );
  }
};
