
// Order types - Fixed status type and added missing properties
export interface Order {
  _id?: string;
  userId: string;
  userName: string;
  planId: string;
  planName: string;
  originalPrice: number;
  finalPrice: number;
  couponCode?: string;
  couponDiscount?: number;
  lastFourDigits: string;
  paymentLastFour?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'approved' | 'rejected';
  createdAt?: string;
  date: string;
  expiresAt?: string;
  expirationDate?: string;
}
