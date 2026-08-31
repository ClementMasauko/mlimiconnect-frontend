import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Crown, FileText, Info, Smartphone, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api, { getApiError } from "../lib/api";
import type { AccountType, PlanId } from "../lib/access";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

type BillingCycle = "monthly" | "annual";
type PaymentMethod = "airtel_money" | "tnm_mpamba" | "bank_transfer" | "card" | "invoice";
type Plan = { id: PlanId; name: string; monthlyPrice: number | null; audiences: AccountType[]; icon: typeof Crown; features: string[] };

const plans: Plan[] = [
  { id: "free", name: "Free", monthlyPrice: 0, audiences: ["individual"], icon: CheckCircle2, features: ["Buy and sell in the marketplace", "Source-backed crop planning tools", "Orders, messages and basic market prices"] },
  { id: "farmer-plus", name: "Farmer Plus", monthlyPrice: 3500, audiences: ["individual"], icon: Crown, features: ["Farm planning and advisory history", "Managed expert escalation when available", "Farm analytics, traceability and promotion discounts"] },
  { id: "buyer-pro", name: "Buyer Pro", monthlyPrice: 7500, audiences: ["individual"], icon: Crown, features: ["Bulk procurement and recurring orders", "Saved suppliers, searches and reports", "Priority support"] },
  { id: "cooperative", name: "Cooperative", monthlyPrice: 15000, audiences: ["cooperative"], icon: Users, features: ["Member and combined inventory management", "Managed advisory escalation when available", "Member payout allocation and cooperative reports"] },
  { id: "organization", name: "Organization", monthlyPrice: 25000, audiences: ["company", "ngo", "institution"], icon: Building2, features: ["5 staff seats and multiple locations", "Managed advisory escalation when available", "Procurement approvals, invoices and impact reports"] },
  { id: "enterprise", name: "Government & Enterprise", monthlyPrice: null, audiences: ["company", "ngo", "government", "institution"], icon: FileText, features: ["Custom seats, branches and permissions", "Institutional dashboards and data exports", "Account management and negotiated service terms"] },
];
const format = (value: number) => `MWK ${value.toLocaleString()}`;

