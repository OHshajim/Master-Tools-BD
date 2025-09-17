
import { useDataContext } from './useDataContext';

export const useCoupons = () => {
  const {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponsForPlan,
    validateCoupon
  } = useDataContext();
  
  return {
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    getCouponsForPlan,
    validateCoupon
  };
};
