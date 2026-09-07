import { Landmark, ShieldCheck } from "lucide-react";
import Card from "../../components/ui/Card";

export default function Revenue() {
  return <div className="mx-auto max-w-3xl py-8">
    <h1 className="flex items-center gap-3 text-3xl font-bold"><Landmark className="text-emerald-700" />Revenue reporting</h1>
    <Card className="mt-7 p-7">
      <ShieldCheck className="text-amber-600" size={34} />
      <h2 className="mt-4 text-xl font-bold">Financial reporting is disabled</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">MlimiConnect does not display estimated balances, commissions, escrow amounts, or exports. This page can be enabled only after settled provider transactions are reconciled against an immutable platform ledger.</p>
    </Card>
  </div>;
}
