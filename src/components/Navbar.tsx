import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Leaf, LogOut, Menu, Search, ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
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
        <span>Welcome to MlimiConnect</span>
        <div className="flex items-center gap-4"><Link to="/app/marketplace" className="hover:text-green-700">Daily deals</Link><Link to="/support" className="hover:text-green-700">Help & Contact</Link></div>
      </div>
    </div>
    <div className="mx-auto flex min-h-[72px] max-w-screen-2xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
      <Link to="/app/dashboard" className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white" aria-label="MlimiConnect home">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-green-700 text-white shadow-sm"><Leaf size={21} /></span><span className="hidden xl:block">Mlimi<span className="text-green-700 dark:text-green-400">Connect</span></span>
      </Link>
      <button className="hidden items-center gap-1 text-sm font-medium text-slate-700 lg:flex dark:text-slate-200"><Menu size={18} /> Shop <ChevronDown size={14} /></button>
      <form onSubmit={goToSearch} className="flex min-w-0 flex-1 rounded-lg border-2 border-green-700 bg-white focus-within:ring-2 focus-within:ring-green-200 dark:bg-gray-900">
        <div className="hidden border-r border-slate-200 px-3 py-2.5 text-sm text-slate-600 md:block dark:border-gray-700 dark:text-gray-300">All categories</div>
        <input name="q" type="search" aria-label="Search the marketplace" placeholder="Search produce, farm inputs and suppliers" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
        <button type="submit" className="grid w-12 place-items-center bg-green-700 text-white transition hover:bg-green-800" aria-label="Search"><Search size={20} /></button>
      </form>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <Link to="/app/profile/notifications" className="hidden rounded-full p-2 text-slate-600 hover:bg-slate-100 sm:block dark:text-gray-300 dark:hover:bg-gray-800" aria-label="Notifications"><Bell size={20} /></Link>
        <Link to="/app/marketplace/cart" className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800" aria-label="Shopping cart"><ShoppingCart size={22} />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-slate-900">{cartCount}</span>}</Link>
        {isLoading ? <span className="h-9 w-16 animate-pulse rounded bg-slate-200" /> : user ? <>
          <Link to="/app/profile" className="hidden max-w-32 truncate rounded-lg px-2 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100 md:block dark:text-white dark:hover:bg-gray-800">Hi, {user.username}</Link>
          <button onClick={() => { logout(); navigate("/"); }} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600" aria-label="Log out"><LogOut size={19} /></button>
        </> : <Link to="/login" className="rounded-lg bg-green-700 px-3 py-2 text-sm font-semibold text-white hover:bg-green-800">Sign in</Link>}
      </div>
    </div>
    <nav className="border-t border-slate-100 bg-white dark:border-gray-800 dark:bg-gray-950"><div className="mx-auto flex max-w-screen-2xl items-center gap-6 overflow-x-auto px-4 py-2.5 text-sm font-medium text-slate-700 sm:px-6 lg:px-8 dark:text-gray-300"><Link to="/app/marketplace" className="whitespace-nowrap hover:text-green-700">Marketplace</Link><Link to="/app/marketplace/farm-inputs" className="whitespace-nowrap hover:text-green-700">Farm inputs</Link><Link to="/app/listings/new" className="whitespace-nowrap hover:text-green-700">Sell your produce</Link><Link to="/app/advisory/market-feed" className="whitespace-nowrap hover:text-green-700">Market prices</Link><Link to="/app/advisory" className="whitespace-nowrap hover:text-green-700">Farmer tools</Link></div></nav>
  </header>;
}
