import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Menu, Search, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import BrandLogo from "./BrandLogo";

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout, isLoading } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const goToSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("q")?.toString().trim();
    navigate(value ? `/app/marketplace/search?q=${encodeURIComponent(value)}` : "/app/marketplace/search");
  };

  return <header className="sticky top-0 z-50 bg-white shadow-[0_1px_0_rgba(23,32,51,.12)] dark:bg-gray-950">
    <div className="border-b border-slate-100 bg-slate-50 text-xs text-slate-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
      <div className="mx-auto flex h-8 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <span>{t("welcome")}</span>
        <div className="flex items-center gap-4"><Link to="/app/marketplace" className="hover:text-green-700">{t("dailyDeals")}</Link><Link to="/support" className="hover:text-green-700">{t("helpContact")}</Link></div>
      </div>
    </div>
    <div className="mx-auto flex min-h-[72px] max-w-screen-2xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <BrandLogo to="/app/dashboard" compact />
      <button type="button" onClick={() => navigate("/app/marketplace")} className="hidden items-center gap-1 text-sm font-medium text-slate-700 lg:flex dark:text-slate-200"><Menu size={18} /> {t("shop")} <ChevronDown size={14} /></button>
      <form onSubmit={goToSearch} className="flex min-w-0 flex-1 rounded-lg border-2 border-green-700 bg-white focus-within:ring-2 focus-within:ring-green-200 dark:bg-gray-900">
        <button type="button" onClick={() => navigate("/app/marketplace")} className="hidden border-r border-slate-200 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 md:block dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">{t("allCategories")}</button>
        <input name="q" type="search" aria-label={t("searchMarketplace")} placeholder={t("searchMarketplace")} className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
        <button type="submit" className="grid w-12 place-items-center bg-green-700 text-white transition hover:bg-green-800" aria-label="Search"><Search size={20} /></button>
      </form>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <LanguageSwitcher compact />
        <Link to="/app/profile/notifications" className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:block dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Notifications"><Bell size={20} /></Link>
        <Link to="/app/marketplace/cart" className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800" aria-label="Shopping cart"><ShoppingCart size={22} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900">{cartCount}</span>}</Link>
        {isLoading ? <span className="h-9 w-16 animate-pulse rounded bg-slate-200" /> : user ? <>
          <Link to="/app/profile" className="hidden max-w-32 truncate rounded-lg px-2 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 md:block dark:text-white dark:hover:bg-gray-800">{t("helloUser", { name: user.username })}</Link>
          <button onClick={() => { logout(); navigate("/"); }} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label={t("logout")}><LogOut size={19} /></button>
        </> : <Link to="/login" className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800">{t("signIn")}</Link>}
      </div>
    </div>
    <nav className="border-t border-slate-100 bg-white dark:border-gray-800 dark:bg-gray-950"><div className="mx-auto flex max-w-screen-2xl items-center gap-6 overflow-x-auto px-4 py-2.5 text-sm font-medium text-slate-700 sm:px-6 lg:px-8 dark:text-gray-300"><Link to="/app/marketplace" className="whitespace-nowrap hover:text-green-700">{t("marketplace")}</Link><Link to="/app/marketplace/farm-inputs" className="whitespace-nowrap hover:text-green-700">{t("farmInputs")}</Link><Link to="/app/listings/new" className="whitespace-nowrap hover:text-green-700">{t("sellProduce")}</Link><Link to="/app/advisory/market-feed" className="whitespace-nowrap hover:text-green-700">{t("marketPrices")}</Link><Link to="/app/advisory" className="whitespace-nowrap hover:text-green-700">{t("farmerTools")}</Link></div></nav>
  </header>;
}
