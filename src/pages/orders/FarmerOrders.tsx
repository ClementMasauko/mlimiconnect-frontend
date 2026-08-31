import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getApiError } from "../../lib/api";
import type { MarketplaceOrder } from "../../lib/apiTypes";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const nextAction: Record<string, { status: string; label: string }> = {
  paid: { status: "accepted", label: "Accept order" },
  accepted: { status: "packed", label: "Mark packed" },
  packed: { status: "dispatched", label: "Mark dispatched" },
};

export default function FarmerOrders() {
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]), [error, setError] = useState(""), [busy, setBusy] = useState<number | null>(null);
  const load = () => api.get("/api/marketplace/seller-orders/").then(({ data }) => setOrders(Array.isArray(data) ? data : data.results ?? [])).catch(e => setError(getApiError(e, "Incoming orders could not be loaded.")));
  useEffect(() => { void load(); }, []);
  const transition = async (order: MarketplaceOrder, status: string) => {
    const reason = status === "cancelled" ? window.prompt("Enter the cancellation reason:") : "";
    if (status === "cancelled" && !reason) return;
    setBusy(order.id); setError("");
    try { const { data } = await api.patch(`/api/marketplace/orders/${order.id}/status/`, { status, reason }); setOrders(rows => rows.map(row => row.id === order.id ? data : row)); }
    catch (e) { setError(getApiError(e, "The order status could not be updated.")); }
    finally { setBusy(null); }
  };
  return <div className="mx-auto max-w-5xl p-4 py-8"><h1 className="text-3xl font-bold">Incoming orders</h1>{error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}<div className="mt-7 space-y-4">{!orders.length && <Card className="p-10 text-center text-slate-500">No incoming orders.</Card>}{orders.map(order => { const action = nextAction[order.status]; return <Card key={order.id} className="p-6"><div className="flex flex-wrap justify-between gap-4"><div><h2 className="font-bold">Order #{order.id}</h2><p className="mt-1 text-sm capitalize text-slate-500">{order.status.replaceAll("_", " ")} · MWK {Number(order.total).toLocaleString()}</p>{order.acceptance_deadline && order.status === "paid" && <p className="mt-2 text-sm text-amber-700">Accept by {new Date(order.acceptance_deadline).toLocaleString()}</p>}</div><div className="flex flex-wrap gap-2">{action && <Button disabled={busy === order.id} onClick={() => void transition(order, action.status)}>{action.label}</Button>}{["paid", "accepted"].includes(order.status) && <Button variant="outline" disabled={busy === order.id} onClick={() => void transition(order, "cancelled")}>Cancel with reason</Button>}<Link className="rounded border px-4 py-2 font-semibold" to={`/app/orders/${order.id}`}>Details</Link></div></div></Card>; })}</div></div>;
}
