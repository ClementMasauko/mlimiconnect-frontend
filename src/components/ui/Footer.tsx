import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../../lib/api";
import BrandLogo from "../BrandLogo";
import Button from "./Button";

export default function Footer() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const links = [{ to: "/about", key: "aboutUs" }, { to: "/app/marketplace", key: "marketplace" }, { to: "/app/listings/new", key: "sellProduce" }, { to: "/pricing", key: "pricing" }];
  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); try { await api.post("/api/newsletter/", { email: data.get("email") }); setStatus("success"); form.reset(); } catch { setStatus("error"); } };
  return <footer className="mt-auto border-t border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
    <div className="space-y-4"><BrandLogo /><p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t("authDescription")}</p><Link to="/contact" className="text-sm font-semibold text-green-700 dark:text-green-400">{t("contactTeam")}</Link></div>
    <div><h3 className="mb-4 font-semibold text-slate-900 dark:text-white">{t("explore")}</h3><ul className="space-y-3 text-sm">{links.map(link => <li key={link.to}><Link className="text-slate-500 hover:text-green-700 dark:text-slate-400 dark:hover:text-green-400" to={link.to}>{t(link.key)}</Link></li>)}</ul></div>
    <div><h3 className="mb-4 font-semibold text-slate-900 dark:text-white">{t("support")}</h3><div className="space-y-4 text-sm"><a href="mailto:support@mlimiconnect.mw" className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Mail size={17} />support@mlimiconnect.mw</a><a href="tel:+265999123456" className="flex items-center gap-2 text-slate-500 dark:text-slate-400"><Phone size={17} />+265 999 123 456</a><p className="text-slate-500">{t("supportHours")}</p></div></div>
    <div><h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{t("marketUpdates")}</h3><p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{t("updatesDescription")}</p><form className="space-y-3" onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">{t("emailAddress")}</label><input id="newsletter-email" name="email" required type="email" placeholder={t("emailAddress")} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white" /><Button type="submit" className="w-full"><Send size={16} className="mr-2" />{t("subscribe")}</Button></form><p className={`mt-3 text-xs ${status === "error" ? "text-red-500" : "text-slate-500"}`} role="status">{status === "success" ? t("subscribed") : status === "error" ? t("subscriptionFailed") : t("unsubscribeAnytime")}</p></div>
  </div><div className="border-t border-slate-200 dark:border-slate-800"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:justify-between lg:px-8"><p>© {new Date().getFullYear()} MlimiConnect. {t("rightsReserved")}</p><div className="flex gap-5"><Link to="/privacy">{t("privacy")}</Link><Link to="/terms">{t("terms")}</Link><Link to="/disclaimer">{t("disclaimer")}</Link></div></div></div></footer>;
}
