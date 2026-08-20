import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, X } from "lucide-react";
import Card from "./ui/Card";
import Button from "./ui/Button";
import type { User } from "../context/AuthContext";

type Step = { id: string; title: string; description: string; to: string; action: string };

export default function GettingStartedChecklist({ user }: { user: User | null }) {
  const storageKey = `mc_getting_started_${user?.id ?? "guest"}`;
  const [completed, setCompleted] = useState<string[]>(() => JSON.parse(localStorage.getItem(`${storageKey}_done`) || "[]"));
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(`${storageKey}_dismissed`) === "true");
  const isFarmer = user?.user_type === "farmer" || user?.user_type === "admin";
  const steps = useMemo<Step[]>(() => isFarmer ? [
    { id: "profile", title: "Complete your profile", description: "Add your location and contact details so buyers can trust you.", to: "/app/profile/edit", action: "Complete profile" },
    { id: "listing", title: "Create your first listing", description: "Add produce, quantity and price for buyers to find.", to: "/app/listings/new", action: "Add a listing" },
    { id: "orders", title: "Review incoming orders", description: "See paid orders and confirm delivery only when the buyer receives it.", to: "/app/listings/orders", action: "View orders" },
  ] : [
    { id: "profile", title: "Complete your profile", description: "Add a location and contact details for smoother delivery.", to: "/app/profile/edit", action: "Complete profile" },
    { id: "marketplace", title: "Browse the marketplace", description: "Compare fresh produce, sellers and prices in one place.", to: "/app/marketplace", action: "Browse produce" },
    { id: "orders", title: "Track your orders", description: "Review your purchases, delivery status and receipts.", to: "/app/orders", action: "View my orders" },
  ], [isFarmer]);

  if (dismissed) return null;
  const markDone = (id: string) => {
    const next = completed.includes(id) ? completed : [...completed, id];
    setCompleted(next);
    localStorage.setItem(`${storageKey}_done`, JSON.stringify(next));
  };
  const complete = completed.length === steps.length;

  return <Card className="mb-8 border border-green-200 bg-green-50/60 p-5 dark:border-green-900/60 dark:bg-green-950/20">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div><h2 className="font-semibold text-gray-900 dark:text-white">Getting started</h2><p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{complete ? "You have completed the essentials." : `${completed.length} of ${steps.length} essential steps complete`}</p></div>
      <button type="button" onClick={() => { setDismissed(true); localStorage.setItem(`${storageKey}_dismissed`, "true"); }} className="rounded p-1 text-gray-500 hover:bg-green-100 hover:text-gray-700 dark:hover:bg-green-900/40" aria-label="Hide getting started checklist"><X size={18} /></button>
    </div>
    <div className="grid gap-3 lg:grid-cols-3">
      {steps.map((step) => {
        const done = completed.includes(step.id);
        return <div key={step.id} className="rounded-lg border border-green-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex gap-2">{done ? <CheckCircle2 className="shrink-0 text-green-600" size={19} /> : <Circle className="shrink-0 text-gray-400" size={19} />}<div><h3 className="font-medium text-gray-900 dark:text-white">{step.title}</h3><p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{step.description}</p></div></div>
          <Button asChild variant={done ? "outline" : "primary"} size="sm" className="mt-4 w-full"><Link to={step.to} onClick={() => markDone(step.id)}>{done ? "Review" : step.action}</Link></Button>
        </div>;
      })}
    </div>
  </Card>;
}
