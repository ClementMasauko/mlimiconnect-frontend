import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/ui/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout(){
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container-max flex gap-6 mt-6">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
