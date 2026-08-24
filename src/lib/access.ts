import type { User } from "../context/AuthContext";

export type AccountType = "individual" | "cooperative" | "company" | "ngo" | "government" | "institution";
export type PlanId = "free" | "farmer-plus" | "buyer-pro" | "cooperative" | "organization" | "enterprise";

export type AdvisoryAccess = {
  aiAdvisory: boolean;
  aiMonthlyLimit: number | null;
  expertConsultations: boolean;
  expertMonthlyCredits: number;
  institutionalReports: boolean;
  reason?: string;
};

export function getAdvisoryAccess(user: User | null): AdvisoryAccess {
  if (!user) return { aiAdvisory: false, aiMonthlyLimit: 0, expertConsultations: false, expertMonthlyCredits: 0, institutionalReports: false };
  if (user.user_type === "admin") return { aiAdvisory: true, aiMonthlyLimit: null, expertConsultations: true, expertMonthlyCredits: 0, institutionalReports: true };

  const plan = user.subscription?.status === "active" ? user.subscription.plan_id : "free";
  const institutional = ["ngo", "government", "institution"].includes(user.account_type || "");
  const expertPlans: PlanId[] = ["farmer-plus", "cooperative", "organization", "enterprise"];
  const credits: Partial<Record<PlanId, number>> = { "farmer-plus": 1, cooperative: 3, organization: 5, enterprise: 10 };

  return {
    aiAdvisory: true,
    aiMonthlyLimit: plan === "free" ? 5 : null,
    expertConsultations: expertPlans.includes(plan as PlanId),
    expertMonthlyCredits: credits[plan as PlanId] || 0,
    institutionalReports: institutional && ["organization", "enterprise"].includes(plan),
    reason: plan === "free" ? "Expert consultations are included with Farmer Plus and organization plans." : undefined,
  };
}
