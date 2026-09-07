import { BarChart3, FileText, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function Reports() {
  return <div className="mx-auto max-w-4xl py-8">
    <h1 className="flex items-center gap-3 text-3xl font-bold"><FileText className="text-green-700" />Reports and exports</h1>
    <p className="mt-2 text-slate-500">Only server-backed information is presented. Sample report totals and inactive download controls have been removed.</p>
    <div className="mt-7 grid gap-5 sm:grid-cols-2">
      <Card className="p-6"><BarChart3 className="text-green-700" /><h2 className="mt-4 text-xl font-bold">Platform analytics</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Review current user, listing, order, dispute, volume, and category aggregates from the admin API.</p><Button asChild className="mt-5"><Link to="/admin/analytics">Open analytics</Link></Button></Card>
      <Card className="p-6"><ShieldCheck className="text-amber-600" /><h2 className="mt-4 text-xl font-bold">Financial exports</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Disabled until ledger-backed settlement and revenue reporting are complete. No estimated figures are exported.</p></Card>
    </div>
  </div>;
}
