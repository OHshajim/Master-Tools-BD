
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PaymentDetailsSectionProps {
  lastFourDigits: string;
  setLastFourDigits: (value: string) => void;
}

const PaymentDetailsSection = ({ lastFourDigits, setLastFourDigits }: PaymentDetailsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="lastFour">Last 4 digits of payment number *</Label>
      <Input
        id="lastFour"
        type="text"
        placeholder="1234"
        value={lastFourDigits}
        onChange={(e) => setLastFourDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
        maxLength={4}
        className="w-full"
      />
    </div>
  );
};

export default PaymentDetailsSection;
