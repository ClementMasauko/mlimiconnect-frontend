import React from "react";

export default function Card({ children, className="" }: { children: React.ReactNode, className?: string }) {
  return <div className={`rounded-xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(15,23,42,.05)] transition duration-200 dark:border-gray-800 dark:bg-gray-900 ${className}`}>{children}</div>;
}
