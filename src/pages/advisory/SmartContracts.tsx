import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

interface Agreement { id: number; name: string; terms: Record<string, unknown>; status: string; created_at: string }

export default function SmartContracts() {
  const [contracts, setContracts] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { api.get<Agreement[]>("/api/advisory/smart-contracts/").then(({ data }) => setContracts(data)).catch(requestError => setError(getApiError(requestError, "Agreements could not be loaded."))).finally(() => setLoading(false)); }, []);
  return <div className="mx-auto max-w-5xl px-4 py-8"><Link to="/app/advisory" className="font-semibold text-green-700">← Back to advisory</Link><div className="mt-4 flex flex-wrap items-start justify-between gap-4"><div><h1 className="flex items-center gap-3 text-3xl font-black"><FileText className="text-green-700" />Agricultural agreements</h1><p className="mt-2 text-slate-600 dark:text-slate-300">Draft and track agreement terms. A saved record is not automatically a signed legal contract, insurance policy or payment instruction.</p></div><Button asChild><Link to="/app/advisory/smart-contracts/new"><Plus size={17} className="mr-2" />New draft</Link></Button></div>{error && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}<div className="mt-7 space-y-4">{contracts.map(contract => <Card key={contract.id} className="p-6"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-bold">{contract.name}</h2><p className="mt-1 text-sm text-slate-500">Created {new Date(contract.created_at).toLocaleDateString()}</p></div><span className="h-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize text-slate-700">{contract.status}</span></div><dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">{Object.entries(contract.terms || {}).map(([key, value]) => <div key={key}><dt className="font-semibold capitalize text-slate-500">{key.replaceAll("_", " ")}</dt><dd>{String(value || "Not specified")}</dd></div>)}</dl></Card>)}{!loading && !contracts.length && !error && <Card className="p-10 text-center text-slate-500">No agreement drafts yet.</Card>}{loading && <p className="text-center text-slate-500">Loading agreements...</p>}</div></div>;
}
