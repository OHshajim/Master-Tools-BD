
import { User } from '@/types/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BlockUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  actionType: 'block' | 'unblock';
  isProcessing: boolean;
  onConfirm: () => void;
}

export const BlockUserDialog = ({
  open,
  onOpenChange,
  selectedUser,
  actionType,
  isProcessing,
  onConfirm
}: BlockUserDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {actionType === 'block' ? 'Block User' : 'Unblock User'}
          </DialogTitle>
          <DialogDescription>
            {actionType === 'block' 
              ? 'This will prevent the user from accessing their account. They will be immediately logged out if currently logged in.'
              : 'This will restore account access for the user.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>
            {actionType === 'block' 
              ? 'Are you sure you want to block' 
              : 'Are you sure you want to unblock'} <strong>{selectedUser?.name}</strong>?
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            variant={actionType === 'block' ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : actionType === 'block' ? "Block User" : "Unblock User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
