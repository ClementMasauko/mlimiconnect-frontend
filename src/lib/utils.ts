// src/lib/utils.ts  (extended version example)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Optional: format numbers with Malawi Kwacha (MWK)
export function formatMWK(amount: number | string | null): string {
  if (amount == null) return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return `MWK ${num.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

// Optional: format date
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}