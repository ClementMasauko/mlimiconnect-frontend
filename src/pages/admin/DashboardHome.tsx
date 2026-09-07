import { useEffect, useState } from "react";
import { AlertTriangle, Package, ShoppingCart, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import api, { getApiError } from "../../lib/api";

type Overview = { users: number; activeListings: number; orders: number; disputes: number };

export default function DashboardHome() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get<Overview>("/api/admin/overview/")
      .then(({ data }) => setOverview(data))
      .catch(reason => setError(getApiError(reason, "Admin overview could not be loaded.")));
  }, []);

  const stats = overview ? [
    { icon: Users, label: "Registered users", value: overview.users, to: "/admin/users" },
    { icon: Package, label: "Active listings", value: overview.activeListings, to: "/admin/listing-approvals" },
    { icon: ShoppingCart, label: "Orders", value: overview.orders, to: "/admin/analytics" },
    { icon: AlertTriangle, label: "Disputes", value: overview.disputes, to: "/admin/disputes" },
  ] : [];

  return <div className="mx-auto max-w-7xl py-4 sm:py-8">
    <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white"><img src="/logo-mark.png" alt="" className="h-10 w-10 object-contain" />Admin dashboard</h1>
    <p className="mt-2 text-slate-500">Operational counts loaded from the platform API.</p>
    {error && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}
    {!overview && !error && <p className="mt-8 text-center text-slate-500">Loading platform overview…</p>}
    {overview && <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{stats.map(item => <Link key={item.label} to={item.to}><Card className="h-full p-5 transition hover:border-emerald-400 hover:shadow-md"><item.icon className="text-emerald-700" size={26} /><p className="mt-4 text-sm text-slate-500">{item.label}</p><p className="mt-1 text-3xl font-black">{Number(item.value).toLocaleString()}</p></Card></Link>)}</div>}
    <div className="mt-8 grid gap-5 md:grid-cols-3">
      <Action title="Moderation queue" description="Review seller, listing and organisation requests." to="/admin/approvals" />
      <Action title="Provider status" description="Confirm external service configuration before enabling dependent features." to="/admin/providers" />
      <Action title="Operational events" description="Inspect request outcomes and recent platform health signals." to="/admin/operations" />
    </div>
  </div>;
}

function Action({ title, description, to }: { title: string; description: string; to: string }) {
  return <Link to={to}><Card className="h-full p-5"><h2 className="font-bold">{title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p><span className="mt-4 inline-block text-sm font-bold text-emerald-700">Open →</span></Card></Link>;
}
