import { Link, useParams } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Card from "../../components/ui/Card";

export default function TraceabilityDetails() {
  const { productId } = useParams();
  return <div className="mx-auto max-w-2xl px-4 py-10"><Card className="p-8 text-center"><ShieldCheck className="mx-auto text-green-700" size={44} /><h1 className="mt-4 text-2xl font-bold">Traceability record required</h1><p className="mt-3 text-slate-600 dark:text-slate-300">Product {productId} has no batch record attached to this legacy link. Traceability is shown only from persisted, integrity-checked batch events; demonstration journeys are not displayed.</p><Link to="/app/traceability" className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white">Open traceability batches</Link></Card></div>;
}
