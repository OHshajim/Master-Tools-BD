
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDataContext } from '@/hooks/useDataContext';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2, Copy, Database } from 'lucide-react';
import { QuickEditCookieModal } from './QuickEditCookieModal';
import { UserSpecificCookie } from '@/hooks/providers/cookies/useUserSpecificCookieProvider';

interface BulkUserCookieTableProps {
  cookies: UserSpecificCookie[];
  getPlanName: (planId: string) => string;
}

export const BulkUserCookieTable: React.FC<BulkUserCookieTableProps> = ({
  cookies,
  getPlanName
}) => {
  const { deleteUserSpecificCookie } = useDataContext();
  const [editingCookie, setEditingCookie] = useState<UserSpecificCookie | null>(null);
  const [deletingCookie, setDeletingCookie] = useState<UserSpecificCookie | null>(null);

  const handleEdit = (cookie: UserSpecificCookie) => {
    setEditingCookie(cookie);
  };

  const handleDelete = (cookie: UserSpecificCookie) => {
    setDeletingCookie(cookie);
  };

  const confirmDelete = () => {
    if (deletingCookie) {
      deleteUserSpecificCookie(deletingCookie._id);
      setDeletingCookie(null);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: `${type} copied to clipboard`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard"
      });
    }
  };

  if (cookies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No user-specific cookies found</p>
        <p className="text-sm">Add cookies through the Single User Cookies page</p>
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
              <TableHead>Cookie Data</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cookies.map((cookie) => (
              <TableRow key={cookie._id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{cookie.userId}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{getPlanName(cookie.planId)}</Badge>
                </TableCell>
                <TableCell className="font-medium">{cookie.platform}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[200px]">
                      {(cookie.cookieData || cookie.value)?.substring(0, 50)}...
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(cookie.cookieData || cookie.value, 'Cookie')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{cookie.domain || '-'}</TableCell>
                <TableCell className="text-xs text-gray-500">
                  {cookie.updatedAt && new Date(cookie.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(cookie)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cookie)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Modal */}
      {editingCookie && (
        <QuickEditCookieModal 
          cookie={editingCookie}
          onClose={() => setEditingCookie(null)}
          getPlanName={getPlanName}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCookie} onOpenChange={() => setDeletingCookie(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cookie</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this cookie for {deletingCookie?.platform}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
