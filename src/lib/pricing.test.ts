import { describe, expect, it } from "vitest";
import { calculateOrderPricing } from "./pricing";

const items = [
  { product: { id: 1, name: "Maize", price: 10_000, category: "produce" as const }, quantity: 3 },
  { product: { id: 2, name: "Seed", price: 5_000, category: "seed" as const }, quantity: 2 },
];

describe("calculateOrderPricing", () => {
  it("calculates a server-display subtotal from quantities", () => {
    expect(calculateOrderPricing(items, false, false)).toEqual({ subtotal: 40_000, farmerDiscount: 0, referralDiscount: 0, total: 40_000 });
  });

  it("applies and rounds eligible discounts", () => {
    expect(calculateOrderPricing(items, true, true)).toEqual({ subtotal: 40_000, farmerDiscount: 2_000, referralDiscount: 800, total: 37_200 });
  });

  it("never returns a negative total", () => {
    expect(calculateOrderPricing([], true, true).total).toBe(0);
  });
});
