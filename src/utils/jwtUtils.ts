
export const jwtTokenUtils = {
  /**
   * Generate a JWT-like token for API access
   */
  generateToken: (payload: any, expiresAt: string): string => {
    const header = {
      alg: "HS256",
      typ: "JWT"
    };

    const tokenPayload = {
      ...payload,
      isExternal: true, // Always true since only external tokens are supported
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(new Date(expiresAt).getTime() / 1000)
    };

    // Create a simple base64 encoded token for demo purposes
    // In production, you'd use a proper JWT library with secret signing
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(tokenPayload));
    const signature = btoa(`${encodedHeader}.${encodedPayload}.signature`);
    
    return `mt_${encodedHeader}.${encodedPayload}.${signature}`;
  },

  /**
   * Decode token payload (for display purposes)
   */
  decodeToken: (token: string): any => {
    try {
      if (token.startsWith('mt_')) {
        const tokenPart = token.substring(3);
        const parts = tokenPart.split('.');
        if (parts.length >= 2) {
          return JSON.parse(atob(parts[1]));
        }
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Check if token is valid format
   */
  isValidTokenFormat: (token: string): boolean => {
    return token.startsWith('mt_') && token.split('.').length === 3;
  }
};
