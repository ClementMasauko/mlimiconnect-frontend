import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface CreatedBatch { id: number; batch_code: string }

export default function BatchCreation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ batchCode: "", product: "", quantity: "", unit: "kg", origin: "", producer: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true); setError("");
    try {
      const { data } = await api.post<CreatedBatch>("/api/traceability/batches/", {
        batch_code: form.batchCode.trim().toUpperCase(), product: form.product.trim(), quantity: `${form.quantity} ${form.unit}`, status: "created",
        public_data: { origin: form.origin.trim(), producer: form.producer.trim() },
      });
      if (form.notes.trim()) await api.post(`/api/traceability/batches/${data.id}/events/`, { event_type: "created", stage: "created", description: form.notes.trim(), location: form.origin.trim(), quantity: form.quantity, unit: form.unit });
      navigate(`/app/traceability/batch/${data.id}`, { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "The traceability batch could not be registered."));
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-lg border p-3 dark:border-slate-700 dark:bg-slate-900";
  return <div className="mx-auto max-w-3xl px-4 py-8"><h1 className="text-3xl font-black">Register a traceability batch</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Use a unique public code that can be printed on packaging or encoded in a QR label.</p><Card className="mt-7 p-6"><form className="space-y-5" onSubmit={submit}>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}<Field label="Public batch code"><input required maxLength={80} value={form.batchCode} onChange={e => setForm({ ...form, batchCode: e.target.value })} placeholder="BATCH-MZ-2026-001" className={inputClass} /></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Product"><input required maxLength={180} value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} placeholder="Maize" className={inputClass} /></Field><div className="grid grid-cols-2 gap-2"><Field label="Quantity"><input required min="0.001" step="0.001" type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} className={inputClass} /></Field><Field label="Unit"><select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} className={inputClass}><option value="kg">kg</option><option value="tonnes">tonnes</option><option value="bags">bags</option><option value="crates">crates</option><option value="litres">litres</option><option value="items">items</option></select></Field></div><Field label="Public origin"><input maxLength={140} value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} placeholder="Lilongwe" className={inputClass} /></Field><Field label="Public producer name"><input maxLength={180} value={form.producer} onChange={e => setForm({ ...form, producer: e.target.value })} className={inputClass} /></Field></div><Field label="Initial notes (kept in the event history)"><textarea maxLength={1000} rows={4} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className={inputClass} /></Field><Button type="submit" className="w-full" disabled={submitting || !form.batchCode.trim() || !form.product.trim() || !form.quantity.trim()}><Save className="mr-2" />{submitting ? "Registering..." : "Register batch"}</Button></form></Card></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}</label>;
}
