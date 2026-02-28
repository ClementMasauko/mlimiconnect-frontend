import React from "react";

export default function Card({ children, className="" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-var-card shadow-sm p-4 rounded-lg ${className}`} style={{ backgroundColor: "var(--card)" }}>
      {children}
    </div>
  );
}
