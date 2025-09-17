
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  selectedRole: 'admin' | 'manager' | 'support' | 'user';
  isProcessing: boolean;
  onRoleChange: (role: 'admin' | 'manager' | 'support' | 'user') => void;
  onConfirm: () => void;
}

export const ChangeRoleDialog = ({
  open,
  onOpenChange,
  selectedUser,
  selectedRole,
  isProcessing,
  onRoleChange,
  onConfirm
}: ChangeRoleDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Change the role of {selectedUser?.name} to give them different permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <label className="block text-sm font-medium mb-2">
            Select Role
          </label>
          <Select
            value={selectedRole}
            onValueChange={(value) => onRoleChange(value as 'admin' | 'manager' | 'support' | 'user')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="mt-4 text-sm">
            <p className="font-medium mb-1">Role Permissions:</p>
            {selectedRole === 'admin' && (
              <p>Full access to all features and administration controls.</p>
            )}
            {selectedRole === 'manager' && (
              <p>Access to all controls similar to admin, through the Manager dashboard.</p>
            )}
            {selectedRole === 'support' && (
              <p>Limited access to support features: credentials, cookies, notifications, and orders.</p>
            )}
            {selectedRole === 'user' && (
              <p>Standard user access to subscriptions and personal settings only.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isProcessing || (selectedUser?.role === selectedRole)}
          >
            {isProcessing ? "Processing..." : "Change Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
