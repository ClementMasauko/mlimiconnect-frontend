// src/components/admin/AdminSidebar.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import * as Accordion from '@radix-ui/react-accordion';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  CheckCircle,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Leaf,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function AdminSidebar({
  collapsed = false,
  onToggle,
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      onToggle?.();
      return next;
    });
  };

  // Mock counts – → real data later (context / query / ws)
  const counts = {
    newUsers: 28,
    pendingVerifications: 5,
    pendingApprovals: 12,
    activeDisputes: 7,
    reportsReady: 3,
  };

  const totalAlerts = counts.pendingApprovals + counts.activeDisputes;

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gray-950 text-gray-100 border-r border-gray-800">
      {/* Mobile header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-gray-800 lg:hidden">
        <div className="flex items-center gap-3">
          <Leaf className="h-7 w-7 text-emerald-500" />
          <div>
            <h2 className="text-lg font-semibold tracking-tight">MlimiConnect</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1.5">
        <SidebarLink
          to="/admin"
          icon={<LayoutDashboard className="h-5 w-5" />}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />

        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="users">
            <AccordionTrigger>
              <div className="flex items-center gap-3 w-full">
                <Users className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium">Users</span>}
                {counts.newUsers > 0 && !isCollapsed && (
                  <span className="ml-auto bg-amber-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    +{counts.newUsers}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <Accordion.Content className="pt-1 space-y-1">
              <SidebarLink to="/admin/users" icon={<Users className="h-4.5 w-4.5" />} label="All Users" isCollapsed={isCollapsed} />
              <SidebarLink
                to="/admin/users/pending"
                icon={<Clock className="h-4.5 w-4.5" />}
                label="Pending Verifications"
                badge={counts.pendingVerifications}
                badgeColor="bg-amber-600"
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                to="/admin/users/banned"
                icon={<ShieldCheck className="h-4.5 w-4.5" />}
                label="Banned Accounts"
                isCollapsed={isCollapsed}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="analytics">
            <AccordionTrigger>
              <div className="flex items-center gap-3 w-full">
                <BarChart3 className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium">Analytics</span>}
              </div>
            </AccordionTrigger>
            <Accordion.Content className="pt-1 space-y-1">
              <SidebarLink to="/admin/analytics" icon={<BarChart3 className="h-4.5 w-4.5" />} label="Platform Stats" isCollapsed={isCollapsed} />
              <SidebarLink
                to="/admin/reports"
                icon={<FileText className="h-4.5 w-4.5" />}
                label="Reports"
                badge={counts.reportsReady}
                badgeColor="bg-emerald-700"
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                to="/admin/analytics/revenue"
                icon={<TrendingUp className="h-4.5 w-4.5" />}
                label="Revenue Breakdown"
                isCollapsed={isCollapsed}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="moderation">
            <AccordionTrigger>
              <div className="flex items-center gap-3 w-full">
                <AlertTriangle className="h-5 w-5" />
                {!isCollapsed && <span className="font-medium">Moderation</span>}
                {totalAlerts > 0 && !isCollapsed && (
                  <span className="ml-auto bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {totalAlerts}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <Accordion.Content className="pt-1 space-y-1">
              <SidebarLink
                to="/admin/approvals"
                icon={<CheckCircle className="h-4.5 w-4.5" />}
                label="Pending Approvals"
                badge={counts.pendingApprovals}
                badgeColor="bg-amber-600"
                isCollapsed={isCollapsed}
              />
              <SidebarLink
                to="/admin/disputes"
                icon={<AlertTriangle className="h-4.5 w-4.5" />}
                label="Active Disputes"
                badge={counts.activeDisputes}
                badgeColor="bg-red-600"
                isCollapsed={isCollapsed}
              />
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <SidebarLink
          to="/admin/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isCollapsed={isCollapsed}
        />
      </nav>

      {/* Footer / Quick stats + Back link */}
      <div className="border-t border-gray-800 p-4 mt-auto">
        {!isCollapsed && (
          <div className="mb-5 p-4 rounded-lg bg-gray-900/60 text-sm border border-gray-800/50">
            <h3 className="text-gray-400 font-medium mb-3">Platform Snapshot</h3>
            <div className="space-y-2.5 text-gray-300">
              <div className="flex justify-between">
                <span>Users</span>
                <span className="font-semibold">1,842</span>
              </div>
              <div className="flex justify-between">
                <span>Pending</span>
                <span className="font-semibold text-amber-400">19</span>
              </div>
              <div className="flex justify-between">
                <span>Revenue (MTD)</span>
                <span className="font-semibold text-emerald-400">MWK 8.4M</span>
              </div>
            </div>
          </div>
        )}

        <SidebarLink
          to="/app/dashboard"
          icon={<LogOut className="h-5 w-5 rotate-180" />}
          label="Back to Main Platform"
          className="text-gray-300 hover:text-emerald-400 hover:bg-gray-800/60"
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger button */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-lg bg-gray-950 text-gray-100 border border-gray-800 shadow-lg hover:bg-gray-900 transition-colors"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open admin navigation"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
        <div className="relative w-72 max-w-[85vw] h-full shadow-2xl">
          {sidebarContent}
        </div>
      </div>

      {/* Desktop fixed/sticky sidebar */}
      <aside
        className={cn(
          'hidden lg:sticky lg:top-0 lg:flex lg:flex-col lg:h-screen lg:border-r lg:border-gray-800 lg:bg-gray-950 lg:transition-all lg:duration-300',
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-8 z-10 p-1.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-emerald-400 shadow-md transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {sidebarContent}
      </aside>
    </>
  );
}

// ─── Sidebar Link ────────────────────────────────────────────────
interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeColor?: string;
  className?: string;
  isCollapsed: boolean;
}

function SidebarLink({
  to,
  icon,
  label,
  badge,
  badgeColor = 'bg-red-600',
  className = '',
  isCollapsed,
}: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
          isActive
            ? 'bg-emerald-950/40 text-emerald-400'
            : 'text-gray-300 hover:bg-gray-800/70 hover:text-emerald-300',
          isCollapsed && 'justify-center px-2',
          className
        )
      }
      title={isCollapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>

      {!isCollapsed && <span className="ml-3 truncate">{label}</span>}

      {badge !== undefined && badge > 0 && (
        <span
          className={cn(
            'flex items-center justify-center font-bold text-white shadow-sm',
            isCollapsed
              ? 'absolute -top-1 right-0 min-w-[18px] h-4.5 text-[10px] rounded-full px-1'
              : 'absolute right-3 top-1/2 -translate-y-1/2 min-w-[20px] h-5 text-xs rounded-full px-1.5',
            badgeColor
          )}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
}

// ─── Accordion Trigger ───────────────────────────────────────────
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <Accordion.Header>
    <Accordion.Trigger
      ref={ref}
      className={cn(
        'group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-800/70 hover:text-emerald-300',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="ml-auto h-4 w-4 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </Accordion.Trigger>
  </Accordion.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

// ─── Accordion Content ───────────────────────────────────────────
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ className, children, ...props }, ref) => (
  <Accordion.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    {children}
  </Accordion.Content>
));
AccordionContent.displayName = 'AccordionContent';