import { useEffect, useState } from "react";
import api, { getApiError } from "../../lib/api";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

type Row = { id:number; user:string; vehicle_type:string; capacity_kg:number; license_reference:string; verification_status:string };

export default function TransporterAdmin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const load = () => api.get<Row[]>("/api/admin/transporters/").then(r => setRows(r.data)).catch(e => setError(getApiError(e, "Transporters could not be loaded.")));
  useEffect(() => { void load(); }, []);
  const decide = async (row: Row, decision: string) => {
    if (reason.trim().length < 5) { setError("Enter a reason of at least five characters."); return; }
    try { await api.post("/api/admin/transporters/", { profile_id: row.id, decision, reason }); await load(); }
    catch (e) { setError(getApiError(e, "Decision could not be saved.")); }
  };
  return <div className="mx-auto max-w-6xl p-4 py-8"><h1 className="text-3xl font-bold">Transporter administration</h1>{error && <p role="alert">{error}</p>}<label className="mt-5 block">Decision reason<input value={reason} onChange={e => setReason(e.target.value)} className="mt-1 w-full rounded border p-3" /></label><div className="mt-6 space-y-4">{rows.map(row => <Card key={row.id} className="p-5"><strong>{row.user} · {row.vehicle_type}</strong><p className="text-sm text-slate-500">{row.capacity_kg} kg · Licence {row.license_reference} · {row.verification_status}</p><div className="mt-4 flex gap-2"><Button onClick={() => void decide(row, "verified")}>Verify</Button><Button variant="outline" onClick={() => void decide(row, "rejected")}>Reject</Button><Button variant="outline" onClick={() => void decide(row, "suspended")}>Suspend</Button></div></Card>)}</div></div>;
}
