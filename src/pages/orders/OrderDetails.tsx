import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import type { MarketplaceOrder } from "../../lib/apiTypes";
import Card from "../../components/ui/Card";
import LogoLoader from "../../components/LogoLoader";
import { useCart } from "../../context/CartContext";

export default function OrderDetails() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { removeItems } = useCart();
  const [order, setOrder] = useState<MarketplaceOrder | null>(null), [error, setError] = useState("");
  useEffect(() => {
    if (!id) { setError("The order ID is missing."); return; }
    let stopped = false;
    let attempts = searchParams.get("payment") === "processing" ? 10 : 1;
    const load = async () => {
      try {
        const response = await api.get<MarketplaceOrder>(`/api/marketplace/orders/${encodeURIComponent(id)}/`);
        if (stopped) return;
        setOrder(response.data);
        if (response.data.payment_transaction?.status === "matched") {
          removeItems(response.data.items.map(item => item.listing_id));
          if (searchParams.has("payment")) setSearchParams({}, { replace: true });
          return;
        }
        attempts -= 1;
        if (attempts > 0) window.setTimeout(() => { void load(); }, 3000);
      } catch (requestError) {
        if (!stopped) setError(getApiError(requestError, "The order could not be loaded."));
      }
    };
    void load();
    return () => { stopped = true; };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const updateStatus = async (status: string) => { if (!order) return; try { const response = await api.patch<MarketplaceOrder>(`/api/marketplace/orders/${order.id}/status/`, { status }); setOrder(response.data); } catch (e) { setError(getApiError(e, "The order could not be updated.")); } };
  if (!order && !error) return <LogoLoader fullScreen />;
  if (!order) return <div className="mx-auto max-w-2xl p-8"><Card className="p-8 text-center"><AlertCircle className="mx-auto text-red-600" /><h1 className="mt-4 text-xl font-bold">Order unavailable</h1><p role="alert">{error}</p></Card></div>;
  return <div className="mx-auto max-w-5xl px-4 py-8"><Link to="/app/orders" className="font-semibold text-green-700">← Back to orders</Link>{error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}{searchParams.get("payment") === "processing" && order.status === "pending" && <p role="status" className="mt-4 rounded-lg bg-amber-50 p-4 text-amber-900">Payment received by PayChangu. Waiting for secure verification…</p>}{order.status === "paid" && <p role="status" className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 font-semibold text-green-800"><CheckCircle2 /> Payment verified. Purchased items were removed from your cart.</p>}<div className="mt-3 flex flex-wrap justify-between gap-3"><div><h1 className="text-3xl font-black">Order #{order.id}</h1><p className="text-sm text-slate-500">Placed {new Date(order.created_at).toLocaleDateString()}</p></div><span className="h-fit rounded-full bg-slate-100 px-4 py-2 font-semibold capitalize">{order.status.replaceAll("_", " ")}</span></div><div className="mt-7 grid gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><Card className="p-6"><h2 className="text-xl font-bold">Items</h2>{order.items.map(item => <div key={item.listing_id} className="flex justify-between border-b py-4 last:border-0"><div><strong>{item.name}</strong><p className="text-sm text-slate-500">Seller: {item.seller} · Ordered: {item.quantity} · Fulfilled: {item.fulfilled_quantity}</p></div><strong>MWK {(Number(item.unit_price) * item.quantity).toLocaleString()}</strong></div>)}</Card><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><Clock />Status history</h2><ol className="mt-4 space-y-4">{order.status_history.map((event, index) => <li key={`${event.created_at}-${index}`} className="border-l-2 border-green-600 pl-4"><strong className="capitalize">{event.to_status.replaceAll("_", " ")}</strong><p className="text-sm text-slate-500">{new Date(event.created_at).toLocaleString()}{event.actor_name ? ` · ${event.actor_name}` : ""}</p>{event.reason && <p className="text-sm">{event.reason}</p>}</li>)}</ol></Card></div><Card className="h-fit p-6"><h2 className="text-xl font-bold">Summary</h2><dl className="mt-4 space-y-3"><div className="flex justify-between"><dt>Total</dt><dd className="font-bold text-green-700">MWK {Number(order.total).toLocaleString()}</dd></div><div className="flex justify-between"><dt>Payment</dt><dd className="capitalize">{order.payment_method.replaceAll("_", " ")}</dd></div>{order.payment_transaction && <><div><dt className="text-sm text-slate-500">MlimiConnect reference</dt><dd className="break-all font-mono text-sm">{order.payment_transaction.transaction_reference}</dd></div><div><dt className="text-sm text-slate-500">PayChangu transaction ID</dt><dd className="break-all font-mono text-sm">{order.payment_transaction.provider_transaction_id || "Pending verification"}</dd></div><div className="flex justify-between"><dt>Reconciliation</dt><dd className="font-semibold capitalize">{order.payment_transaction.status}</dd></div></>}</dl>{order.status === "delivered" && <button type="button" onClick={() => void updateStatus("completed")} className="mt-6 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white">Confirm delivery received</button>}{["completed", "fulfilled"].includes(order.status) && <Link to={`/app/orders/${order.id}/rate`} className="mt-3 block rounded-lg bg-green-700 px-4 py-3 text-center font-semibold text-white">Rate this order</Link>}{["delivered", "partially_fulfilled"].includes(order.status) && <Link to={`/app/orders/${order.id}/dispute`} className="mt-3 block text-center font-semibold text-red-700">Report a problem</Link>}{order.cancellation_reason && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">Cancellation: {order.cancellation_reason}</p>}{order.refunds.map(refund => <p key={refund.id} className="mt-4 rounded bg-slate-50 p-3 text-sm">Refund {refund.status}: MWK {Number(refund.amount).toLocaleString()} · {refund.provider_reference}</p>)}</Card></div></div>;
}
