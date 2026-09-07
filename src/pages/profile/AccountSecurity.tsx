import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Link2, ShieldCheck } from "lucide-react";
import AccountNav from "../../components/AccountNav";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import api, { getApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

type SecuritySummary = { google_connected: boolean; has_usable_password: boolean; recent_activity: Array<{ action: string; provider: string; created_at: string }> };

export default function AccountSecurity() {
  const { user, refreshUserProfile } = useAuth();
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const load = () => api.get<SecuritySummary>("/api/auth/security/").then(({ data }) => setSummary(data)).catch(reason => setMessage(getApiError(reason, "Could not load account security.")));
  useEffect(() => { void load(); }, []);

  const linkGoogle = async (credential: string) => {
    setBusy(true); setMessage("");
    try { await api.post("/api/auth/google/link/", { credential }); await refreshUserProfile(); await load(); setMessage("Google account connected securely."); }
    catch (reason) { setMessage(getApiError(reason, "Could not connect Google.")); }
    finally { setBusy(false); }
  };
  const unlinkGoogle = async () => {
    setBusy(true); setMessage("");
    try { await api.post("/api/auth/google/unlink/", { password }); setPassword(""); await refreshUserProfile(); await load(); setMessage("Google account disconnected."); }
    catch (reason) { setMessage(getApiError(reason, "Could not disconnect Google.")); }
    finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-6xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-wider text-green-700">My account</p><h1 className="mt-1 text-3xl font-extrabold">Sign-in & security</h1><p className="mt-2 text-slate-500">Manage how you access MlimiConnect and review recent security activity.</p></div><div className="grid gap-7 lg:grid-cols-[240px_1fr]"><Card className="h-fit p-3"><AccountNav /></Card><div className="space-y-4">
    {message && <p role="status" className="rounded-lg border bg-white p-3 text-sm dark:bg-slate-900">{message}</p>}
    <Card className="p-6"><h2 className="flex items-center gap-2 text-lg font-extrabold"><KeyRound size={20} /> Sign-in methods</h2><div className="mt-5 space-y-5"><div className="flex items-center justify-between gap-4"><div><strong>Password</strong><p className="text-sm text-slate-500">{summary?.has_usable_password ? "A password is configured." : "No password is configured for this Google-created account."}</p></div><Link className="font-semibold text-green-700" to="/forgot-password">{summary?.has_usable_password ? "Reset" : "Set password"}</Link></div><div className="border-t pt-5"><div className="mb-3 flex items-center justify-between"><div><strong>Google</strong><p className="text-sm text-slate-500">{summary?.google_connected ? `Connected to ${user?.email}` : "Not connected"}</p></div>{summary?.google_connected && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Connected</span>}</div>{!summary?.google_connected && googleClientId && <GoogleSignInButton clientId={googleClientId} onCredential={credential => void linkGoogle(credential)} onError={setMessage} />}{summary?.google_connected && <div className="flex gap-2"><Input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Confirm password to disconnect" /><Button variant="outline" disabled={busy || !password || !summary.has_usable_password} onClick={() => void unlinkGoogle()}>Disconnect</Button></div>}</div></div></Card>
    <Card className="p-6"><h2 className="flex items-center gap-2 text-lg font-extrabold"><ShieldCheck size={20} /> Recent authentication activity</h2><div className="mt-4 divide-y dark:divide-slate-800">{summary?.recent_activity.map((item, index) => <div className="flex items-center gap-3 py-3" key={`${item.created_at}-${index}`}><Link2 size={17} className="text-green-700" /><div className="flex-1"><p className="text-sm font-semibold">{item.action.replaceAll("auth.", "").replaceAll("_", " ")}</p><p className="text-xs text-slate-500">{item.provider}</p></div><time className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</time></div>)}{summary && !summary.recent_activity.length && <p className="py-4 text-sm text-slate-500">No recent authentication events recorded.</p>}</div></Card>
  </div></div></div>;
}
