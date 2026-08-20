import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import Button from "./ui/Button";
import Modal from "./ui/Modal";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export default function InstallAppButton({ compact = false }: { compact?: boolean }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [installed, setInstalled] = useState(() => window.matchMedia("(display-mode: standalone)").matches);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  const beginInstall = () => prompt ? setShowInstall(true) : setShowHelp(true);
  const install = async () => {
    if (!prompt) return;
    setShowInstall(false);
    await prompt.prompt();
    const choice = await prompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setPrompt(null);
  };

  return <>
    <Button type="button" variant="outline" size={compact ? "icon" : "md"} onClick={beginInstall} title="Install app" aria-label="Install app">
      <Download size={18} className={compact ? "" : "mr-2"} />{!compact && "Install app"}
    </Button>
    <Modal open={showInstall} title="Install MlimiConnect" onClose={() => setShowInstall(false)}>
      <p className="text-sm text-gray-600 dark:text-gray-300">MlimiConnect is ready to install on this device. Continue to confirm the installation with your browser.</p>
      <div className="mt-6 flex justify-end gap-3"><Button variant="outline" onClick={() => setShowInstall(false)}>Cancel</Button><Button onClick={() => void install()}><Download size={17} className="mr-2" />Continue</Button></div>
    </Modal>
    <Modal open={showHelp} title="Install MlimiConnect" onClose={() => setShowHelp(false)}>
      <div className="space-y-4 text-sm text-gray-700 dark:text-gray-200">
        <div className="flex gap-3"><Smartphone className="mt-0.5 shrink-0 text-green-600" size={20} /><p><strong>Android (Chrome):</strong> open the browser menu (⋮), then choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</p></div>
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"><p><strong>iPhone (Safari):</strong> tap Share, scroll down, then tap <strong>Add to Home Screen</strong>.</p></div>
        <p className="text-gray-500 dark:text-gray-400">Use the published site over HTTPS. This button installs the web app; it does not download an APK file. Installation is not available from a file preview or some in-app browsers.</p>
      </div>
    </Modal>
  </>;
}
