
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plan, Order } from '@/types/dataTypes';
import { planValidationService } from '@/services/planValidationService';

interface DeletePlanDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
  orders: Order[];
  onConfirm: () => void;
}

const DeletePlanDialog: React.FC<DeletePlanDialogProps> = ({
  isOpen,
  onOpenChange,
  plan,
  orders,
  onConfirm
}) => {
  if (!plan) return null;

  const validation = planValidationService.getPlanDeletionMessage(orders, plan.id);
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Plan</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <div>
              Are you sure you want to delete the "{plan.name}" plan?
            </div>
            
            {!validation.canDelete && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-800">
                <div className="font-medium mb-1">Cannot Delete Plan</div>
                <div className="text-sm">{validation.message}</div>
                {validation.activeCount > 0 && (
                  <div className="text-xs mt-2 text-red-600">
                    Please wait for all active subscriptions to expire before deleting this plan.
                  </div>
                )}
                {validation.pendingCount > 0 && (
                  <div className="text-xs mt-1 text-red-600">
                    Please cancel or approve all pending orders before deleting this plan.
                  </div>
                )}
              </div>
            )}
            
            {validation.canDelete && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-yellow-800">
                <div className="font-medium mb-1">⚠️ Data Deletion Warning</div>
                <div className="text-sm">
                  Deleting this plan will permanently remove all associated data including:
                  <ul className="list-disc list-inside mt-1 ml-2">
                    <li>Customer dashboard data</li>
                    <li>Admin dashboard records</li>
                    <li>Historical order information</li>
                  </ul>
                  Deleted data will be available in the "Deleted Plans Archive" section.
                </div>
                <div className="text-red-600 font-medium mt-2">
                  This action cannot be undone.
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={!validation.canDelete}
            className={`${
              validation.canDelete 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {validation.canDelete ? "Delete Plan" : "Cannot Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlanDialog;
