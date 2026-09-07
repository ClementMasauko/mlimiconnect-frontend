import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ children, className = "", ...props }: CardProps) {
  return <div {...props} className={`ui-card rounded-lg border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,.05)] transition duration-200 sm:rounded-xl dark:border-gray-800 dark:bg-gray-900 ${className}`}>{children}</div>;
}
