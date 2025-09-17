import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDataContext } from '@/hooks/useDataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, RotateCcw, User } from 'lucide-react';
import { DraftPlatformStatus } from '@/types';

interface BulkDraftCredentialTableProps {
  draftPlatforms: DraftPlatformStatus[];
  getPlanName: (planId: string) => string;
  getPlatformName: (platformId: string) => string;
}

export const BulkDraftCredentialTable: React.FC<BulkDraftCredentialTableProps> = ({
  draftPlatforms,
  getPlanName,
  getPlatformName
}) => {
  const { togglePlatformDraft } = useDataContext();
  const { user } = useAuth();
  const [restoringDraft, setRestoringDraft] = useState<DraftPlatformStatus | null>(null);

  const handleRestore = (draft: DraftPlatformStatus) => {
    setRestoringDraft(draft);
  };

  const confirmRestore = () => {
    if (restoringDraft && user) {
      togglePlatformDraft(
        restoringDraft.userId,
        restoringDraft.planId,
        restoringDraft.platformId,
        restoringDraft.type,
        user._id
      );
      
      toast({
        title: "Platform Restored",
        description: "The credential platform has been restored to the user's access page."
      });
      setRestoringDraft(null);
    }
  };

  if (draftPlatforms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <EyeOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No drafted credential platforms found</p>
        <p className="text-sm">All credential platforms are currently visible to users</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Drafted By</TableHead>
              <TableHead>Drafted Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draftPlatforms.map((draft) => (
              <TableRow key={draft._id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <Badge variant="outline">{draft.userId}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{getPlanName(draft.planId)}</Badge>
                </TableCell>
                <TableCell className="font-medium">{getPlatformName(draft.platformId)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {draft.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{draft.draftedBy}</Badge>
                </TableCell>
                <TableCell className="text-xs text-gray-500">
                  {new Date(draft.draftedAt).toLocaleDateString()} {new Date(draft.draftedAt).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Badge variant={draft.isDrafted ? "destructive" : "default"}>
                    <EyeOff className="h-3 w-3 mr-1" />
                    {draft.isDrafted ? 'Hidden' : 'Visible'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(draft)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Restore Confirmation */}
      <AlertDialog open={!!restoringDraft} onOpenChange={() => setRestoringDraft(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Platform</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore {getPlatformName(restoringDraft?.platformId || '')} for user {restoringDraft?.userId}?
              This will make the platform visible on their access page again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore}>Restore Platform</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};