import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }, [pathname]);
  return null;
}

export function BackNavigation() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const roots = ["/", "/app/dashboard", "/app/marketplace", "/admin"];
  if (roots.includes(pathname)) return null;
  return <button type="button" onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")} className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-green-300 hover:text-green-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"><ArrowLeft size={16} /> Back</button>;
}
