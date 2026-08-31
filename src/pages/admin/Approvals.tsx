import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

type Approval = { id: number; legal_name: string; registration_number: string; owner: string; created_at: string };
export default function Approvals() {
  const [items, setItems] = useState<Approval[]>([]), [error, setError] = useState(""), [loading, setLoading] = useState(true);
  const load = () => api.get<Approval[]>("/api/admin/approvals/").then(r => setItems(r.data)).catch(e => setError(getApiError(e, "Approvals could not be loaded."))).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []);
  const decide = async (item: Approval, decision: "verified" | "rejected") => {
    const reason = decision === "rejected" ? window.prompt("Enter the rejection reason:") : "";
    if (decision === "rejected" && !reason) return;
    try { await api.post(`/api/admin/approvals/${item.id}/decision/`, { decision, reason }); setItems(rows => rows.filter(row => row.id !== item.id)); }
    catch (e) { setError(getApiError(e, "The decision could not be saved.")); }
  };
  return <div className="mx-auto max-w-6xl p-4 py-8"><h1 className="flex items-center gap-3 text-3xl font-bold"><Clock className="text-amber-600" />Organization approvals</h1>{error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}<div className="mt-7 space-y-4" aria-busy={loading}>{!loading && !items.length && <Card className="p-10 text-center text-slate-500">No pending organizations.</Card>}{items.map(item => <Card key={item.id} className="p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-lg font-bold">{item.legal_name}</h2><p className="text-sm text-slate-500">Registration: {item.registration_number} · Owner: {item.owner}</p></div><div className="flex gap-2"><Button onClick={() => void decide(item, "verified")}><CheckCircle size={16} className="mr-2" />Approve</Button><Button variant="outline" onClick={() => void decide(item, "rejected")}><XCircle size={16} className="mr-2" />Reject</Button></div></div></Card>)}</div></div>;
}
