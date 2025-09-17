
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ValidationAlertProps {
  existingOrder: any;
  onClose: () => void;
  onNavigate: () => void;
}

const ValidationAlert = ({ existingOrder, onClose, onNavigate }: ValidationAlertProps) => {
  const isPending = existingOrder?.status === 'pending';
  const isActive = existingOrder?.status === 'approved';

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {isPending ? (
            <>
              <Clock className="h-5 w-5 text-yellow-600" />
              Order Already Pending
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              Already Subscribed
            </>
          )}
        </DialogTitle>
        <DialogDescription>
          {isPending 
            ? "You've already requested this plan. It's currently pending."
            : "You've already subscribed to this plan."
          }
        </DialogDescription>
      </DialogHeader>
      
      <div className="py-4">
        <Alert className={isPending ? "border-yellow-200 bg-yellow-50" : "border-green-200 bg-green-50"}>
          <AlertCircle className={`h-4 w-4 ${isPending ? "text-yellow-600" : "text-green-600"}`} />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                {existingOrder?.planName}
              </p>
              {existingOrder?.createdAt && (
                <p className="text-sm">
                  Order Date: {new Date(existingOrder.createdAt).toLocaleDateString()}
                </p>
              )}
              {existingOrder?.expirationDate && (
                <p className="text-sm">
                  {isPending ? 'Will expire on' : 'Expires on'}: {new Date(existingOrder.expirationDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </AlertDescription>
        </Alert>
      </div>
      
      <DialogFooter className="flex gap-2">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button 
          onClick={onNavigate}
          className={isPending ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"}
        >
          {isPending ? "See Your Order" : "See Your Subscription"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ValidationAlert;
