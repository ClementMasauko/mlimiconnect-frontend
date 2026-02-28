// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as Accordion from "@radix-ui/react-accordion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ListOrdered,
  Store,
  MessageSquare,
  Leaf,
  BarChart3,
  Lightbulb,
  User,
  Settings,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Bell,
  BookOpen,
  Plus,
  Wallet,       // ← Added for Wallet
  ShoppingCart, // ← Added for Cart
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const { user, isLoading } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <aside className="w-64 hidden lg:block">
        <div className="space-y-3 p-4 sticky top-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  const safeUser = user || { user_type: "buyer" };
  const isFarmer = safeUser.user_type === "farmer" || safeUser.user_type === "admin";
  const isAdmin = safeUser.user_type === "admin";

  const notificationCounts = {
    unreadMessages: 3,
    pendingOrdersBuyer: 2,
    pendingOrdersFarmer: 4,
    pendingDisputes: 1,
  };

  const sidebarContent = (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
      {/* Mobile header */}
      <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 lg:hidden">
        <h2 className="text-lg font-semibold">Menu</h2>
        <button onClick={() => setIsMobileOpen(false)} aria-label="Close menu">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 space-y-8 pb-24 lg:pb-4">
        {/* ─── MAIN ──────────────────────────────────────── */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Main
          </h3>
          <nav className="space-y-1">
            <SidebarLink
              to="/app/dashboard"
              icon={<LayoutDashboard className="w-5 h-5" />}
              label="Dashboard"
            />
            <SidebarLink
              to="/app/marketplace"
              icon={<ShoppingBag className="w-5 h-5" />}
              label="Marketplace"
            />

            {/* NEW: Cart link – visible to everyone (especially buyers) */}
            <SidebarLink
              to="/app/marketplace/cart"
              icon={<ShoppingCart className="w-5 h-5" />}
              label="Cart"
            />

            {safeUser.user_type === "buyer" && (
              <SidebarLink
                to="/app/orders"
                icon={<ListOrdered className="w-5 h-5" />}
                label="My Orders"
                badge={notificationCounts.pendingOrdersBuyer}
              />
            )}

            {isFarmer && (
              <SidebarLink
                to="/app/listings/orders"
                icon={<Package className="w-5 h-5" />}
                label="Farmer Orders"
                badge={notificationCounts.pendingOrdersFarmer}
              />
            )}
          </nav>
        </div>

        {/* ─── FARMER TOOLS ──────────────────────────────── */}
        {isFarmer && (
          <Accordion.Root type="single" collapsible defaultValue="farmer">
            <Accordion.Item value="farmer">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Store className="w-5 h-5 mr-3" />
                  <span>Farmer Tools</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pl-4 pt-1 space-y-1">
                <SidebarLink
                  to="/app/listings"
                  icon={<Store className="w-5 h-5" />}
                  label="My Listings"
                />
                <SidebarLink
                  to="/app/listings/new"
                  icon={<Plus className="w-5 h-5" />}
                  label="Create Listing"
                />
                <SidebarLink
                  to="/app/traceability"
                  icon={<Leaf className="w-5 h-5" />}
                  label="Traceability"
                  badge={notificationCounts.pendingDisputes}
                  badgeColor="bg-amber-500"
                />
                <SidebarLink
                  to="/app/traceability/batch/new"
                  icon={<Plus className="w-5 h-5" />}
                  label="New Batch"
                />
              </AccordionContent>
            </Accordion.Item>
          </Accordion.Root>
        )}

        {/* ─── TOOLS ─────────────────────────────────────── */}
        <Accordion.Root type="single" collapsible defaultValue="tools">
          <Accordion.Item value="tools">
            <AccordionTrigger>
              <div className="flex items-center">
                <Lightbulb className="w-5 h-5 mr-3" />
                <span>Tools</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pl-4 pt-1 space-y-1">
              <SidebarLink
                to="/app/advisory"
                icon={<Lightbulb className="w-5 h-5" />}
                label="Advisory"
              />
              <SidebarLink
                to="/app/messages"
                icon={<MessageSquare className="w-5 h-5" />}
                label="Messages"
                badge={notificationCounts.unreadMessages}
                badgeColor="bg-blue-500"
              />
              <SidebarLink
                to="/app/analytics"
                icon={<BarChart3 className="w-5 h-5" />}
                label="Analytics"
              />
            </AccordionContent>
          </Accordion.Item>
        </Accordion.Root>

        {/* ─── ACCOUNT ───────────────────────────────────── */}
        <div>
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Account
          </h3>
          <nav className="space-y-1">
            <SidebarLink
              to="/app/profile"
              icon={<User className="w-5 h-5" />}
              label="Profile"
            />
            <SidebarLink
              to="/app/profile/edit"
              icon={<Settings className="w-5 h-5" />}
              label="Settings"
            />
            <SidebarLink
              to="/app/profile/notifications"
              icon={<Bell className="w-5 h-5" />}
              label="Notifications"
            />
            <SidebarLink
              to="/app/profile/address-book"
              icon={<BookOpen className="w-5 h-5" />}
              label="Address Book"
            />

            {/* NEW: Wallet link – visible to everyone */}
            <SidebarLink
              to="/app/wallet"
              icon={<Wallet className="w-5 h-5" />}
              label="My Wallet"
            />
          </nav>
        </div>

        {/* ─── ADMIN ─────────────────────────────────────── */}
        {isAdmin && (
          <div className="pt-5 mt-3 border-t border-gray-200 dark:border-gray-800">
            <SidebarLink
              to="/admin"
              icon={<ShieldCheck className="w-5 h-5" />}
              label="Admin Panel"
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
              activeClass="bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
        <div className="relative w-80 max-w-[85vw] h-full shadow-2xl">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop fixed sidebar */}
      <div className="hidden lg:block w-64 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────
// Reusable NavLink with badge (unchanged)
// ──────────────────────────────────────────────────────
type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeColor?: string;
  className?: string;
  activeClass?: string;
};

function SidebarLink({
  to,
  icon,
  label,
  badge,
  badgeColor = "bg-red-500",
  className = "",
  activeClass = "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
}: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "group flex items-center px-4 py-3 rounded-lg transition-all relative",
          isActive
            ? activeClass
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
          className
        )
      }
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="ml-3 font-medium">{label}</span>

      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 min-w-[1.35rem] h-5 px-1.5 text-xs font-bold rounded-full text-white flex items-center justify-center shadow-sm",
            badgeColor
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
}

// Accordion Trigger & Content (unchanged)
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <Accordion.Header>
    <Accordion.Trigger
      ref={ref}
      className={cn(
        "group flex w-full items-center justify-between px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="w-5 h-5 transition-transform duration-200 group-data-[state=open]:rotate-180 opacity-70" />
    </Accordion.Trigger>
  </Accordion.Header>
));
AccordionTrigger.displayName = Accordion.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ className, children, ...props }, ref) => (
  <Accordion.Content
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
      className
    )}
    {...props}
  >
    {children}
  </Accordion.Content>
));
AccordionContent.displayName = Accordion.Content.displayName;