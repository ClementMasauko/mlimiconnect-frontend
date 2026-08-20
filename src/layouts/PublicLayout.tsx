import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/ui/Footer";
export default function PublicLayout() { return <div className="marketplace-app flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950"><Navbar /><main className="flex-1"><Outlet /></main><Footer /></div>; }
