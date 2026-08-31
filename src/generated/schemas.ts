import { z } from "zod";

export const OrderStatusSchema = z.enum(["pending", "paid", "accepted", "packed", "dispatched", "delivered", "completed", "partially_fulfilled", "failed_delivery", "disputed", "cancelled", "refunded", "fulfilled"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export const VerificationStatusSchema = z.enum(["pending", "verified", "rejected"]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
export const ApiErrorResponseSchema = z.object({
  error: z.object({ code: z.string(), message: z.string(), fields: z.record(z.string(), z.unknown()).default({}) }).optional(),
  detail: z.string().optional(), correlation_id: z.string().nullable().optional(),
});
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
