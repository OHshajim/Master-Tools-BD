import { useState } from 'react';
import { useTokenProvider } from '@/hooks/providers/useTokenProvider';
import { CreateTokenRequest } from '@/types/tokenTypes';
import { toast } from '@/components/ui/sonner';
import TokenForm from '@/components/admin/tokens/TokenForm';
import TokenList from '@/components/admin/tokens/TokenList';
import ExtensionInstructions from '@/components/admin/tokens/ExtensionInstructions';
import BackToAdminButton from '@/components/admin/BackToAdminButton';

const AdminTokens = () => {
  const { 
    tokens, 
    createToken, 
    updateTokenStatus, 
    deleteToken 
  } = useTokenProvider();

  const handleCreateToken = (tokenData: CreateTokenRequest) => {
    try {
      const newToken = createToken(tokenData);
      toast.success(`Token "${newToken.name}" created successfully`);
    } catch (error) {
      toast.error('Failed to create token');
      console.error('Token creation error:', error);
    }
  };

  const handleUpdateStatus = (tokenId: string, isActive: boolean) => {
    updateTokenStatus(tokenId, isActive);
    toast.success(`Token ${isActive ? 'activated' : 'deactivated'}`);
  };

  const handleDeleteToken = (tokenId: string) => {
    deleteToken(tokenId);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">API Token Management</h1>
      <p className="text-gray-600 mb-8">
        Create and manage API tokens for external services and extensions
      </p>

      <BackToAdminButton />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token Creation Form */}
        <div className="lg:col-span-1">
          <TokenForm onCreateToken={handleCreateToken} />
        </div>

        {/* Token List and Instructions */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Tokens</h2>
            <TokenList 
              tokens={tokens}
              onUpdateStatus={handleUpdateStatus}
              onDeleteToken={handleDeleteToken}
            />
          </div>

          <ExtensionInstructions />
        </div>
      </div>
    </div>
  );
};

export default AdminTokens;
