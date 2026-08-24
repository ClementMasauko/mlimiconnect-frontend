import React from "react";

export default function Table({ children }:{ children:React.ReactNode }){
  return (
    <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0" role="region" aria-label="Scrollable table" tabIndex={0}>
      <table className="min-w-full divide-y">
        {children}
      </table>
    </div>
  );
}
