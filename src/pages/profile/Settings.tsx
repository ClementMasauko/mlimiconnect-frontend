import { useEffect, useState } from "react";
import { Globe, LogOut, Moon, Smartphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import AccountNav from "../../components/AccountNav";
import DeleteAccountDialog from "../../components/DeleteAccountDialog";
import { useAuth } from "../../context/AuthContext";
import { applyTheme, getTheme } from "../../lib/theme";
import InstallAppButton from "../../components/InstallAppButton";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) { return <button type="button" onClick={onChange} className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-green-700" : "bg-slate-300 dark:bg-gray-700"}`} aria-pressed={checked}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`} /></button>; }

export default function SettingsPage() {
  const navigate = useNavigate(); const { logout } = useAuth(); const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(() => getTheme() === "dark"); const [lowData, setLowData] = useState(() => localStorage.getItem("mc_low_data") === "true");
  useEffect(() => applyTheme(darkMode ? "dark" : "light"), [darkMode]);
  useEffect(() => { document.documentElement.classList.toggle("low-data", lowData); localStorage.setItem("mc_low_data", String(lowData)); }, [lowData]);
  return <div className="mx-auto max-w-6xl"><div className="mb-7"><p className="text-sm font-bold uppercase tracking-[.15em] text-green-700">{t("myAccount")}</p><h1 className="mt-1 text-3xl font-extrabold dark:text-white">{t("accountPreferences")}</h1><p className="mt-2 text-slate-500">{t("preferencesDescription")}</p></div><div className="grid gap-7 lg:grid-cols-[240px_1fr]"><Card className="h-fit p-3"><AccountNav /></Card><div className="space-y-4"><Card className="p-6"><h2 className="text-lg font-extrabold">{t("regionalDisplay")}</h2><div className="mt-5 divide-y divide-slate-100 dark:divide-gray-800"><div className="flex items-center gap-3 py-4"><Globe className="text-green-700" size={19} /><label className="flex-1 font-semibold">{t("language")}</label><select value={i18n.resolvedLanguage?.startsWith("ny") ? "ny" : "en"} onChange={event => void i18n.changeLanguage(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"><option value="en">{t("english")}</option><option value="ny">{t("chichewa")}</option></select></div><div className="flex items-center gap-3 py-4"><Moon className="text-green-700" size={19} /><span className="flex-1"><strong className="block">{t("darkMode")}</strong><small className="text-slate-500">{t("darkModeDescription")}</small></span><Toggle checked={darkMode} onChange={() => setDarkMode(!darkMode)} /></div><div className="flex items-center gap-3 py-4"><Smartphone className="text-green-700" size={19} /><span className="flex-1"><strong className="block">{t("lowDataMode")}</strong><small className="text-slate-500">{t("lowDataDescription")}</small></span><Toggle checked={lowData} onChange={() => setLowData(!lowData)} /></div></div></Card><Card className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-extrabold">{t("mobileExperience")}</h2><p className="mt-1 text-sm text-slate-500">{t("installDescription")}</p></div><InstallAppButton /></Card><Card className="border-red-200 p-6"><h2 className="font-extrabold text-red-700">{t("accountActions")}</h2><div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" onClick={() => { logout(); navigate("/login"); }}><LogOut size={17} className="mr-2" />{t("logout")}</Button><DeleteAccountDialog /></div></Card></div></div></div>;
}
