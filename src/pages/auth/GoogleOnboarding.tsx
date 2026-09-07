import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthShell from "../../components/AuthShell";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api, { getApiError } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

type AccountType = "individual" | "cooperative" | "company";
type TradingMode = "buy" | "sell" | "both";

export default function GoogleOnboarding() {
  const navigate = useNavigate();
  const { user, refreshUserProfile } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [tradingMode, setTradingMode] = useState<TradingMode>("buy");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState({ legal_name: "", registration_number: "", representative_name: "", representative_role: "", address: "", business_size: "small" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!user?.requires_onboarding) return <AuthShell title="Profile already configured" description="Your MlimiConnect account setup is complete."><Button className="w-full" onClick={() => navigate("/app/dashboard")}>Continue</Button></AuthShell>;

  const submit = async () => {
    setBusy(true); setError("");
    try {
      await api.post("/api/auth/google/onboarding/", { account_type: accountType, trading_mode: tradingMode, phone, location, organization: accountType === "individual" ? undefined : organization });
      await refreshUserProfile();
      navigate(tradingMode === "buy" ? "/app/marketplace" : "/app/dashboard", { replace: true });
    } catch (reason) { setError(getApiError(reason, "Could not complete your account setup.")); }
    finally { setBusy(false); }
  };

  const organizationIncomplete = accountType !== "individual" && Object.entries(organization).some(([key, value]) => key !== "business_size" && !value);
  return <AuthShell title="Complete your MlimiConnect profile" description="Tell us how you plan to use the agricultural marketplace.">
    <div className="space-y-5">
      <div><label className="mb-2 block text-sm font-bold">Account type</label><div className="grid grid-cols-3 gap-2">{(["individual", "cooperative", "company"] as AccountType[]).map(value => <button type="button" key={value} onClick={() => setAccountType(value)} className={`min-h-11 rounded-lg border px-2 text-sm font-semibold capitalize ${accountType === value ? "border-green-700 bg-green-50 text-green-800" : "border-slate-300"}`}>{value}</button>)}</div></div>
      <div><label className="mb-2 block text-sm font-bold">I want to</label><div className="grid grid-cols-3 gap-2">{(["buy", "sell", "both"] as TradingMode[]).map(value => <button type="button" key={value} onClick={() => setTradingMode(value)} className={`min-h-11 rounded-lg border px-2 text-sm font-semibold capitalize ${tradingMode === value ? "border-green-700 bg-green-50 text-green-800" : "border-slate-300"}`}>{value === "both" ? "Buy & sell" : value}</button>)}</div></div>
      <Input value={phone} onChange={event => setPhone(event.target.value)} placeholder="Phone number (optional)" />
      <Input value={location} onChange={event => setLocation(event.target.value)} placeholder="District or location" />
      {accountType !== "individual" && <div className="space-y-3 rounded-xl border p-4"><h2 className="font-bold">Organization details</h2>{Object.entries(organization).filter(([key]) => key !== "business_size").map(([key, value]) => <Input key={key} value={value} onChange={event => setOrganization(current => ({ ...current, [key]: event.target.value }))} placeholder={key.replaceAll("_", " ")} />)}<select value={organization.business_size} onChange={event => setOrganization(current => ({ ...current, business_size: event.target.value }))} className="min-h-11 w-full rounded-lg border px-3"><option value="small">Small organization</option><option value="medium">Medium organization</option><option value="large">Large organization</option></select></div>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button className="w-full" size="lg" disabled={busy || !location || organizationIncomplete} onClick={() => void submit()}>{busy ? "Saving profile…" : "Complete setup"}</Button>
    </div>
  </AuthShell>;
}
