import { UserCheck } from "lucide-react";
import Card from "../../components/ui/Card";

export default function VerifyBuyers() {
  return <div className="mx-auto max-w-3xl py-8">
    <h1 className="flex items-center gap-3 text-3xl font-bold"><UserCheck className="text-emerald-700" />Buyer verification review</h1>
    <Card className="mt-7 p-7">
      <h2 className="text-xl font-bold">Verification queue is not connected</h2>
      <p className="mt-3 text-slate-600 dark:text-slate-300">No sample applicants or inactive approval controls are shown. Enable this module only after it loads real applications, protects identity documents, records reviewer decisions, and provides an audit trail.</p>
    </Card>
  </div>;
}
