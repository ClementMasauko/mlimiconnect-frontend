import { Link, useLocation } from "react-router-dom";
import { Home, Menu, Plus, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { cn } from "../lib/utils";

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { items } = useCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const linkClass = (active: boolean) => cn("flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold", active ? "text-green-700 dark:text-green-400" : "text-slate-500 dark:text-gray-400");

  return (
    <nav aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(15,23,42,.08)] backdrop-blur lg:hidden dark:border-gray-800 dark:bg-gray-950/95">
      <Link to="/app/dashboard" className={linkClass(pathname === "/app/dashboard")}><Home size={20} /><span>{t("dashboard")}</span></Link>
      <Link to="/app/marketplace" className={linkClass(pathname.startsWith("/app/marketplace"))}><ShoppingBag size={20} /><span>{t("marketplace")}</span></Link>
      <Link to="/app/listings/new" className={linkClass(pathname === "/app/listings/new")}><span className="grid h-9 w-9 -translate-y-2 place-items-center rounded-full bg-green-700 text-white shadow-md"><Plus size={22} /></span><span className="-mt-2">{t("sellProduce")}</span></Link>
      <Link to="/app/marketplace/cart" className={`${linkClass(pathname === "/app/marketplace/cart")} relative`}><ShoppingBag size={20} />{count > 0 && <span className="absolute right-[27%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-amber-400 px-1 text-[9px] font-black text-slate-950">{count}</span>}<span>{t("shoppingCart")}</span></Link>
      <button type="button" onClick={() => window.dispatchEvent(new Event("mc:open-app-nav"))} className={linkClass(false)}><Menu size={20} /><span>{t("menu")}</span></button>
    </nav>
  );
}