export default function Subscription() {
  const { user, refreshUserProfile } = useAuth();
  const accountType = (user?.account_type || "individual") as AccountType;
  const available = useMemo(() => plans.filter(plan => plan.audiences.includes(accountType) && (accountType !== "individual" || plan.id !== "buyer-pro" || user?.can_buy !== false) && (accountType !== "individual" || plan.id !== "farmer-plus" || user?.can_sell === true || user?.user_type === "farmer")), [accountType, user?.can_buy, user?.can_sell, user?.user_type]);
  const [selected, setSelected] = useState<PlanId>(available[0]?.id || "free");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [method, setMethod] = useState<PaymentMethod>("airtel_money");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const paymentsEnabled = import.meta.env.VITE_PAYMENTS_ENABLED === "true";
  const plan = available.find(item => item.id === selected) || available[0];
  const active = user?.subscription;

  useEffect(() => { if (!available.some(item => item.id === selected)) setSelected(available[0]?.id || "free"); }, [available, selected]);
  useEffect(() => { if (paymentsEnabled) void refreshUserProfile().catch(() => undefined); }, [paymentsEnabled, refreshUserProfile]);

  const price = plan?.monthlyPrice == null ? null : Math.round(plan.monthlyPrice * (cycle === "annual" ? 10 : 1));
  const allowedMethods: PaymentMethod[] = accountType === "individual" ? ["airtel_money", "tnm_mpamba", "card"] : ["airtel_money", "tnm_mpamba", "bank_transfer", "card", "invoice"];

  async function continueBilling() {
    if (!plan || plan.id === "free") { setNotice("The free plan does not require payment."); return; }
    if (plan.monthlyPrice == null) { setNotice("Your enterprise request is ready. Our team will confirm scope, pricing and authorized invoice contacts before activation."); return; }
    if (!paymentsEnabled) { setError("Secure subscription billing is not enabled yet. No payment has been requested."); return; }
    setBusy(true); setError(""); setNotice("");
    try {
      const { data } = await api.post("/api/subscriptions/checkout-sessions/", { plan_id: plan.id, billing_cycle: cycle, payment_method: method });
      if (data.checkout_url) window.location.assign(data.checkout_url);
      else setNotice(`Payment request created. Reference: ${data.payment_reference || "pending"}`);
    } catch (reason) { setError(getApiError(reason, "We could not start subscription billing. No money has been collected.")); }
    finally { setBusy(false); }
  }

  return <main className="mx-auto max-w-6xl py-4 sm:py-8"><div className="mb-6"><p className="font-semibold text-green-700">Plans and billing</p><h1 className="mt-1 text-3xl font-bold">Choose tools for your {accountType} account</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Trading capability, legal account type and subscription are managed separately. Paid access is activated only after server-confirmed payment.</p></div>
    {active && <Card className="mb-6 flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="text-xs font-bold uppercase text-slate-500">Current plan</p><p className="font-bold capitalize">{active.plan_id.replaceAll("-", " ")} · {active.status.replaceAll("_", " ")}</p></div>{active.renews_at && <p className="text-sm text-slate-500">Renews {new Date(active.renews_at).toLocaleDateString()}</p>}</Card>}
    <div className="mb-5 flex rounded-lg bg-slate-100 p-1 sm:w-fit dark:bg-gray-800"><button onClick={() => setCycle("monthly")} className={`min-h-10 flex-1 rounded-md px-4 text-sm font-bold sm:flex-none ${cycle === "monthly" ? "bg-white shadow-sm dark:bg-gray-900" : "text-slate-500"}`}>Monthly</button><button onClick={() => setCycle("annual")} className={`min-h-10 flex-1 rounded-md px-4 text-sm font-bold sm:flex-none ${cycle === "annual" ? "bg-white shadow-sm dark:bg-gray-900" : "text-slate-500"}`}>Annual · 2 months free</button></div>
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><div className="grid gap-4 sm:grid-cols-2">{available.map(item => { const Icon = item.icon; const selectedPlan = item.id === plan?.id; return <button key={item.id} onClick={() => setSelected(item.id)} className={`rounded-xl border-2 p-5 text-left ${selectedPlan ? "border-green-700 bg-green-50 dark:bg-green-950/20" : "border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-900"}`}><div className="flex items-start justify-between gap-2"><h2 className="flex items-center gap-2 text-lg font-bold"><Icon className="text-green-700" size={21} />{item.name}</h2><span className="text-right text-sm font-bold text-green-700">{item.monthlyPrice == null ? "Contact us" : item.monthlyPrice === 0 ? "Free" : `${format(cycle === "annual" ? item.monthlyPrice * 10 : item.monthlyPrice)}/${cycle === "annual" ? "yr" : "mo"}`}</span></div><ul className="mt-4 space-y-2 text-sm">{item.features.map(feature => <li key={feature} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" />{feature}</li>)}</ul></button>; })}</div>
      <Card className="h-fit p-5"><h2 className="text-xl font-bold">Billing details</h2>{plan && <><div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-gray-800"><p className="font-bold">{plan.name}</p><p className="mt-1 text-2xl font-black">{price == null ? "Custom quote" : price === 0 ? "Free" : format(price)}</p>{cycle === "annual" && price !== null && price > 0 && <p className="text-xs text-green-700">Includes two months free</p>}</div>{price !== 0 && price !== null && <div className="mt-4"><label className="text-sm font-bold">Payment method</label><select value={method} onChange={event => setMethod(event.target.value as PaymentMethod)} className="mt-2 w-full rounded-lg border p-3 dark:bg-gray-800">{allowedMethods.map(value => <option key={value} value={value}>{value.replaceAll("_", " ")}</option>)}</select></div>}<Button onClick={continueBilling} disabled={busy} className="mt-5 w-full">{busy ? "Opening secure billing…" : price == null ? "Request enterprise quote" : price === 0 ? "Continue with Free" : `Continue · ${format(price)}`}</Button></>}
        {notice && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}{error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<p className="mt-4 flex gap-2 text-xs text-slate-500"><Smartphone size={15} className="shrink-0" />Never enter a mobile-money PIN inside MlimiConnect. Provider fees, taxes and the full renewal price must be shown before approval.</p><p className="mt-3 flex gap-2 text-xs text-slate-500"><Info size={15} className="shrink-0" />Subscriptions and marketplace commissions are recorded separately.</p></Card></div>
  </main>;
}
