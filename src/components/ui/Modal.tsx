import { useEffect, useId, useRef, type ReactNode } from "react";

export default function Modal({ open, title, onClose, children }: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const selector = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";
    panel?.querySelector<HTMLElement>(selector)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(selector));
      if (!focusable.length) {
        event.preventDefault();
        panel.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : "Dialog"}>
      <button type="button" className="absolute inset-0 cursor-default bg-black/40" onClick={onClose} aria-label="Close dialog" />
      <div ref={panelRef} tabIndex={-1} className="z-10 max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-2xl outline-none dark:bg-[#071225]">
        <div className="mb-4 flex items-center justify-between">
          {title ? <h2 id={titleId} className="font-semibold">{title}</h2> : <span />}
          <button type="button" onClick={onClose} className="rounded p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 dark:hover:bg-gray-800" aria-label="Close dialog">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
