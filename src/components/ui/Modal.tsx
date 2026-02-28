import React from "react";

export default function Modal({ open, title, onClose, children }:{
  open:boolean, title?:string, onClose:()=>void, children:React.ReactNode
}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#071225] rounded-lg p-4 z-10 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="px-2">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
