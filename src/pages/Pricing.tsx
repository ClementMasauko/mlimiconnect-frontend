import { Link } from "react-router-dom";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Pricing() {
  return <main className="min-h-screen bg-gray-50 px-4 py-14 dark:bg-gray-950 sm:px-6">
    <div className="mx-auto max-w-4xl">
      <header className="mx-auto max-w-2xl text-center">
        <p className="font-semibold text-green-700 dark:text-green-400">MlimiConnect access</p>
        <h1 className="mt-2 text-4xl font-bold">Pricing without invented offers</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Marketplace registration and browsing are currently presented without a paid-plan claim. Any future fee must be published with its exact scope, duration, taxes, refund terms, and provider-confirmed checkout.</p>
      </header>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Card className="p-7">
          <CheckCircle2 className="text-green-700" />
          <h2 className="mt-4 text-2xl font-bold">Marketplace access</h2>
          <p className="mt-2 text-xl font-black text-green-700">No subscription required</p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Create an account to use the marketplace features that are visibly enabled for your role. Transaction charges, if configured, must be shown before payment.</p>
          <Link to="/register"><Button className="mt-6 w-full">Create account</Button></Link>
        </Card>
        <Card className="p-7">
          <Clock3 className="text-amber-600" />
          <h2 className="mt-4 text-2xl font-bold">Paid plans and promotions</h2>
          <p className="mt-2 text-xl font-black text-amber-700">Not available yet</p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">Subscriptions and promoted listings are disabled until billing, entitlement, cancellation, refund, and reporting workflows are production-ready.</p>
          <Link to="/contact"><Button variant="outline" className="mt-6 w-full">Contact the team</Button></Link>
        </Card>
      </div>
      <div className="mt-6 flex gap-3 rounded-xl border border-green-100 bg-green-50 p-5 text-sm text-green-950 dark:border-green-900 dark:bg-green-950/30 dark:text-green-100">
        <ShieldCheck className="mt-0.5 shrink-0 text-green-700 dark:text-green-400" size={20} />
        <p>No balance, paid entitlement, promotion, or professional appointment is active merely because a screen exists.</p>
      </div>
    </div>
  </main>;
}
