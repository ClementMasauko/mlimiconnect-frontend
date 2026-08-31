import { describe, expect, it } from "vitest";
import { normalizeMarketResponse } from "./market";

describe("normalizeMarketResponse", () => {
  it("normalizes numeric API strings for charts and counts", () => {
    expect(normalizeMarketResponse({ updated_at: "2026-08-29T10:00:00Z", markets: [{ category: "maize", average_price: "12500.50", listings: "3" }] }))
      .toEqual({ updated_at: "2026-08-29T10:00:00Z", markets: [{ category: "maize", average_price: 12500.5, listings: 3 }] });
  });

  it("preserves an empty response", () => {
    expect(normalizeMarketResponse({ updated_at: "", markets: [] }).markets).toEqual([]);
  });
});
