import type { CartItem } from "../context/CartContext";

export const FARMER_DISCOUNT_RATE = 0.05;
export const REFERRAL_DISCOUNT_RATE = 0.02;

export function calculateOrderPricing(items: CartItem[], isFarmer: boolean, referralEligible: boolean) {
  const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const farmerDiscount = isFarmer ? Math.round(subtotal * FARMER_DISCOUNT_RATE) : 0;
  const referralDiscount = referralEligible ? Math.round(subtotal * REFERRAL_DISCOUNT_RATE) : 0;
  return {
    subtotal,
    farmerDiscount,
    referralDiscount,
    total: Math.max(0, subtotal - farmerDiscount - referralDiscount),
  };
}
