import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import Button from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { communicationsApi, formatRelativeTime, type ChatMessage } from "../../lib/communications";
import { getApiError } from "../../lib/api";

export default function ChatConversation() {
  const { chatId = "" } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async (silent = false) => {
    if (!chatId) return;
    if (!silent) setLoading(true);
    try { const page = await communicationsApi.messages(chatId); setMessages(page.results); await communicationsApi.markConversationRead(chatId); }
    catch (reason) { if (!silent) setError(getApiError(reason, "This conversation could not be loaded.")); }
    finally { if (!silent) setLoading(false); }
  }, [chatId]);

  useEffect(() => { void load(); const timer = window.setInterval(() => void load(true), 8000); return () => window.clearInterval(timer); }, [load]);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  const send = async () => {
    const text = input.trim(); if (!text || sending) return;
    setSending(true); setError(""); setInput("");
    const optimistic: ChatMessage = { id: `pending-${Date.now()}`, sender_id: user?.id || 0, text, created_at: new Date().toISOString(), pending: true };
    setMessages(current => [...current, optimistic]);
    try { const saved = await communicationsApi.send(chatId, text); setMessages(current => current.map(item => item.id === optimistic.id ? saved : item)); }
    catch (reason) { setMessages(current => current.filter(item => item.id !== optimistic.id)); setInput(text); setError(getApiError(reason, "Message was not sent. Please try again.")); }
    finally { setSending(false); }
  };

  return <div className="flex h-[calc(100dvh-12rem)] min-h-[32rem] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-gray-800 dark:bg-gray-900"><header className="flex min-h-16 items-center gap-3 border-b border-slate-200 px-3 dark:border-gray-800"><Link to="/app/messages" className="grid min-h-11 min-w-11 place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-gray-800" aria-label="Back to messages"><ArrowLeft /></Link><div><h1 className="font-bold">Conversation</h1><p className="text-xs text-slate-500">Messages refresh automatically</p></div></header>
    <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3 sm:p-5 dark:bg-gray-950">{loading ? <p className="text-center text-sm text-slate-500">Loading conversation…</p> : messages.map(message => { const mine = message.sender_id === user?.id; return <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:max-w-[70%] ${mine ? "rounded-br-sm bg-green-700 text-white" : "rounded-bl-sm border border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-800"}`}><p className="whitespace-pre-wrap break-words">{message.text}</p><p className="mt-1 text-right text-[10px] opacity-70">{message.pending ? "Sending…" : formatRelativeTime(message.created_at)}{mine && message.read_at ? " · Read" : ""}</p></div></div>; })}<div ref={endRef} /></div>
    {error && <p role="alert" className="border-t border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}<form onSubmit={event => { event.preventDefault(); void send(); }} className="flex items-end gap-2 border-t border-slate-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void send(); } }} rows={1} maxLength={2000} placeholder="Type a message" className="min-h-11 flex-1 resize-none rounded-2xl border border-slate-300 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-800" /><Button type="submit" size="icon" disabled={!input.trim() || sending} aria-label="Send message"><Send size={19} /></Button></form></div>;
}
