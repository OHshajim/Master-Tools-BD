
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { Token } from '@/types/tokenTypes';
import { toast } from '@/components/ui/sonner';
import { useDataContext } from '@/hooks/useDataContext';

interface TokenListProps {
  tokens: Token[];
  onUpdateStatus: (tokenId: string, isActive: boolean) => void;
  onDeleteToken: (tokenId: string) => void;
}

const TokenList = ({ tokens, onUpdateStatus, onDeleteToken }: TokenListProps) => {
  const { plans } = useDataContext();
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());

  const copyToClipboard = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Token for ${tokenName} copied to clipboard`);
  };

  const toggleTokenVisibility = (tokenId: string) => {
    setVisibleTokens(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tokenId)) {
        newSet.delete(tokenId);
      } else {
        newSet.add(tokenId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTargetPlansInfo = (token: Token) => {
    if (!token.targetPlanIds || token.targetPlanIds.length === 0) {
      return 'All matching plans';
    }
    
    const targetPlans = plans.filter(plan => token.targetPlanIds!.includes(plan._id));
    return targetPlans.map(plan => plan.name).join(', ');
  };

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-gray-500">No tokens created yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token) => (
        <Card key={token._id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{token.name}</CardTitle>
                <Badge variant={token.isActive ? 'default' : 'destructive'}>
                  {token.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={token.isActive}
                  onCheckedChange={(checked) => onUpdateStatus(token._id, checked)}
                />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Token</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the token "{token.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeleteToken(token._id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {token.description && (
              <p className="text-sm text-gray-600">{token.description}</p>
            )}
            
            {/* Token Display - Responsive Layout */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Bearer Token:</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <code className="flex-1 bg-gray-50 px-3 py-2 rounded text-sm font-mono break-all overflow-wrap-anywhere max-w-full min-w-0">
                  {visibleTokens.has(token._id) 
                    ? token.token 
                    : '•'.repeat(20) + token.token.slice(-8)
                  }
                </code>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTokenVisibility(token._id)}
                    className="w-full sm:w-auto"
                  >
                    {visibleTokens.has(token._id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(token.token, token.name)}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Target Plans Info - Always shown since all tokens are external */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Plans:</label>
              <p className="text-sm text-gray-600">{getTargetPlansInfo(token)}</p>
            </div>
            
            {/* Token Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Created:</span>
                <div className="text-gray-600">{formatDate(token.createdAt)}</div>
              </div>
              <div>
                <span className="font-medium">Expires:</span>
                <div className="text-gray-600">{formatDate(token.expiresAt)}</div>
              </div>
              {token.lastUsed && (
                <div className="col-span-2">
                  <span className="font-medium">Last Used:</span>
                  <div className="text-gray-600">{formatDate(token.lastUsed)}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TokenList;
