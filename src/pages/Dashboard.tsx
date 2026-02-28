// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Leaf,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Heart,
  PlusCircle,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

// Mock stats
const mockStats = {
  activeListings: 12,
  totalProducts: 45,
  totalOrders: 28,
  totalRevenue: 1450000, // MWK
  pendingOrders: 5,
  unreadMessages: 3,
  savedItems: 18,
};

// Mock recent activity (orders, sales, messages)
const mockRecentActivity = [
  {
    id: 1,
    type: "order",
    title: "Order #ORD-4782",
    description: "Maize (50kg) sold to Blantyre Buyer",
    amount: "MWK 185,000",
    status: "completed",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "message",
    title: "New message from Buyer A",
    description: "Interested in your tomatoes — can you deliver to Lilongwe?",
    status: "unread",
    time: "45 minutes ago",
    icon: MessageCircle,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "sale",
    title: "Tomatoes (20kg) sold",
    description: "Sold to Zomba Restaurant",
    amount: "MWK 95,000",
    status: "pending payment",
    time: "Today, 11:20 AM",
    icon: DollarSign,
    color: "text-emerald-600",
  },
  {
    id: 4,
    type: "delivery",
    title: "Order #ORD-4781 in transit",
    description: "Soybeans (100kg) to Mzuzu",
    status: "in transit",
    time: "Yesterday",
    icon: Truck,
    color: "text-purple-600",
  },
  {
    id: 5,
    type: "message",
    title: "Reply from Expert Advisor",
    description: "Pest detection results: moderate aphid risk — recommendations sent",
    time: "2 days ago",
    icon: MessageCircle,
    color: "text-gray-600 dark:text-gray-400",
  },
];

interface DashboardStats {
  activeListings?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  unreadMessages?: number;
  savedItems?: number;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();

  const [stats] = useState<DashboardStats>(mockStats);
  const [recentActivity] = useState(mockRecentActivity);
  const [loading] = useState(false); // mock — no real loading

  const isFarmer = user?.user_type === "farmer" || true; // force farmer view in preview

