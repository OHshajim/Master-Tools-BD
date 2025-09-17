
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDataContext } from '@/hooks/useDataContext';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2, Copy, Database, Eye, EyeOff } from 'lucide-react';
import { QuickEditCredentialModal } from './QuickEditCredentialModal';
import { UserSpecificCredential } from '@/hooks/providers/credentials/useUserSpecificCredentialProvider';

interface BulkUserCredentialTableProps {
  credentials: UserSpecificCredential[];
  getPlanName: (planId: string) => string;
}

export const BulkUserCredentialTable: React.FC<BulkUserCredentialTableProps> = ({
  credentials,
  getPlanName
}) => {
  const { deleteUserSpecificCredential } = useDataContext();
  const [editingCredential, setEditingCredential] = useState<UserSpecificCredential | null>(null);
  const [deletingCredential, setDeletingCredential] = useState<UserSpecificCredential | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  const handleEdit = (credential: UserSpecificCredential) => {
    setEditingCredential(credential);
  };

  const handleDelete = (credential: UserSpecificCredential) => {
    setDeletingCredential(credential);
  };

  const confirmDelete = () => {
    if (deletingCredential) {
      deleteUserSpecificCredential(deletingCredential._id);
      setDeletingCredential(null);
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

  const togglePasswordVisibility = (credentialId: string) => {
    const newVisiblePasswords = new Set(visiblePasswords);
    if (newVisiblePasswords.has(credentialId)) {
      newVisiblePasswords.delete(credentialId);
    } else {
      newVisiblePasswords.add(credentialId);
    }
    setVisiblePasswords(newVisiblePasswords);
  };

  if (credentials.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No user-specific credentials found</p>
        <p className="text-sm">Add credentials through the Single User Credentials page</p>
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
              <TableHead>Username</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.map((credential) => (
              <TableRow key={credential._id}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{credential.userId}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{getPlanName(credential.planId)}</Badge>
                </TableCell>
                <TableCell className="font-medium">{credential.platform}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[150px]">{credential.username}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(credential.username, 'Username')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">
                      {visiblePasswords.has(credential._id) ? credential.password : '••••••••'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePasswordVisibility(credential._id)}
                    >
                      {visiblePasswords.has(credential._id) ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(credential.password, 'Password')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{credential.domain || '-'}</TableCell>
                <TableCell className="text-xs text-gray-500">
                  {credential.updatedAt && new Date(credential.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(credential)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(credential)}
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
      {editingCredential && (
        <QuickEditCredentialModal 
          credential={editingCredential}
          onClose={() => setEditingCredential(null)}
          getPlanName={getPlanName}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingCredential} onOpenChange={() => setDeletingCredential(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credential</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this credential for {deletingCredential?.platform}?
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
