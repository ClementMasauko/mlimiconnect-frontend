import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import LogoLoader from "../../components/LogoLoader";

interface AdminUser { id: number; username: string; email: string; phone?: string; location?: string; user_type: string; account_type?: string; can_buy?: boolean; can_sell?: boolean; organization_status?: string | null; isBuyerVerified?: boolean }
interface Page<T> { results: T[]; next: string | null; previous?: string | null; count?: number }

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [next, setNext] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (url = "/api/admin/users/", append = false) => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get<Page<AdminUser> | AdminUser[]>(url, { params: url.startsWith("/") ? { page_size: 30 } : undefined });
      const rows = Array.isArray(data) ? data : data.results;
      setUsers(current => append ? [...current, ...rows.filter(row => !current.some(item => item.id === row.id))] : rows);
      setNext(Array.isArray(data) ? null : data.next);
    } catch (requestError) { setError(getApiError(requestError, "Users could not be loaded.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  if (loading && !users.length) return <LogoLoader fullScreen />;
  return <div className="mx-auto max-w-7xl py-4"><div className="mb-6"><h1 className="flex items-center gap-3 text-3xl font-black"><Users className="text-green-700" />User management</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Read-only account directory. Role, suspension and verification changes require dedicated audited server actions.</p></div>{error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}<Card className="overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full divide-y dark:divide-slate-800"><thead className="bg-slate-50 dark:bg-slate-900"><tr>{["User", "Account", "Capabilities", "Verification", "Contact"].map(label => <th key={label} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">{label}</th>)}</tr></thead><tbody className="divide-y dark:divide-slate-800">{users.map(user => <tr key={user.id}><td className="px-5 py-4"><p className="font-bold">{user.username}</p><p className="text-xs text-slate-500">ID {user.id} · {user.user_type}</p></td><td className="px-5 py-4 text-sm capitalize">{user.account_type || "individual"}</td><td className="px-5 py-4 text-sm">{[user.can_buy && "Buy", user.can_sell && "Sell"].filter(Boolean).join(" · ") || "None"}</td><td className="px-5 py-4 text-sm capitalize">{user.organization_status || (user.isBuyerVerified ? "buyer verified" : "not verified")}</td><td className="px-5 py-4 text-sm"><p>{user.email}</p>{user.phone && <p className="text-slate-500">{user.phone}</p>}{user.location && <p className="text-slate-500">{user.location}</p>}</td></tr>)}</tbody></table></div>{!users.length && !error && <p className="p-8 text-center text-slate-500">No accounts found.</p>}{next && <div className="border-t p-4 text-center dark:border-slate-800"><button className="font-semibold text-green-700 disabled:opacity-50" disabled={loading} onClick={() => void load(next, true)}>{loading ? "Loading..." : "Load more users"}</button></div>}</Card></div>;
}
