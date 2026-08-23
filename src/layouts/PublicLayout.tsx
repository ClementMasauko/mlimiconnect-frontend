import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/ui/Footer";
import { BackNavigation } from "../components/RouteExperience";
export default function PublicLayout() { return <div className="marketplace-app flex min-h-screen flex-col bg-slate-50 dark:bg-gray-950"><Navbar /><main className="flex-1"><div className="mx-auto max-w-screen-2xl px-4 pt-5 sm:px-6 lg:px-8"><BackNavigation /></div><Outlet /></main><Footer /></div>; }
