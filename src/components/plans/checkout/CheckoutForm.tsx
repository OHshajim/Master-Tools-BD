
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import PaymentDetailsSection from './PaymentDetailsSection';
import CouponSection from './CouponSection';
import OrderSummary from './OrderSummary';
import { Plan } from '@/types';

interface CheckoutFormProps {
  plan: Plan;
  user: any;
  onClose: () => void;
  onSubmit: (lastFourDigits: string, couponCode: string, validCoupon: {coupon}) => void;
  validateCoupon: (code: string, planId: string) => any;
  isProcessing: boolean;
}

const CheckoutForm = ({ 
  plan, 
  user, 
  onClose, 
  onSubmit, 
  validateCoupon, 
  isProcessing 
}: CheckoutFormProps) => {
  const [lastFourDigits, setLastFourDigits] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [localDiscount, setLocalDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  const validateCouponCode = async() => {
    setCouponError(null);
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    const { coupon } = await validateCoupon(couponCode.trim(), plan?._id || '');

    if (coupon) {
      setLocalDiscount(coupon.discount);
      toast.success(`Coupon applied! ${coupon.discount}% discount`);
    } else {
      setLocalDiscount(0);
      setCouponError("Invalid or expired coupon code");
      toast.error("Invalid or expired coupon code");
    }
  };

  const handleCouponChange = (value: string) => {
    setCouponCode(value);
    if (localDiscount > 0) {
      // Reset discount if user changes coupon after validation
      setLocalDiscount(0);
      setCouponError(null);
    }
  };

  const handleSubmit = async() => {
    if (!user || !plan) return;
    
    // Check if plan is drafted before processing
    if (plan.isDraft) {
      toast.error("This plan is not available for purchase", {
        description: "The plan you're trying to purchase is currently not available.",
        duration: 5000
      });
      onClose();
      return;
    }
    
    if (lastFourDigits.length !== 4 || !/^\d+$/.test(lastFourDigits)) {
      toast.error("Please enter the last 4 digits of your payment number");
      return;
    }

    // Verify coupon code is required
    if (!couponCode.trim()) {
      setCouponError("Coupon code is required to complete purchase");
      toast.error("Coupon code is required to complete purchase");
      return;
    }
    
    // Verify coupon code is valid
    const  { coupon }  = await validateCoupon(couponCode.trim(), plan._id || '');
    
    if (!coupon) {
        setCouponError("Invalid or expired coupon code");
        toast.error("Invalid or expired coupon code");
        return;
    }

    onSubmit(lastFourDigits, couponCode.trim(), coupon);
  };

  // Calculate the discounted price locally
  const calculatedPrice = localDiscount > 0
    ? plan?.price * (1 - localDiscount / 100)
    : plan?.price;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Complete Your Purchase</DialogTitle>
        <DialogDescription>
          Fill in the required information to complete your purchase.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-4">
        <PaymentDetailsSection 
          lastFourDigits={lastFourDigits}
          setLastFourDigits={setLastFourDigits}
        />
        
        <CouponSection 
          couponCode={couponCode}
          setCouponCode={handleCouponChange}
          couponError={couponError}
          localDiscount={localDiscount}
          validateCouponCode={validateCouponCode}
        />
        
        <OrderSummary 
          planPrice={plan?.price}
          localDiscount={localDiscount}
          calculatedPrice={calculatedPrice}
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isProcessing || lastFourDigits.length !== 4 || !couponCode.trim() || !localDiscount}
        >
          {isProcessing ? "Processing..." : "Complete Purchase"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CheckoutForm;
