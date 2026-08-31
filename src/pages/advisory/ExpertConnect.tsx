import { BadgeCheck, CheckCircle2, Clock, ShieldAlert, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";

const requirements = ["Identity and contact verification", "Relevant agricultural or veterinary qualification review", "Declared specialty and service area", "Availability and escalation-response agreement", "Safety, privacy and audit requirements"];

export default function ExpertConnect() {
  return <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6"><div className="mx-auto max-w-4xl">
    <Link to="/app/advisory" className="font-semibold text-emerald-700 dark:text-emerald-400">← Back to advisory</Link>
    <header className="mt-4 text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950"><UserRound size={34}/></div><h1 className="mt-4 text-3xl font-black">Human expert service</h1><p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">Verified expert onboarding is in progress. MlimiConnect does not currently publish expert names, appointment times or professional availability that has not been verified.</p></header>
    <Card className="mt-8 border-amber-300 p-6"><h2 className="flex items-center gap-2 text-xl font-bold text-amber-900 dark:text-amber-200"><Clock/>Service status: onboarding</h2><p className="mt-3 leading-7">The platform can record crop-health escalation requests, but a request is not a confirmed consultation. Support will only connect a user after an appropriate verified professional is available.</p></Card>
    <div className="mt-6 grid gap-5 md:grid-cols-2"><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><BadgeCheck className="text-emerald-700"/>Before an expert is listed</h2><ul className="mt-4 space-y-3">{requirements.map(item=><li key={item} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-700" size={17}/>{item}</li>)}</ul></Card><Card className="p-6"><h2 className="flex items-center gap-2 text-xl font-bold"><ShieldAlert className="text-red-700"/>Urgent cases</h2><p className="mt-3 leading-7">Do not wait for an online response when crops, animals or people face an immediate safety risk. Contact a qualified local extension worker, veterinarian or the appropriate Malawi authority.</p><Link to="/contact" className="mt-5 inline-flex rounded-lg bg-emerald-700 px-5 py-3 font-bold text-white">Contact MlimiConnect support</Link></Card></div>
    <p className="mt-7 text-center text-sm text-slate-500">Automated crop-health screening remains available separately through Kindwise and always displays its consent and safety controls.</p>
  </div></main>;
}
