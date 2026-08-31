import { useEffect, useState, type FormEvent } from "react";
import { Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function BecomeTransporter() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ vehicle_type: "", capacity_kg: "", license_reference: "" }), [status, setStatus] = useState(""), [error, setError] = useState("");
  useEffect(() => { api.get("/api/transporters/me/").then(({ data }) => { if (data) { setForm({ vehicle_type: data.vehicle_type, capacity_kg: String(data.capacity_kg), license_reference: data.license_reference }); setStatus(data.verification_status); } }).catch(() => undefined); }, []);
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); try { const { data } = await api.put("/api/transporters/me/", form); setStatus(data.verification_status); } catch (e) { setError(getApiError(e, t("transporterSaveError"))); } };
  return <div className="mx-auto max-w-3xl p-4 py-8"><h1 className="flex items-center gap-3 text-3xl font-bold"><Truck className="text-green-700" />{t("transporterApplication")}</h1><p className="mt-2 text-slate-500">{t("transporterHelp")}</p>{status && <p role="status" className="mt-4 rounded bg-amber-50 p-3 text-amber-800">{t("applicationStatus")}: <strong className="capitalize">{status}</strong></p>}{error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-700">{error}</p>}<Card className="mt-6 p-6"><form onSubmit={submit} className="space-y-5"><label className="block">{t("vehicleType")}<input required maxLength={120} value={form.vehicle_type} onChange={e => setForm({ ...form, vehicle_type: e.target.value })} className="mt-2 w-full rounded border p-3" /></label><label className="block">{t("capacityKg")}<input required min="1" type="number" value={form.capacity_kg} onChange={e => setForm({ ...form, capacity_kg: e.target.value })} className="mt-2 w-full rounded border p-3" /></label><label className="block">{t("licenceReference")}<input required maxLength={120} value={form.license_reference} onChange={e => setForm({ ...form, license_reference: e.target.value })} className="mt-2 w-full rounded border p-3" /></label><Button type="submit">{t("submitVerification")}</Button></form></Card></div>;
}
