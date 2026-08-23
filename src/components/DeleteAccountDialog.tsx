import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";

export default function DeleteAccountDialog() {
  const navigate = useNavigate(); const { logout } = useAuth();
  const [open, setOpen] = useState(false); const [step, setStep] = useState<"password" | "otp">("password");
  const [password, setPassword] = useState(""); const [otp, setOtp] = useState(""); const [token, setToken] = useState(""); const [destination, setDestination] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const close = () => { if (!busy) { setOpen(false); setStep("password"); setPassword(""); setOtp(""); setError(""); } };
  const requestCode = async () => { setBusy(true); setError(""); try { const { data } = await api.post("/api/users/account", { password }); setToken(data.token); setDestination(data.masked_email); setStep("otp"); } catch (reason) { setError(getApiError(reason, "Could not verify your password.")); } finally { setBusy(false); } };
  const confirmDeletion = async () => { setBusy(true); setError(""); try { await api.delete("/api/users/account", { data: { token, otp } }); logout(); navigate("/login", { replace: true }); } catch (reason) { setError(getApiError(reason, "Could not delete your account.")); setBusy(false); } };
  return <><Button variant="outline" className="border-red-200 text-red-700" onClick={() => setOpen(true)}><Trash2 size={17} className="mr-2" />Delete account</Button><Modal open={open} title="Secure account deletion" onClose={close}><div className="space-y-4"><div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">This permanently disables access to your account. Contact support first if you only need help or want to change account details.</div>{step === "password" ? <><label className="block text-sm font-semibold">Confirm your password</label><Input type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} /><p className="text-xs text-slate-500">A six-digit code will then be sent to your registered email.</p></> : <><label className="block text-sm font-semibold">Enter the code sent to {destination}</label><Input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, ""))} /><p className="text-xs text-slate-500">The code expires in 10 minutes. Never share it.</p></>}{error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}<div className="flex justify-end gap-3"><Button variant="outline" onClick={close} disabled={busy}>Cancel</Button><Button className="bg-red-700 hover:bg-red-800" disabled={busy || (step === "password" ? !password : otp.length !== 6)} onClick={step === "password" ? requestCode : confirmDeletion}>{busy ? "Please wait..." : step === "password" ? "Send verification code" : "Permanently delete account"}</Button></div></div></Modal></>;
}
