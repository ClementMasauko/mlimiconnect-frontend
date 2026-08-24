import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { communicationsApi, formatRelativeTime, type NotificationItem } from "../../lib/communications";
import { getApiError } from "../../lib/api";

export default function NotificationsCenter() {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async (silent = false) => { if (!silent) setLoading(true); try { setItems((await communicationsApi.notifications()).results); } catch (reason) { if (!silent) setError(getApiError(reason, "Notifications are temporarily unavailable.")); } finally { if (!silent) setLoading(false); } }, []);
  useEffect(() => { void load(); const timer = window.setInterval(() => void load(true), 30000); return () => window.clearInterval(timer); }, [load]);
  const read = async (item: NotificationItem) => { if (!item.read_at) { setItems(current => current.map(value => value.id === item.id ? { ...value, read_at: new Date().toISOString() } : value)); try { await communicationsApi.markNotificationRead(item.id); } catch { void load(true); } } if (item.action_url) navigate(item.action_url); };
  const markAll = async () => { const before = items; setItems(current => current.map(item => ({ ...item, read_at: item.read_at || new Date().toISOString() }))); try { await communicationsApi.markAllNotificationsRead(); } catch (reason) { setItems(before); setError(getApiError(reason, "Could not mark notifications as read.")); } };
  const unread = items.filter(item => !item.read_at).length;

  return <div className="mx-auto max-w-5xl"><div className="mb-6 flex items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-green-700">My account</p><h1 className="text-3xl font-extrabold">Notifications</h1><p className="mt-1 text-slate-500">{unread ? `${unread} unread updates` : "You're all caught up."}</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => void markAll()} disabled={!unread}><CheckCheck size={18} /> <span className="hidden sm:inline">Mark all read</span></Button><Link to="/app/profile/notifications-management" className="grid min-h-11 min-w-11 place-items-center rounded-lg border border-slate-300" aria-label="Notification preferences"><Settings size={19} /></Link></div></div>{error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Card className="overflow-hidden p-0">{loading ? <div className="space-y-3 p-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-20 animate-pulse rounded bg-slate-100 dark:bg-gray-800" />)}</div> : items.length ? <div className="divide-y divide-slate-100 dark:divide-gray-800">{items.map(item => <button key={item.id} onClick={() => void read(item)} className={`flex min-h-20 w-full gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-gray-800 ${item.read_at ? "" : "bg-green-50/60 dark:bg-green-950/10"}`}><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-50 text-green-700 dark:bg-green-950"><Bell size={18} /></span><span className="min-w-0 flex-1"><span className="flex justify-between gap-3"><strong>{item.title}</strong><small className="shrink-0 text-slate-500">{formatRelativeTime(item.created_at)}</small></span><span className="mt-1 block text-sm text-slate-600 dark:text-gray-300">{item.message}</span><span className="mt-1 block text-xs font-bold text-green-700">{item.type}</span></span>{!item.read_at && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-700" />}</button>)}</div> : <div className="p-10 text-center"><Bell className="mx-auto text-slate-400" size={42} /><h2 className="mt-3 text-xl font-bold">No notifications</h2><p className="mt-1 text-sm text-slate-500">New order, message and advisory updates will appear here.</p></div>}</Card></div>;
}
