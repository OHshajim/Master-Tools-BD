
// Coupon types
export interface Coupon {
  _id: string;
  planId: string;
  code: string;
  discount: number;
  active: boolean;
}
