import { useCallback, useEffect, useState } from "react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";

type Row = { id: number; order_id: number; provider: string; provider_reference: string; expected_amount: string; settled_amount: string | null; status: string; created_at: string };
type PendingPayout = { id: number; seller__username: string; amount: string; provider: string; provider_reference: string; destination_hint: string; requested_by__username: string; created_at: string };
type FinanceOverview = { pending_payout_approvals: PendingPayout[]; payout_controls: { dual_approval_threshold_mwk: string; daily_limit_mwk: string } };

export default function Reconciliations() {
  const [rows, setRows] = useState<Row[]>([]);
  const [finance, setFinance] = useState<FinanceOverview | null>(null);
  const [error, setError] = useState("");
  const [reviewing, setReviewing] = useState<number | null>(null);
  const load = useCallback(async () => {
    try {
      const [reconciliations, overview] = await Promise.all([api.get<Row[]>("/api/admin/reconciliations/"), api.get<FinanceOverview>("/api/admin/finance/")]);
      setRows(reconciliations.data); setFinance(overview.data); setError("");
    } catch (requestError) { setError(getApiError(requestError, "Financial controls could not be loaded.")); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const review = async (payout: PendingPayout, decision: "approve" | "reject") => {
    const reason = window.prompt(`Reason for ${decision === "approve" ? "approving" : "rejecting"} payout ${payout.provider_reference} (at least 10 characters):`);
    if (!reason) return;
    setReviewing(payout.id);
    try { await api.post(`/api/admin/payouts/${payout.id}/review/`, { decision, reason }); await load(); }
    catch (requestError) { setError(getApiError(requestError, "The payout review could not be completed.")); }
    finally { setReviewing(null); }
  };
  return <div className="mx-auto max-w-6xl p-4 py-8">
    <h1 className="text-3xl font-bold">Payment reconciliation</h1>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    {finance && <p className="mt-2 text-sm text-slate-600">Dual approval from MWK {Number(finance.payout_controls.dual_approval_threshold_mwk).toLocaleString()} · Daily seller limit MWK {Number(finance.payout_controls.daily_limit_mwk).toLocaleString()}</p>}
    <section className="mt-8" aria-labelledby="payout-approvals-heading"><h2 id="payout-approvals-heading" className="text-xl font-semibold">Pending payout approvals</h2><div className="mt-4 space-y-4">
      {finance?.pending_payout_approvals.map(payout => <Card key={payout.id} className="p-5"><strong>{payout.seller__username} · MWK {Number(payout.amount).toLocaleString()}</strong><p className="text-sm text-slate-500">{payout.provider} · {payout.provider_reference} · requested by {payout.requested_by__username}</p>{payout.destination_hint && <p className="mt-1 text-sm">Destination: {payout.destination_hint}</p>}<div className="mt-4 flex gap-3"><button type="button" disabled={reviewing === payout.id} onClick={() => void review(payout, "approve")} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Approve</button><button type="button" disabled={reviewing === payout.id} onClick={() => void review(payout, "reject")} className="rounded-lg border border-red-700 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">Reject</button></div></Card>)}
      {finance && !finance.pending_payout_approvals.length && <Card className="p-6 text-center">No payouts await approval.</Card>}
    </div></section>
    <section className="mt-8" aria-labelledby="reconciliation-heading"><h2 id="reconciliation-heading" className="text-xl font-semibold">Provider reconciliation</h2><div className="mt-4 space-y-4">{rows.map(row => <Card key={row.id} className="p-5"><strong>Order #{row.order_id} · {row.provider}</strong><p className="text-sm text-slate-500">{row.provider_reference}</p><p className="mt-2">Expected MWK {Number(row.expected_amount).toLocaleString()} · Settled {row.settled_amount ? `MWK ${Number(row.settled_amount).toLocaleString()}` : "Pending"} · <span className="capitalize">{row.status}</span></p></Card>)}{!rows.length && !error && <Card className="p-10 text-center">No reconciliation records.</Card>}</div></section>
  </div>;
}
