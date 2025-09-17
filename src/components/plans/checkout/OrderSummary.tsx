
interface OrderSummaryProps {
  planPrice: number;
  localDiscount: number;
  calculatedPrice: number;
}

const OrderSummary = ({ planPrice, localDiscount, calculatedPrice }: OrderSummaryProps) => {
  return (
    <div className="border-t pt-4 space-y-2">
      <div className="flex justify-between text-sm">
        <span>Original Price:</span>
        <span>${planPrice?.toFixed(2)}</span>
      </div>
      {localDiscount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>Discount ({localDiscount}%):</span>
          <span>-${((planPrice * localDiscount) / 100).toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between font-semibold text-lg border-t pt-2">
        <span>Total:</span>
        <span>${calculatedPrice?.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
