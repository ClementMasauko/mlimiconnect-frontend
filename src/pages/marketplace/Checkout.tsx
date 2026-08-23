import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CreditCard, Phone, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../lib/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { calculateOrderPricing } from "../../lib/pricing";

type PaymentMethod = "airtel_money" | "tnm_mpamba" | "bank_transfer";
const paymentLabels: Record<PaymentMethod, string> = { airtel_money: "Airtel Money", tnm_mpamba: "TNM Mpamba", bank_transfer: "Bank transfer" };

export default function Checkout() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { items } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("airtel_money");
  const [referralCode, setReferralCode] = useState("");
  const [referralEligible, setReferralEligible] = useState(false);
  const [checkingReferral, setCheckingReferral] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentsEnabled = import.meta.env.VITE_PAYMENTS_ENABLED === "true";
  const pricing = useMemo(() => calculateOrderPricing(items, user?.can_sell === true || user?.user_type === "farmer", referralEligible), [items, user?.can_sell, user?.user_type, referralEligible]);

  const validateReferral = async () => {
    if (!referralCode.trim()) return;
    setCheckingReferral(true); setError(null);
    try {
      const { data } = await api.post("/api/referrals/validate/", { code: referralCode.trim() });
      setReferralEligible(data.eligible === true);
      if (!data.eligible) setError(t("referralIneligible"));
    } catch (requestError: any) {
      setReferralEligible(false);
      setError(requestError.response?.data?.detail || t("referralValidationFailed"));
    } finally { setCheckingReferral(false); }
  };

  const startPayment = async () => {
    if (!paymentsEnabled) { setError(t("paymentsUnavailable")); return; }
    if (!items.length) return;
    setPaying(true); setError(null);
    try {
      const { data } = await api.post("/api/payments/checkout-sessions/", { payment_method: paymentMethod, referral_code: referralEligible ? referralCode.trim() : undefined, items: items.map(item => ({ product_id: item.product.id, quantity: item.quantity })) });
      if (!data.checkout_url || typeof data.checkout_url !== "string") throw new Error(t("checkoutUrlMissing"));
      window.location.assign(data.checkout_url);
    } catch (requestError: any) {
      setError(requestError.response?.data?.detail || requestError.message || t("paymentStartFailed"));
      setPaying(false);
    }
  };

  if (!items.length) return <div className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950"><div className="mx-auto max-w-3xl px-4 text-center"><Card className="p-12"><h1 className="text-2xl font-bold">{t("cartEmpty")}</h1><Link to="/app/marketplace"><Button className="mt-6">{t("browseMarketplace")}</Button></Link></Card></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">{t("secureCheckout")}</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6"><h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><CreditCard className="text-green-700" /> {t("paymentMethod")}</h2><div className="space-y-3">{(["airtel_money", "tnm_mpamba", "bank_transfer"] as PaymentMethod[]).map(method => <label key={method} className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:border-green-600"><input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} /><span className="text-green-700">{method === "bank_transfer" ? <Building2 /> : <Phone />}</span><span><strong>{method === "bank_transfer" ? t("bankTransfer") : paymentLabels[method]}</strong><small className="mt-1 block text-gray-500">{method === "bank_transfer" ? t("bankInstructions") : t("mobileMoneyInstructions")}</small></span></label>)}</div></Card>
          <Card className="p-6"><label className="mb-2 flex items-center gap-2 font-medium"><Tag size={18} /> {t("referralCode")}</label><div className="flex gap-2"><input value={referralCode} onChange={event => { setReferralCode(event.target.value.toUpperCase()); setReferralEligible(false); }} placeholder={t("enterReferralCode")} className="min-w-0 flex-1 rounded-lg border px-3 py-2 dark:bg-gray-800" /><Button type="button" variant="outline" onClick={validateReferral} disabled={!referralCode.trim() || checkingReferral}>{checkingReferral ? t("checking") : t("apply")}</Button></div>{referralEligible && <p className="mt-3 text-sm text-green-700">{t("referralApplied")}</p>}</Card>
        </div>
        <Card className="h-fit p-6"><h2 className="text-xl font-semibold">{t("orderSummary")}</h2><div className="mt-5 space-y-3">{items.map(item => <div key={item.product.id} className="flex justify-between gap-3 text-sm"><span>{item.product.name} × {item.quantity}</span><span>MWK {(item.product.price * item.quantity).toLocaleString()}</span></div>)}<div className="flex justify-between border-t pt-3"><span>{t("subtotal")}</span><span>MWK {pricing.subtotal.toLocaleString()}</span></div>{pricing.farmerDiscount > 0 && <div className="flex justify-between text-green-700"><span>{t("farmerDiscount")}</span><span>-MWK {pricing.farmerDiscount.toLocaleString()}</span></div>}{pricing.referralDiscount > 0 && <div className="flex justify-between text-green-700"><span>{t("referralDiscount")}</span><span>-MWK {pricing.referralDiscount.toLocaleString()}</span></div>}<div className="flex justify-between border-t pt-3 text-xl font-bold"><span>{t("total")}</span><span>MWK {pricing.total.toLocaleString()}</span></div></div>{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}<Button className="mt-6 w-full" size="lg" disabled={paying} onClick={startPayment}>{paying ? t("openingPayment") : t("payAmount", { amount: pricing.total.toLocaleString() })}</Button><p className="mt-4 text-center text-xs text-gray-500">{t("paymentPrivacy")}</p></Card>
      </div>
    </div></div>
  );
}