  // ────────────────────────────────────────────────────────────────
  // COMMENTED OUT — no "Please sign in" screen
  // ────────────────────────────────────────────────────────────────
  /*
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Please sign in
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to access your dashboard.
          </p>
          <Button onClick={() => navigate("/login")} variant="primary" size="lg">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }
  */

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Welcome Section */}
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
              <Leaf className="text-green-600 dark:text-green-500" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {user ? `Welcome back, ${user.username}` : "Dashboard Preview (Mock Data)"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isFarmer
                  ? "Manage your farm produce and track sales"
                  : "Discover fresh produce and manage your purchases"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
          <StatCard
            icon={<Package size={24} />}
            title={isFarmer ? "Active Listings" : "Viewed Products"}
            value={stats.activeListings ?? stats.totalProducts ?? "—"}
            color="green"
          />

          <StatCard
            icon={<ShoppingBag size={24} />}
            title={isFarmer ? "Total Orders" : "Orders Placed"}
            value={stats.totalOrders ?? "—"}
            color="blue"
          />

          <StatCard
            icon={<DollarSign size={24} />}
            title={isFarmer ? "Total Revenue" : "Total Spent"}
            value={
              stats.totalRevenue !== undefined
                ? `MWK ${Number(stats.totalRevenue).toLocaleString()}`
                : "—"
            }
            color="emerald"
            highlight
          />

          <StatCard
            icon={<TrendingUp size={24} />}
            title="Pending / New"
            value={stats.pendingOrders ?? 0}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <Card className="mb-10">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2.5">
            <PlusCircle className="text-green-600 dark:text-green-500" size={22} />
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isFarmer || !user ? (
              <>
                <QuickAction
                  to="/app/listings/new"
                  label="Add New Product"
                  icon={Package}
                  primary
                />
                <QuickAction
                  to="/app/orders"
                  label="View Orders"
                  icon={ShoppingBag}
                />
                <QuickAction
                  to="/app/advisory"
                  label="Crop Advisory"
                  icon={Leaf}
                />
                <QuickAction
                  to="/app/messages"
                  label="Messages"
                  icon={MessageCircle}
                  badge={stats.unreadMessages}
                />
              </>
            ) : (
              <>
                <QuickAction
                  to="/marketplace"
                  label="Browse Marketplace"
                  icon={ShoppingBag}
                  primary
                />
                <QuickAction
                  to="/dashboard/orders"
                  label="My Orders"
                  icon={Package}
                />
                <QuickAction
                  to="/favorites"
                  label="Favorites"
                  icon={Heart}
                />
              </>
            )}
          </div>
        </Card>

        {/* Recent Activity – now with mock data */}
        <Card>
          <h2 className="text-xl font-semibold mb-5 flex items-center gap-2.5">
            <Clock className="text-gray-600 dark:text-gray-400" size={22} />
            Recent Activity
          </h2>

          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className={`p-3 rounded-full ${item.color} bg-opacity-10 bg-current`}>
                  <item.icon size={20} />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  {item.amount && (
                    <p className="mt-1 text-sm font-medium text-green-700 dark:text-green-500">
                      {item.amount}
                    </p>
                  )}

                  {item.status && (
                    <span
                      className={`inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-full ${
                        item.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : item.status === "unread"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : item.status === "in transit"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/activity"
              className="text-green-600 dark:text-green-500 hover:underline text-sm font-medium inline-flex items-center gap-1.5"
            >
              View all activity <ArrowRight size={14} />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Reusable components (unchanged) ─────────────────────────────────────────────

type StatColor = "green" | "blue" | "emerald" | "purple";

function StatCard({
  icon,
  title,
  value,
  color = "green",
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color?: StatColor;
  highlight?: boolean;
}) {
  const colorClasses = {
    green: "text-green-600 dark:text-green-500",
    blue: "text-blue-600 dark:text-blue-500",
    emerald: "text-emerald-600 dark:text-emerald-500",
    purple: "text-purple-600 dark:text-purple-500",
  };

  return (
    <Card className="p-6 text-center transition-all hover:shadow-md">
      <div className={`mb-4 ${colorClasses[color]} opacity-90`}>{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
      <p
        className={`text-2xl md:text-3xl font-bold ${
          highlight
            ? "text-emerald-700 dark:text-emerald-500"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}

function QuickAction({
  to,
  label,
  icon: Icon,
  primary = false,
  badge,
}: {
  to: string;
  label: string;
  icon: any;
  primary?: boolean;
  badge?: number;
}) {
  return (
    <Link to={to}>
      <Button
        variant={primary ? "primary" : "outline"}
        size="lg"
        className={`w-full justify-start text-left group hover:scale-[1.02] transition-transform ${
          primary ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon size={20} className={primary ? "" : "text-gray-600 dark:text-gray-400"} />
          <span className="flex-1 font-medium">{label}</span>

          {badge !== undefined && badge > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}

          <ArrowRight
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </Button>
    </Link>
  );
}






























{/*
  original file: frontend/src/pages/Dashboard.tsx
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Package,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  MessageCircle,
  Heart,
  PlusCircle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface DashboardStats {
  activeListings?: number;
  totalProducts?: number;
  totalOrders?: number;
  totalRevenue?: number;
  pendingOrders?: number;
  unreadMessages?: number;
  savedItems?: number;
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isFarmer = user?.user_type === "farmer";
  const isBuyer = user?.user_type === "buyer";

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // You can create role-specific endpoints or use one with conditional response
        const endpoint = isFarmer
          ? "/api/analytics/farmer/summary/"
          : "/api/analytics/buyer/summary/";

        const res = await api.get(endpoint);
        setStats(res.data || {});
      } catch (err: any) {
        console.error("Dashboard data fetch failed:", err);
        setError("Could not load your dashboard data right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isFarmer]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <Card className="max-w-md w-full text-center p-8">
          <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Please sign in
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to access your dashboard.
          </p>
          <Button onClick={() => navigate("/login")} variant="primary" size="lg">
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Welcome Section {/*
        <div className="mb-8 md:mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
              <Leaf className="text-green-600 dark:text-green-500" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {isFarmer
                  ? "Manage your farm produce and track sales"
                  : "Discover fresh produce and manage your purchases"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
              <StatCard
                icon={<Package size={24} />}
                title={isFarmer ? "Active Listings" : "Viewed Products"}
                value={stats?.activeListings ?? stats?.totalProducts ?? "—"}
                color="green"
              />

              <StatCard
                icon={<ShoppingBag size={24} />}
                title={isFarmer ? "Total Orders" : "Orders Placed"}
                value={stats?.totalOrders ?? "—"}
                color="blue"
              />

              <StatCard
                icon={<DollarSign size={24} />}
                title={isFarmer ? "Total Revenue" : "Total Spent"}
                value={
                  stats?.totalRevenue !== undefined
                    ? `MWK ${Number(stats.totalRevenue).toLocaleString()}`
                    : "—"
                }
                color="emerald"
                highlight
              />

              <StatCard
                icon={<TrendingUp size={24} />}
                title="Pending / New"
                value={stats?.pendingOrders ?? 0}
                color="purple"
              />
            </div>

            {/* Quick Actions 
            <Card className="mb-10">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2.5">
                <PlusCircle className="text-green-600 dark:text-green-500" size={22} />
                Quick Actions
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isFarmer ? (
                  <>
                    <QuickAction
                      to="/listings/new"
                      label="Add New Product"
                      icon={Package}
                      primary
                    />
                    <QuickAction
                      to="/dashboard/orders"
                      label="View Orders"
                      icon={ShoppingBag}
                    />
                    <QuickAction
                      to="/advisory"
                      label="Crop Advisory"
                      icon={Leaf}
                    />
                    <QuickAction
                      to="/messages"
                      label="Messages"
                      icon={MessageCircle}
                      badge={stats?.unreadMessages}
                    />
                  </>
                ) : (
                  <>
                    <QuickAction
                      to="/marketplace"
                      label="Browse Marketplace"
                      icon={ShoppingBag}
                      primary
                    />
                    <QuickAction
                      to="/dashboard/orders"
                      label="My Orders"
                      icon={Package}
                    />
                    <QuickAction
                      to="/favorites"
                      label="Favorites"
                      icon={Heart}
                    />
                  </>
                )}
              </div>
            </Card>

            {/* Placeholder for future content *
            <Card>
              <h2 className="text-xl font-semibold mb-5">
                Recent Activity
              </h2>
              <div className="h-64 bg-gray-100 dark:bg-gray-800/50 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-center px-6">
                  Recent orders, sales and messages will appear here soon...
                </p>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// ── Reusable sub-components ─────────────────────────────────────────────

type StatColor = "green" | "blue" | "emerald" | "purple";

function StatCard({
  icon,
  title,
  value,
  color = "green",
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color?: StatColor;
  highlight?: boolean;
}) {
  const colorClasses = {
    green: "text-green-600 dark:text-green-500",
    blue: "text-blue-600 dark:text-blue-500",
    emerald: "text-emerald-600 dark:text-emerald-500",
    purple: "text-purple-600 dark:text-purple-500",
  };

  return (
    <Card className="p-6 text-center transition-all hover:shadow-md">
      <div className={`mb-4 ${colorClasses[color]} opacity-90`}>{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
      <p
        className={`text-2xl md:text-3xl font-bold ${
          highlight
            ? "text-emerald-700 dark:text-emerald-500"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </p>
    </Card>
  );
}

function QuickAction({
  to,
  label,
  icon: Icon,
  primary = false,
  badge,
}: {
  to: string;
  label: string;
  icon: any;
  primary?: boolean;
  badge?: number;
}) {
  return (
    <Link to={to}>
      <Button
        variant={primary ? "primary" : "outline"}
        size="lg"
        className={`w-full justify-start text-left group hover:scale-[1.02] transition-transform ${
          primary ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon size={20} className={primary ? "" : "text-gray-600 dark:text-gray-400"} />
          <span className="flex-1 font-medium">{label}</span>

          {badge !== undefined && badge > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}

          <ArrowRight
            size={16}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </Button>
    </Link>
  );
}
  */}