
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Dialog } from '@/components/ui/dialog';
import { orderValidationService } from '@/services/orderValidationService';
import CheckoutForm from './checkout/CheckoutForm';
import { navigateToSection } from './checkout/navigationUtils';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Order, Plan, User } from '@/types';

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan;
  discountedPrice: number;
  discount: number;
  user: User;
  orders: Order[];
  validateCoupon: (code: string, planId: string) => void;
  createOrder
}

const CheckoutDialog = ({
  isOpen,
  onOpenChange,
  plan,
  user,
  orders,
  validateCoupon,
  createOrder
}: CheckoutDialogProps) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if plan is drafted
  if (plan?.isDraft && isOpen) {
    // Close the dialog first
    onOpenChange(false);
    
    // Show toast notification for drafted plan
    toast.error("Plan Not Available", {
      description: "This plan is currently not available for purchase.",
      icon: <AlertCircle className="h-4 w-4 text-red-600" />,
      duration: 5000,
      dismissible: true,
      closeButton: true,
      style: {
        maxWidth: '420px',
        padding: '16px'
      }
    });
    
    return null;
  }

  // Check if user can order this plan
  const validationResult = user && plan ? 
    orderValidationService.canUserOrderPlan(orders, user._id, plan._id) : 
    { canOrder: true };

  const handleSeeYourOrder = () => {
    // First dismiss all toasts
    const toastElements = document.querySelectorAll('[data-sonner-toast]');
    toastElements.forEach(element => {
      const closeButton = element.querySelector('[data-close-button]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    });
    
    // Small delay to ensure toast is dismissed before navigation
    setTimeout(() => {
      navigate('/dashboard');
      navigateToSection('[data-testid="pending-orders"]', true, validationResult.existingOrder?._id);
    }, 200);
  };

  const handleSeeYourSubscription = () => {
    // First dismiss all toasts
    const toastElements = document.querySelectorAll('[data-sonner-toast]');
    toastElements.forEach(element => {
      const closeButton = element.querySelector('[data-close-button]');
      if (closeButton) {
        (closeButton as HTMLElement).click();
      }
    });
    
    // Small delay to ensure toast is dismissed before navigation
    setTimeout(() => {
      navigate('/dashboard');
      navigateToSection('[data-testid="subscriptions"]', false, validationResult.existingOrder?._id);
    }, 200);
  };

  // If user cannot order, show toast notification instead of dialog
  if (!validationResult.canOrder && isOpen) {
    const isPending = validationResult.existingOrder?.status === 'pending';
    
    // Close the dialog first
    onOpenChange(false);
    
    // Show improved toast notification with proper positioning and dismiss functionality
    const toastId = toast(isPending ? "Order Already Pending" : "Already Subscribed", {
      description: isPending 
        ? "You've already requested this plan. It's currently pending."
        : "You've already subscribed to this plan.",
      icon: isPending ? <Clock className="h-4 w-4 text-yellow-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />,
      action: (
        <div className="flex items-center justify-end ml-auto">
          <Button 
            size="sm" 
            onClick={isPending ? handleSeeYourOrder : handleSeeYourSubscription}
            className={`text-xs px-3 py-1 h-8 whitespace-nowrap ml-2 ${
              isPending ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isPending ? "See Order" : "View Plan"}
          </Button>
        </div>
      ),
      duration: 10000, // Show for 10 seconds
      dismissible: true, // Allow dismissing by clicking outside
      closeButton: true, // Show close button
      onDismiss: () => {
        console.log('Toast dismissed');
      },
      style: {
        maxWidth: '420px',
        padding: '16px'
      },
      className: "toast-custom",
      // Make toast dismissible on outside click
      onAutoClose: () => {
        console.log('Toast auto closed');
      }
    });
    
    // Add click outside listener for additional dismiss functionality
    setTimeout(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const toastElement = document.querySelector(`[data-sonner-toast="${toastId}"]`);
        if (toastElement && !toastElement.contains(event.target as Node)) {
          toast.dismiss(toastId);
          document.removeEventListener('click', handleClickOutside);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      
      // Cleanup after toast duration
      setTimeout(() => {
        document.removeEventListener('click', handleClickOutside);
      }, 10000);
    }, 100);
    
    return null;
  }

  const handleFormSubmit = async(lastFourDigits: string, couponCode: string, coupon) => {
    setIsProcessing(true);
    
    try {
      // Final check for drafted plan before processing order
      if (plan?.isDraft) {
        toast.error("This plan is not available for purchase", {
          description: "The plan you're trying to purchase is currently not available.",
          duration: 5000
        });
        setIsProcessing(false);
        onOpenChange(false);
        return;
      }
      
      // Create order and get the new order ID
      const newOrderId = await createOrder(
          user._id,
          user.name,
          plan._id,
          plan.name,
          plan.price,
          lastFourDigits,
          couponCode,
          coupon.discount
      );
      if(!newOrderId) return toast.success("Try Again !!!");
      
      onOpenChange(false);
      toast.success("Order submitted successfully!");
      
      // Navigate to dashboard and scroll to pending orders with the new order ID
      navigate('/dashboard');
      navigateToSection('[data-testid="pending-orders"]', true, newOrderId);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Only show dialog if user can order and plan is not drafted
  if (!validationResult.canOrder || plan?.isDraft) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <CheckoutForm
        plan={plan}
        user={user}
        onClose={() => onOpenChange(false)}
        onSubmit={handleFormSubmit}
        validateCoupon={validateCoupon}
        isProcessing={isProcessing}
      />
    </Dialog>
  );
};

export default CheckoutDialog;
