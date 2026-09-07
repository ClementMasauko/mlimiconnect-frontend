const enabled = (value: unknown) => value === "true";

export const features = Object.freeze({
  analytics: enabled(import.meta.env.VITE_ANALYTICS_ENABLED),
  wallet: enabled(import.meta.env.VITE_WALLET_ENABLED),
  adminRevenue: enabled(import.meta.env.VITE_ADMIN_REVENUE_ENABLED),
  buyerVerificationReview: enabled(import.meta.env.VITE_BUYER_VERIFICATION_REVIEW_ENABLED),
  auctions: enabled(import.meta.env.VITE_AUCTIONS_ENABLED),
  subscriptions: enabled(import.meta.env.VITE_SUBSCRIPTIONS_ENABLED),
  expertRequests: enabled(import.meta.env.VITE_EXPERT_REQUESTS_ENABLED),
  promotions: enabled(import.meta.env.VITE_PROMOTIONS_ENABLED),
});

export type FeatureName = keyof typeof features;
