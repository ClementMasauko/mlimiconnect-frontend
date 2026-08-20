import type { ReactNode } from "react";

export default function Modal({ open, title, onClose, children }: {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button type="button" className="absolute inset-0 cursor-default bg-black/40" onClick={onClose} aria-label="Close dialog" />
      <div className="z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl dark:bg-[#071225]">
        <div className="mb-4 flex items-center justify-between">
          <div id="modal-title" className="font-semibold">{title}</div>
          <button type="button" onClick={onClose} className="rounded p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-600 dark:hover:bg-gray-800" aria-label="Close dialog">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
