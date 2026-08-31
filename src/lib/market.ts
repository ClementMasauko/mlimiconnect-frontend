import type { MarketResponse, RawMarketResponse } from "./apiTypes";

export function normalizeMarketResponse(response: RawMarketResponse): MarketResponse {
  return {
    updated_at: response.updated_at,
    markets: response.markets.map((row) => ({ ...row, average_price: Number(row.average_price), listings: Number(row.listings) })),
  };
}
