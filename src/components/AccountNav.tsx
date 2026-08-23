import { Link, useLocation } from "react-router-dom";
import { Bell, ChevronRight, MapPin, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const links = [{ to: "/app/profile", key: "personalInformation", icon: User }, { to: "/app/profile/address-book", key: "addressesContacts", icon: MapPin }, { to: "/app/profile/notifications-management", key: "notifications", icon: Bell }, { to: "/app/profile/settings", key: "accountPreferences", icon: Settings }];
export default function AccountNav() { const { pathname } = useLocation(); const { t } = useTranslation(); return <nav className="space-y-1">{links.map(({ to, key, icon: Icon }) => <Link key={to} to={to} className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${pathname === to ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-400" : "text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}><Icon size={18} /><span className="flex-1">{t(key)}</span><ChevronRight size={16} className="opacity-50" /></Link>)}</nav>; }
