
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Credential } from '@/types/dataTypes';

interface DeleteCredentialDialogProps {
  isOpen: boolean;
  credential: Credential | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteCredentialDialog = ({
  isOpen,
  credential,
  onClose,
  onConfirm
}: DeleteCredentialDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Credential</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the credential for {credential?.platform || credential?.platformId}? 
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
