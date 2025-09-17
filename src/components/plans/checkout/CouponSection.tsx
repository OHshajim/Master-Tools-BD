
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CouponSectionProps {
  couponCode: string;
  setCouponCode: (value: string) => void;
  couponError: string | null;
  localDiscount: number;
  validateCouponCode: () => void;
}

const CouponSection = ({ 
  couponCode, 
  setCouponCode, 
  couponError, 
  localDiscount, 
  validateCouponCode 
}: CouponSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="coupon">Coupon Code *</Label>
      <div className="flex gap-2">
        <Input
          id="coupon"
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={validateCouponCode}
          disabled={!couponCode.trim()}
        >
          Apply
        </Button>
      </div>
      {couponError && (
        <p className="text-sm text-red-600">{couponError}</p>
      )}
      {localDiscount > 0 && (
        <p className="text-sm text-green-600">
          ✓ Coupon applied! {localDiscount}% discount
        </p>
      )}
    </div>
  );
};

export default CouponSection;
