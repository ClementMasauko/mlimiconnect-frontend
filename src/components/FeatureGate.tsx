import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Construction, ShieldCheck } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { features, type FeatureName } from "../config/features";

export default function FeatureGate({ feature, title, children }: { feature: FeatureName; title: string; children: ReactNode }) {
  if (features[feature]) return children;

  return <div className="mx-auto max-w-2xl py-10">
    <Card className="p-7 text-center sm:p-10">
      <Construction className="mx-auto text-amber-600" size={44} aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">{title} is not available yet</h1>
      <p className="mx-auto mt-3 max-w-lg text-slate-600 dark:text-slate-300">This feature remains disabled until its server workflow, security controls, reconciliation, and operational support are complete.</p>
      <p className="mx-auto mt-5 flex max-w-lg items-start gap-2 rounded-lg bg-emerald-50 p-3 text-left text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"><ShieldCheck className="mt-0.5 shrink-0" size={18} />No balance, payment, approval, or service shown here should be treated as active while this notice is displayed.</p>
      <Button asChild className="mt-6"><Link to="/app/dashboard">Return to dashboard</Link></Button>
    </Card>
  </div>;
}
