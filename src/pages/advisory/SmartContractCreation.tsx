import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Save } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function SmartContractCreation() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", type: "supply", product: "", quantity: "", price: "", partner: "", expiryDate: "", conditions: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setSubmitting(true); setError("");
    try {
      await api.post("/api/advisory/smart-contracts/", { name: form.name.trim(), terms: { type: form.type, product: form.product.trim(), quantity: form.quantity.trim(), price_mwk: form.price, partner: form.partner.trim(), expiry_date: form.expiryDate, conditions: form.conditions.trim() } });
      navigate("/app/advisory/smart-contracts", { replace: true });
    } catch (requestError) { setError(getApiError(requestError, "The agreement draft could not be saved.")); setSubmitting(false); }
  };
  return <div className="mx-auto max-w-3xl px-4 py-8"><Link to="/app/advisory/smart-contracts" className="font-semibold text-green-700">← Back to agreements</Link><h1 className="mt-4 flex items-center gap-3 text-3xl font-black"><FileText className="text-green-700" />Create agreement draft</h1><p className="mt-2 text-slate-600 dark:text-slate-300">This records proposed terms for review. It does not deploy code, transfer money or bind another party.</p><Card className="mt-7 p-6"><form className="space-y-5" onSubmit={submit}>{error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}<Field label="Agreement name"><Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Maize supply agreement" /></Field><div className="grid gap-5 sm:grid-cols-2"><Field label="Type"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-lg border px-4 py-3 dark:bg-slate-900"><option value="supply">Supply agreement</option><option value="price-floor">Price floor</option><option value="quality-premium">Quality premium</option><option value="insurance-request">Insurance request</option></select></Field><Field label="Product"><Input required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} /></Field><Field label="Quantity and unit"><Input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="5,000 kg" /></Field><Field label="Proposed price (MWK)"><Input type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></Field><Field label="Proposed partner"><Input value={form.partner} onChange={e => setForm({ ...form, partner: e.target.value })} /></Field><Field label="Expiry date"><Input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} /></Field></div><Field label="Conditions"><textarea rows={5} maxLength={3000} value={form.conditions} onChange={e => setForm({ ...form, conditions: e.target.value })} className="w-full rounded-lg border p-3 dark:bg-slate-900" /></Field><Button type="submit" className="w-full" disabled={submitting || !form.name.trim() || !form.product.trim()}><Save size={17} className="mr-2" />{submitting ? "Saving..." : "Save draft"}</Button></form></Card></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{children}</label>; }
