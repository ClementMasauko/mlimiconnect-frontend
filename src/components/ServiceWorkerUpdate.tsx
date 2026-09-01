import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function ServiceWorkerUpdate() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const reloadStarted = useRef(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").then(registration => {
      if (registration.waiting) setWaiting(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            setDismissed(false);
            setWaiting(worker);
          }
        });
      });
    });
    const applyController = () => {
      if (reloadStarted.current) return;
      reloadStarted.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", applyController);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", applyController);
  }, []);

  const update = () => {
    if (!waiting || updating) return;
    setUpdating(true);
    waiting.postMessage({ type: "SKIP_WAITING" });
  };

  if (!waiting || dismissed) return null;
  return <div role="status" aria-live="polite" className="fixed bottom-4 left-1/2 z-[100] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-3 rounded-xl bg-slate-900 p-4 pr-12 text-white shadow-2xl">
    <span className="min-w-0 flex-1">A new MlimiConnect version is ready.</span>
    <button type="button" className="shrink-0 rounded bg-green-600 px-3 py-2 font-bold disabled:cursor-wait disabled:opacity-70" disabled={updating} onClick={update}>{updating ? "Updating…" : "Update now"}</button>
    <button type="button" aria-label="Dismiss update notification" title="Update later" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-slate-300 hover:bg-slate-700 hover:text-white" disabled={updating} onClick={() => setDismissed(true)}><X size={18} /></button>
  </div>;
}
