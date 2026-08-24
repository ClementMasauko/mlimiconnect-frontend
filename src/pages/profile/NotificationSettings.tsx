import { useEffect, useState } from "react";
import { Bell, Mail, Save, ShieldAlert, Smartphone } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import AccountNav from "../../components/AccountNav";

type Preferences = Record<string, boolean>;
const defaults: Preferences = { emailOrders: true, emailPriceAlerts: true, emailMessages: true, emailAdvisory: true, smsOrders: false, smsPriceAlerts: false, smsMessages: false, smsAdvisory: true, pushOrders: true, pushPriceAlerts: true, pushMessages: true, pushAdvisory: true, pushAuctions: true };
const groups = [
  { title: "Email", description: "Updates delivered to your verified email", icon: Mail, keys: [["emailOrders", "Orders and payments"], ["emailPriceAlerts", "Saved-product price alerts"], ["emailMessages", "New messages"], ["emailAdvisory", "Weather, pest and advisory alerts"]] },
  { title: "SMS", description: "Important updates sent to your verified phone", icon: Smartphone, keys: [["smsOrders", "Orders and payments"], ["smsPriceAlerts", "Price alerts"], ["smsMessages", "New messages"], ["smsAdvisory", "Urgent weather and pest alerts"]] },
  { title: "Push notifications", description: "Device alerts when the app is installed", icon: Bell, keys: [["pushOrders", "Orders and payments"], ["pushPriceAlerts", "Price alerts"], ["pushMessages", "New messages"], ["pushAdvisory", "Weather, pest and advisory alerts"], ["pushAuctions", "Bids and auction endings"]] },
];

export default function NotificationSettings() {
  const [settings, setSettings] = useState<Preferences>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { api.get<Preferences>("/api/users/notifications").then(({ data }) => setSettings({ ...defaults, ...data })).catch(() => undefined).finally(() => setLoading(false)); }, []);
  const save = async () => { setSaving(true); setMessage(""); try { const { data } = await api.put<Preferences>("/api/users/notifications", settings); setSettings({ ...defaults, ...data }); setMessage("Notification preferences saved."); } catch (reason) { setMessage(getApiError(reason, "We could not save your preferences.")); } finally { setSaving(false); } };
  const enablePush = async () => { if (!("Notification" in window) || !("serviceWorker" in navigator)) { setMessage("Push notifications are not supported on this device."); return; } const permission = await Notification.requestPermission(); if (permission !== "granted") { setMessage("Push permission was not granted. You can change it in browser settings."); return; } setMessage("Push permission granted. Device delivery will begin after the push subscription endpoint is configured."); };

  return <div className="mx-auto max-w-6xl"><div className="mb-6"><p className="text-sm font-bold uppercase tracking-wider text-green-700">My account</p><h1 className="text-3xl font-extrabold">Notification preferences</h1><p className="mt-1 text-slate-500">Choose which optional alerts you receive and through which channel.</p></div><div className="grid gap-5 lg:grid-cols-[240px_1fr]"><Card className="h-fit p-3"><AccountNav /></Card><div className="space-y-4"><Card className="flex gap-3 border-amber-200 p-4"><ShieldAlert className="shrink-0 text-amber-600" /><p className="text-sm text-slate-600 dark:text-slate-300"><strong>Essential notices remain enabled.</strong> Security, password, payment, dispute and legally required account messages cannot be disabled here.</p></Card>{loading ? <div className="h-52 animate-pulse rounded-xl bg-slate-100 dark:bg-gray-800" /> : groups.map(group => <Card key={group.title} className="p-4 sm:p-6"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-green-50 text-green-700"><group.icon size={20} /></span><div><h2 className="font-extrabold">{group.title}</h2><p className="text-sm text-slate-500">{group.description}</p></div></div>{group.title === "Push notifications" && <Button size="sm" variant="outline" onClick={() => void enablePush()}>Enable device</Button>}</div><div className="mt-4 divide-y divide-slate-100 border-t border-slate-100 dark:divide-gray-800 dark:border-gray-800">{group.keys.map(([key, label]) => <label key={key} className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-sm font-medium"><span>{label}</span><input type="checkbox" checked={Boolean(settings[key])} onChange={() => setSettings(current => ({ ...current, [key]: !current[key] }))} className="h-5 w-5 rounded text-green-700" /></label>)}</div></Card>)}<div className="sticky bottom-16 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur lg:bottom-4 dark:border-gray-800 dark:bg-gray-900/95"><p role="status" className={`text-sm ${message.includes("could not") ? "text-red-600" : "text-green-700"}`}>{message}</p><Button onClick={save} disabled={saving || loading}><Save size={17} />{saving ? "Saving…" : "Save"}</Button></div></div></div></div>;
}
