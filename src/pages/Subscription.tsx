import { useMemo, useState } from "react";
import { CheckCircle2, Crown, Info, Megaphone, Smartphone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

type Plan = { id: string; name: string; price: number; role: "farmer" | "buyer"; features: string[] };
const plans: Plan[] = [
  { id: "farmer-plus", name: "Farmer Plus", price: 3500, role: "farmer", features: ["Priority listing placement", "Advanced farm analytics", "Crop-planning and expert support"] },
  { id: "buyer-pro", name: "Buyer Pro", price: 7500, role: "buyer", features: ["Verified supplier insights", "Bulk-order tools", "Priority support and reports"] },
];
const format = (value: number) => `MWK ${value.toLocaleString()}`;

export default function Subscription() {
  const { user } = useAuth();
  const role = user?.user_type === "farmer" ? "farmer" : "buyer";
  const available = useMemo(() => plans.filter((plan) => plan.role === role), [role]);
  const [selected, setSelected] = useState(available[0]?.id ?? "farmer-plus");
  const [notice, setNotice] = useState("");
  const [promotionRequested, setPromotionRequested] = useState(false);
  const plan = available.find((item) => item.id === selected) ?? available[0];

  function requestActivation() {
    if (!plan) return;
    // The API must create the subscription and verify mobile-money payment server-side.
    // This local pending state lets the demo communicate the complete price before charging.
    localStorage.setItem("mc_subscription_request", JSON.stringify({ planId: plan.id, status: "pending_payment", requestedAt: new Date().toISOString() }));
    setNotice(`Your ${plan.name} request is ready. Complete payment by Airtel Money or TNM Mpamba when the secure payment service is connected.`);
  }

  return <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6"><div className="mb-8"><p className="font-semibold text-green-700 dark:text-green-400">Your MlimiConnect plan</p><h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">Optional tools for {role === "farmer" ? "your farm" : "your buying business"}</h1><p className="mt-2 text-gray-600 dark:text-gray-300">You remain on the free plan unless you confirm a subscription payment.</p></div><div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">{available.map((item) => <button key={item.id} type="button" onClick={() => setSelected(item.id)} className={`text-left rounded-xl border-2 p-6 transition ${selected === item.id ? "border-green-600 bg-green-50 dark:bg-green-950/30" : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"}`}><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xl font-bold"><Crown className="text-amber-500" /> {item.name}</h2><span className="font-bold text-green-700 dark:text-green-400">{format(item.price)}/mo</span></div><ul className="mt-5 space-y-3 text-sm">{item.features.map((feature) => <li key={feature} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />{feature}</li>)}</ul></button>)}<Card className="p-6"><h2 className="text-xl font-semibold">Confirm subscription</h2>{plan && <><div className="mt-5 rounded-lg bg-gray-50 p-4 dark:bg-gray-800"><p className="font-medium">{plan.name}</p><p className="mt-1 text-2xl font-bold">{format(plan.price)} <span className="text-sm font-normal text-gray-500">per month</span></p><p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Renewal is monthly. You can cancel before the next renewal.</p></div><div className="mt-5 flex gap-3 text-sm text-gray-600 dark:text-gray-300"><Smartphone className="shrink-0 text-green-700" size={20} /><p>Payment will be requested through Airtel Money or TNM Mpamba. MlimiConnect never asks for your mobile-money PIN.</p></div><Button className="mt-6 w-full" onClick={requestActivation}>Request {plan.name}</Button></>}{notice && <p role="status" className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-200">{notice}</p>}<p className="mt-4 flex gap-2 text-xs text-gray-500"><Info size={15} className="shrink-0" /> Payment confirmation and feature activation must be verified by the server before access is granted.</p></Card></div>{role === "farmer" && <Card className="mt-6 border-amber-200 p-6 dark:border-amber-900/50"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-xl font-extrabold"><Megaphone className="text-amber-500" /> Promote a listing</h2><p className="mt-2 max-w-xl text-sm text-gray-600 dark:text-gray-300">Optional featured placement starts from MWK 1,500. Full price and campaign duration are shown before any payment request.</p></div><Button variant="outline" onClick={() => { localStorage.setItem("mc_promotion_request", JSON.stringify({ status: "draft", requestedAt: new Date().toISOString() })); setPromotionRequested(true); }}>Request promotion</Button></div>{promotionRequested && <p role="status" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">Promotion request saved. Choose a listing and confirm payment when campaign billing is connected.</p>}</Card>}</main>;
}
