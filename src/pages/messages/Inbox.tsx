import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, RefreshCw, User } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { communicationsApi, formatRelativeTime, type Conversation } from "../../lib/communications";
import { getApiError } from "../../lib/api";

export default function Inbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); setError("");
    try { setConversations((await communicationsApi.conversations()).results); }
    catch (reason) { if (!silent) setError(getApiError(reason, "Messages are temporarily unavailable.")); }
    finally { if (!silent) setLoading(false); }
  }, []);

  useEffect(() => { void load(); const timer = window.setInterval(() => void load(true), 15000); return () => window.clearInterval(timer); }, [load]);

  return <div className="mx-auto max-w-5xl py-4 sm:py-8"><div className="mb-6 flex items-end justify-between gap-3"><div><h1 className="text-3xl font-bold">Messages</h1><p className="mt-1 text-slate-500">Private conversations with buyers, sellers and approved partners</p></div><Button size="icon" variant="outline" onClick={() => void load()} aria-label="Refresh conversations"><RefreshCw size={18} /></Button></div>
    {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Card className="overflow-hidden p-0"><div className="border-b border-slate-200 px-4 py-3 font-bold dark:border-gray-800">Conversations</div>{loading ? <div className="space-y-3 p-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-gray-800" />)}</div> : conversations.length ? <div className="divide-y divide-slate-100 dark:divide-gray-800">{conversations.map(item => <Link key={item.id} to={`/app/messages/${item.id}`} className={`flex min-h-20 items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-gray-800 ${item.unread_count ? "bg-green-50/60 dark:bg-green-950/10" : ""}`}><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-100 dark:bg-gray-800">{item.participant.avatar ? <img src={item.participant.avatar} alt="" className="h-full w-full rounded-full object-cover" /> : <User size={20} />}</span><span className="min-w-0 flex-1"><span className="flex justify-between gap-3"><strong className="truncate">{item.participant.username}</strong><small className="shrink-0 text-slate-500">{formatRelativeTime(item.last_message?.created_at)}</small></span><span className="mt-1 block truncate text-sm text-slate-500">{item.last_message?.text || "Start the conversation"}</span></span>{item.unread_count > 0 && <span className="grid h-6 min-w-6 place-items-center rounded-full bg-green-700 px-1 text-xs font-bold text-white">{item.unread_count}</span>}</Link>)}</div> : <div className="p-10 text-center"><MessageCircle className="mx-auto text-slate-400" size={42} /><h2 className="mt-3 text-xl font-bold">No conversations yet</h2><p className="mt-1 text-sm text-slate-500">Use a seller’s marketplace page to ask about a listing.</p><Link to="/app/marketplace"><Button className="mt-4">Browse marketplace</Button></Link></div>}</Card>
  </div>;
}
