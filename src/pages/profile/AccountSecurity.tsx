import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Link2, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import AccountNav from "../../components/AccountNav";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import api, { getApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

type SecuritySummary = { google_connected: boolean; has_usable_password: boolean; two_factor_enabled: boolean; recovery_codes_remaining: number; recent_activity: Array<{ action: string; provider: string; created_at: string }> };
type AuthSession = { id: number; current: boolean; device: string; ip_address: string | null; created_at: string; last_seen_at: string };

export default function AccountSecurity() {
  const { user, refreshUserProfile } = useAuth();
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [twoFactorSetup, setTwoFactorSetup] = useState<{ secret: string; provisioning_uri: string } | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [sessions, setSessions] = useState<AuthSession[]>([]);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const load = () => api.get<SecuritySummary>("/api/auth/security/").then(({ data }) => setSummary(data)).catch(reason => setMessage(getApiError(reason, "Could not load account security.")));
  const loadSessions = () => api.get<AuthSession[]>("/api/auth/security/sessions/").then(({ data }) => setSessions(data)).catch(() => setSessions([]));
  useEffect(() => { void load(); void loadSessions(); }, []);

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
  const startTwoFactor = async () => {
    setBusy(true); setMessage(""); setRecoveryCodes([]);
    try { const { data } = await api.post("/api/auth/2fa/setup/"); setTwoFactorSetup(data); }
    catch (reason) { setMessage(getApiError(reason, "Could not start authenticator setup.")); }
    finally { setBusy(false); }
  };
  const confirmTwoFactor = async () => {
    setBusy(true); setMessage("");
    try { const { data } = await api.post<{ recovery_codes: string[] }>("/api/auth/2fa/confirm/", { code: twoFactorCode }); setRecoveryCodes(data.recovery_codes); setTwoFactorSetup(null); setTwoFactorCode(""); await refreshUserProfile(); await load(); setMessage("Two-factor authentication is enabled."); }
    catch (reason) { setMessage(getApiError(reason, "The authenticator code is incorrect.")); }
    finally { setBusy(false); }
  };
  const disableTwoFactor = async () => {
    setBusy(true); setMessage("");
    try { await api.post("/api/auth/2fa/disable/", { code: twoFactorCode, password }); setTwoFactorCode(""); setPassword(""); await refreshUserProfile(); await load(); setMessage("Two-factor authentication is disabled."); }
    catch (reason) { setMessage(getApiError(reason, "Could not disable two-factor authentication.")); }
    finally { setBusy(false); }
  };
  const revokeSessions = async (id?: number) => {
    setBusy(true); setMessage("");
    try { const { data } = await api.delete<{ revoked: number }>("/api/auth/security/sessions/", { data: id ? { id } : { all_other: true } }); await loadSessions(); setMessage(`${data.revoked} session${data.revoked === 1 ? "" : "s"} signed out.`); }
    catch (reason) { setMessage(getApiError(reason, "Could not revoke the selected sessions.")); }
    finally { setBusy(false); }
  };

  return <div className="mx-auto max-w-6xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-wider text-green-700">My account</p><h1 className="mt-1 text-3xl font-extrabold">Sign-in & security</h1><p className="mt-2 text-slate-500">Manage how you access MlimiConnect and review recent security activity.</p></div><div className="grid gap-7 lg:grid-cols-[240px_1fr]"><Card className="h-fit p-3"><AccountNav /></Card><div className="space-y-4">
    {message && <p role="status" className="rounded-lg border bg-white p-3 text-sm dark:bg-slate-900">{message}</p>}
    <Card className="p-6"><h2 className="flex items-center gap-2 text-lg font-extrabold"><KeyRound size={20} /> Sign-in methods</h2><div className="mt-5 space-y-5"><div className="flex items-center justify-between gap-4"><div><strong>Password</strong><p className="text-sm text-slate-500">{summary?.has_usable_password ? "A password is configured." : "No password is configured for this Google-created account."}</p></div><Link className="font-semibold text-green-700" to="/forgot-password">{summary?.has_usable_password ? "Reset" : "Set password"}</Link></div><div className="border-t pt-5"><div className="mb-3 flex items-center justify-between"><div><strong>Google</strong><p className="text-sm text-slate-500">{summary?.google_connected ? `Connected to ${user?.email}` : "Not connected"}</p></div>{summary?.google_connected && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Connected</span>}</div>{!summary?.google_connected && googleClientId && <GoogleSignInButton clientId={googleClientId} onCredential={credential => void linkGoogle(credential)} onError={setMessage} />}{summary?.google_connected && <div className="flex gap-2"><Input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Confirm password to disconnect" /><Button variant="outline" disabled={busy || !password || !summary.has_usable_password} onClick={() => void unlinkGoogle()}>Disconnect</Button></div>}</div></div></Card>
    <Card className="p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="flex items-center gap-2 text-lg font-extrabold"><ShieldCheck size={20} /> Authenticator two-factor authentication</h2><p className="mt-1 text-sm text-slate-500">Require a rotating code after password or Google sign-in.</p></div>{summary?.two_factor_enabled && <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">Enabled</span>}</div>
      {!summary?.two_factor_enabled && !twoFactorSetup && !recoveryCodes.length && <Button className="mt-5" disabled={busy} onClick={() => void startTwoFactor()}>Set up authenticator</Button>}
      {twoFactorSetup && <div className="mt-5 space-y-4"><p className="text-sm">Scan this QR code with Google Authenticator, Microsoft Authenticator, Authy, or another TOTP app.</p><div className="w-fit rounded-xl bg-white p-3"><QRCodeSVG value={twoFactorSetup.provisioning_uri} size={180} /></div><details className="text-sm"><summary className="cursor-pointer font-semibold">Cannot scan the QR code?</summary><code className="mt-2 block break-all rounded bg-slate-100 p-3 dark:bg-slate-800">{twoFactorSetup.secret}</code></details><div className="flex gap-2"><Input value={twoFactorCode} onChange={event => setTwoFactorCode(event.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" /><Button disabled={busy || twoFactorCode.length !== 6} onClick={() => void confirmTwoFactor()}>Confirm</Button></div></div>}
      {!!recoveryCodes.length && <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950"><strong>Save these recovery codes now</strong><p className="mt-1 text-sm">Each code works once. They will not be shown again.</p><div className="mt-3 grid grid-cols-2 gap-2 font-mono text-sm">{recoveryCodes.map(code => <code key={code}>{code}</code>)}</div><Button className="mt-4" variant="outline" onClick={() => navigator.clipboard.writeText(recoveryCodes.join("\n"))}>Copy codes</Button></div>}
      {summary?.two_factor_enabled && !recoveryCodes.length && <div className="mt-5 space-y-3"><p className="text-sm text-slate-500">{summary.recovery_codes_remaining} recovery codes remain.</p>{summary.has_usable_password && <Input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Current password" />}<Input value={twoFactorCode} onChange={event => setTwoFactorCode(event.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Current 6-digit authenticator code" /><Button variant="outline" disabled={busy || twoFactorCode.length !== 6 || (summary.has_usable_password && !password)} onClick={() => void disableTwoFactor()}>Disable two-factor authentication</Button></div>}
    </Card>
    <Card className="p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">Signed-in devices</h2><p className="mt-1 text-sm text-slate-500">Review and revoke active browser sessions.</p></div><Button variant="outline" disabled={busy || sessions.filter(item => !item.current).length === 0} onClick={() => void revokeSessions()}>Sign out other devices</Button></div><div className="mt-4 divide-y dark:divide-slate-800">{sessions.map(item => <div key={item.id} className="flex items-center justify-between gap-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.device}</p><p className="text-xs text-slate-500">{item.ip_address || "Unknown IP"} · Last active {new Date(item.last_seen_at).toLocaleString()}</p></div>{item.current ? <span className="text-xs font-bold text-green-700">Current</span> : <Button variant="outline" disabled={busy} onClick={() => void revokeSessions(item.id)}>Revoke</Button>}</div>)}</div></Card>
    <Card className="p-6"><h2 className="flex items-center gap-2 text-lg font-extrabold"><ShieldCheck size={20} /> Recent authentication activity</h2><div className="mt-4 divide-y dark:divide-slate-800">{summary?.recent_activity.map((item, index) => <div className="flex items-center gap-3 py-3" key={`${item.created_at}-${index}`}><Link2 size={17} className="text-green-700" /><div className="flex-1"><p className="text-sm font-semibold">{item.action.replaceAll("auth.", "").replaceAll("_", " ")}</p><p className="text-xs text-slate-500">{item.provider}</p></div><time className="text-xs text-slate-500">{new Date(item.created_at).toLocaleString()}</time></div>)}{summary && !summary.recent_activity.length && <p className="py-4 text-sm text-slate-500">No recent authentication events recorded.</p>}</div></Card>
  </div></div></div>;
}
