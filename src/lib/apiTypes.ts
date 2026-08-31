export interface PaginatedResponse<T> { count: number; next: string | null; previous: string | null; results: T[] }

export interface MarketRow { category: string; average_price: number; listings: number }
export interface MarketResponse { updated_at: string; markets: MarketRow[] }
export interface RawMarketResponse {
  updated_at: string;
  markets: Array<Omit<MarketRow, "average_price" | "listings"> & { average_price: string | number; listings: string | number }>;
}

export interface OrderItem { listing_id: number; name: string; quantity: number; fulfilled_quantity: number; unit_price: string | number; seller: string }
export interface OrderStatusEvent { from_status: string; to_status: string; reason: string; created_at: string; actor_name?: string }
export interface DeliveryEvidence { id: number; evidence_type: string; reference: string; note: string; location: string; created_at: string }
export interface OrderRefund { id: number; amount: string | number; provider: string; provider_reference: string; status: string; settled_at: string | null; created_at: string }
export interface MarketplaceOrder {
  id: number; status: string; subtotal: string | number; total: string | number;
  payment_method: string; acceptance_deadline: string | null; cancellation_reason: string; created_at: string; items: OrderItem[];
  status_history: OrderStatusEvent[]; delivery_evidence: DeliveryEvidence[]; refunds: OrderRefund[];
}
