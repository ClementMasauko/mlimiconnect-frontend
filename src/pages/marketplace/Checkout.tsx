import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, CreditCard, Phone, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import api, { getApiError } from "../../lib/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useCart } from "../../context/CartContext";

type PaymentMethod = "airtel_money" | "tnm_mpamba" | "bank_transfer" | "card";
const paymentLabels: Record<PaymentMethod, string> = { airtel_money: "Airtel Money", tnm_mpamba: "TNM Mpamba", bank_transfer: "Bank transfer", card: "Debit or credit card" };

export default function Checkout() {
  const { t } = useTranslation();
  const { items } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("airtel_money");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paymentsEnabled = import.meta.env.VITE_PAYMENTS_ENABLED === "true";
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  const startPayment = async () => {
    if (!paymentsEnabled) { setError(t("paymentsUnavailable")); return; }
    if (!items.length) return;
    setPaying(true); setError(null);
    try {
      const { data } = await api.post("/api/payments/checkout-sessions/", { payment_method: paymentMethod, items: items.map(item => ({ product_id: item.product.id, quantity: item.quantity })) });
      if (!data.checkout_url || typeof data.checkout_url !== "string") throw new Error(t("checkoutUrlMissing"));
      window.location.assign(data.checkout_url);
    } catch (requestError: unknown) {
      setError(getApiError(requestError, t("paymentStartFailed")));
      setPaying(false);
    }
  };

  if (!items.length) return <div className="min-h-screen bg-gray-50 py-16 dark:bg-gray-950"><div className="mx-auto max-w-3xl px-4 text-center"><Card className="p-12"><h1 className="text-2xl font-bold">{t("cartEmpty")}</h1><Link to="/app/marketplace"><Button className="mt-6">{t("browseMarketplace")}</Button></Link></Card></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-950"><div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">{t("secureCheckout")}</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6"><h2 className="mb-2 flex items-center gap-2 text-xl font-semibold"><CreditCard className="text-green-700" /> {t("paymentMethod")}</h2><p className="mb-4 text-sm text-gray-500">You will complete payment securely on PayChangu. MlimiConnect never receives your card number or mobile-money PIN.</p><div className="space-y-3">{(["airtel_money", "tnm_mpamba", "bank_transfer", "card"] as PaymentMethod[]).map(method => <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${paymentMethod === method ? "border-green-600 bg-green-50 dark:bg-green-950/20" : "hover:border-green-600"}`}><input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} /><span className="text-green-700">{method === "bank_transfer" ? <Building2 /> : method === "card" ? <CreditCard /> : <Phone />}</span><span><strong>{paymentLabels[method]}</strong><small className="mt-1 block text-gray-500">{method === "bank_transfer" ? t("bankInstructions") : method === "card" ? "Visa or Mastercard on PayChangu's secure page" : t("mobileMoneyInstructions")}</small></span></label>)}</div><div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 dark:bg-slate-900 dark:text-slate-300"><ShieldCheck className="shrink-0 text-green-700" size={18} /><span>Payment is confirmed only after PayChangu verifies the amount, currency and transaction reference.</span></div></Card>
        </div>
        <Card className="h-fit p-6"><h2 className="text-xl font-semibold">{t("orderSummary")}</h2><div className="mt-5 space-y-3">{items.map(item => <div key={item.product.id} className="flex justify-between gap-3 text-sm"><span>{item.product.name} × {item.quantity}</span><span>MWK {(item.product.price * item.quantity).toLocaleString()}</span></div>)}<div className="flex justify-between border-t pt-3"><span>{t("subtotal")}</span><span>MWK {subtotal.toLocaleString()}</span></div><div className="flex justify-between border-t pt-3 text-xl font-bold"><span>{t("total")}</span><span>MWK {subtotal.toLocaleString()}</span></div></div><p className="mt-3 text-xs text-slate-500">The server recalculates the final amount from current listing prices before opening payment.</p>{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}<Button className="mt-6 w-full" size="lg" disabled={paying} onClick={startPayment}>{paying ? t("openingPayment") : t("payAmount", { amount: subtotal.toLocaleString() })}</Button><p className="mt-4 text-center text-xs text-gray-500">{t("paymentPrivacy")}</p></Card>
      </div>
    </div></div>
  );
}
