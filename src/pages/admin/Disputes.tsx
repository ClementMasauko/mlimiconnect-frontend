import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

type Dispute = { id: number; order_id: number; buyer: string; reason: string; status: string; total: string | number; created_at: string };
export default function Disputes() {
  const [items, setItems] = useState<Dispute[]>([]), [error, setError] = useState("");
  useEffect(() => { api.get<Dispute[]>("/api/admin/disputes/").then(r => setItems(r.data)).catch(e => setError(getApiError(e, "Disputes could not be loaded."))); }, []);
  const decide = async (item: Dispute, decision: "refund" | "reject") => { const note = window.prompt("Enter an audit note (at least 10 characters):"); if (!note) return; try { await api.post(`/api/admin/disputes/${item.id}/decision/`, { decision, note }); setItems(rows => rows.map(row => row.id === item.id ? { ...row, status: "resolved" } : row)); } catch (e) { setError(getApiError(e, "The dispute decision could not be saved.")); } };
  return <div className="mx-auto max-w-5xl p-4 py-8"><h1 className="flex items-center gap-3 text-3xl font-bold"><AlertTriangle className="text-amber-600" />Dispute resolution</h1>{error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}<div className="mt-7 space-y-4">{!items.length && <Card className="p-10 text-center text-slate-500">No disputes found.</Card>}{items.map(item => <Card key={item.id} className="p-6"><h2 className="font-bold">Dispute #{item.id} · Order #{item.order_id}</h2><p className="mt-1 text-sm text-slate-500">Buyer: {item.buyer} · MWK {Number(item.total).toLocaleString()}</p><p className="mt-4">{item.reason}</p><p className="mt-3 text-sm font-semibold capitalize">{item.status}</p>{item.status === "open" && <div className="mt-5 flex gap-3"><Button onClick={() => void decide(item, "refund")}>Approve refund</Button><Button variant="outline" onClick={() => void decide(item, "reject")}>Reject claim</Button></div>}</Card>)}</div></div>;
}
