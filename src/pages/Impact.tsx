import { Award, ClipboardCheck, Heart, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const measures = [
  { icon: Users, title: "Farmer reach", description: "Count verified, active farmer accounts without presenting registrations as successful outcomes." },
  { icon: TrendingUp, title: "Income outcomes", description: "Compare consented baseline and follow-up income data using a documented sample and period." },
  { icon: Award, title: "Completed trade", description: "Report only completed, non-refunded orders and distinguish order count from transaction value." },
  { icon: Heart, title: "Post-harvest loss", description: "Measure product-specific losses before and after platform participation instead of using estimates as results." },
];

export default function Impact() {
  return <main className="min-h-screen bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <header className="mx-auto max-w-3xl text-center">
        <p className="font-bold uppercase tracking-[.16em] text-green-700">Pilot measurement</p>
        <h1 className="mt-3 text-4xl font-black text-gray-900 dark:text-white">Impact claims require evidence</h1>
        <p className="mt-5 text-lg text-gray-600 dark:text-gray-300">MlimiConnect has not yet published verified impact totals or participant testimonials. Results will appear here only with a measurement date, methodology, sample size, and responsible data source.</p>
      </header>
      <section className="mt-12 grid gap-5 md:grid-cols-2" aria-label="Planned impact measures">{measures.map(item => <Card key={item.title} className="p-6"><item.icon className="text-green-700" size={30} /><h2 className="mt-4 text-xl font-bold">{item.title}</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{item.description}</p><p className="mt-4 text-sm font-semibold text-amber-700 dark:text-amber-300">Verified result: not yet published</p></Card>)}</section>
      <Card className="mt-8 border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/20"><ClipboardCheck className="text-green-700" size={28} /><h2 className="mt-3 text-xl font-bold">Publication standard</h2><p className="mt-2 text-slate-700 dark:text-slate-200">Future reports will separate platform activity from independently measured impact, explain limitations, protect participant privacy, and retain supporting evidence for review.</p></Card>
      <div className="mt-10 text-center"><Button asChild><Link to="/register">Join the pilot</Link></Button></div>
    </div>
  </main>;
}
