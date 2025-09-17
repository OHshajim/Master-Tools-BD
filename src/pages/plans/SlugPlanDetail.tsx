import { useParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { usePlanDetail } from '@/hooks/usePlanDetail';
import PlanDetailsSection from '@/components/plans/PlanDetailsSection';
import PlanPurchaseSidebar from '@/components/plans/PlanPurchaseSidebar';
import CheckoutDialog from '@/components/plans/CheckoutDialog';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/dataTypes';

const SlugPlanDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { orders } = useData();
  
  // Use plan detail hook with the found plan's ID
  const { isLoading, plan: planData, platformNames, isCheckoutOpen, setIsCheckoutOpen, discount, discountedPrice, formatDuration, handleBuyNow, user, validateCoupon, createOrder} 
  = usePlanDetail(slug);
  
  // Create a wrapper function to match the expected signature
const handleCreateOrder = async (
    userId: string,
    userName: string,
    planId: string,
    planName: string,
    originalPrice: number,
    lastFourDigits: string,
    couponCode?: string,
    couponDiscount?: number
): Promise<Omit<Order, "_id" | "createdAt">> => {
    const now = new Date();
    const orderData: Omit<Order, "_id" | "createdAt" | "expirationDate"> = {
        userId,
        userName,
        planId,
        planName,
        originalPrice,
        finalPrice: couponDiscount
            ? originalPrice * (1 - couponDiscount / 100)
            : originalPrice,
        couponCode:couponCode.toUpperCase(),
        couponDiscount,
        lastFourDigits,
        status: "pending",
        date: now.toISOString(),
    };
    await createOrder(orderData);
    return orderData;
};

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Loading plan details...</p>
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
        <p className="mb-4">The plan you are looking for does not exist.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Plan Details Section */}
        <PlanDetailsSection 
          plan={planData} 
          platformNames={platformNames} 
          formatDuration={formatDuration} 
        />
        
        {/* Purchase Sidebar */}
        <PlanPurchaseSidebar 
          plan={planData} 
          platformNames={platformNames} 
          formatDuration={formatDuration} 
          onBuyNow={handleBuyNow}
          user={user}
          orders={orders}
        />
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        plan={planData}
        discountedPrice={discountedPrice}
        discount={discount}
        user={user}
        orders={orders}
        validateCoupon={validateCoupon}
        createOrder={handleCreateOrder}
      />
    </div>
  );
};

export default SlugPlanDetail;
