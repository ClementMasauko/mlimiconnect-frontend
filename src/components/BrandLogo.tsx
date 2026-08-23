import { Link } from "react-router-dom";

export default function BrandLogo({ to = "/", compact = false }: { to?: string; compact?: boolean }) {
  return <Link to={to} className="flex shrink-0 items-center gap-2 font-extrabold tracking-tight text-slate-900 dark:text-white" aria-label="MlimiConnect home"><img src="/logo-mark.png" alt="" className="h-10 w-10 object-contain" /><span className={compact ? "hidden xl:block" : ""}>Mlimi<span className="text-green-700 dark:text-green-400">Connect</span></span></Link>;
}
