// src/pages/AnalyticsDashboard.tsx
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  AlertTriangle,
  Calendar,
  Download,
  PieChart as PieIcon,
  ShoppingCart,
  PiggyBank,
  TrendingDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

// ────────────────────────────────────────────────────────────────
// Mock data generators (role-aware)
// ────────────────────────────────────────────────────────────────
const generateStats = (role: string) => {
  if (role === "farmer") {
    return [
      { icon: DollarSign, label: "Monthly Revenue", value: "MWK 145,000", change: "+18%", trend: "up", color: "text-emerald-600" },
      { icon: Package, label: "Products Sold", value: "285 kg", change: "+12%", trend: "up", color: "text-blue-600" },
      { icon: Users, label: "Active Buyers", value: "34", change: "+25%", trend: "up", color: "text-purple-600" },
      { icon: TrendingUp, label: "Price Premium", value: "28%", change: "-4%", trend: "down", color: "text-amber-600" },
    ];
  }
  return [
    { icon: ShoppingCart, label: "Total Spent", value: "MWK 320,000", change: "+22%", trend: "up", color: "text-emerald-600" },
    { icon: PiggyBank, label: "Savings vs Middlemen", value: "MWK 85,000", change: "+15%", trend: "up", color: "text-green-600" },
    { icon: Package, label: "Items Purchased", value: "18 orders", change: "+30%", trend: "up", color: "text-blue-600" },
    { icon: TrendingDown, label: "Avg. Price Reduction", value: "19%", change: "+7%", trend: "up", color: "text-teal-600" },
  ];
};

const generateTimeSeriesData = (range: string, role: string) => {
  const base = range === "weekly" ? 7 : range === "monthly" ? 6 : 3;
  const data = [];
  for (let i = 0; i < base; i++) {
    const name = range === "weekly" ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] :
                 range === "monthly" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i] :
                 ["2023", "2024", "2025"][i];

    if (role === "farmer") {
      data.push({
        name,
        revenue: Math.floor(Math.random() * 80000) + 30000,
        sales: Math.floor(Math.random() * 50000) + 10000,
      });
    } else {
      data.push({
        name,
        spent: Math.floor(Math.random() * 120000) + 40000,
        saved: Math.floor(Math.random() * 50000) + 15000,
      });
    }
  }
  return data;
};

const generatePieData = (role: string) => {
  if (role === "farmer") {
    return [
      { name: "Maize", value: 420000, color: "#10B981" },
      { name: "Groundnuts", value: 180000, color: "#3B82F6" },
      { name: "Tomatoes", value: 95000, color: "#F59E0B" },
      { name: "Soybeans", value: 150000, color: "#8B5CF6" },
    ];
  }
  return [
    { name: "Maize", value: 120000, color: "#10B981" },
    { name: "Vegetables", value: 85000, color: "#EF4444" },
    { name: "Legumes", value: 65000, color: "#8B5CF6" },
    { name: "Other", value: 50000, color: "#6B7280" },
  ];
};

const marketInsightsFarmer = [
  { label: "Maize demand (Lilongwe)", value: "+32%", color: "text-green-600" },
  { label: "Tomato prices (Blantyre)", value: "-8%", color: "text-red-600" },
  { label: "Soybean export interest", value: "+45%", color: "text-purple-600" },
];

const marketInsightsBuyer = [
  { label: "Best maize prices this month", value: "MWK 26,500/bag", color: "text-green-600" },
  { label: "Groundnuts availability up", value: "+40%", color: "text-blue-600" },
  { label: "Avg. savings on direct buy", value: "22%", color: "text-emerald-600" },
];

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const role = user?.user_type || "farmer"; // fallback for preview

  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Generate data once per timeRange change
  const timeSeriesData = useMemo(
    () => generateTimeSeriesData(timeRange, role),
    [timeRange, role]
  );

  const pieData = useMemo(() => generatePieData(role), [role]);
  const stats = useMemo(() => generateStats(role), [role]);
  const insights = role === "farmer" ? marketInsightsFarmer : marketInsightsBuyer;

  // Calculate totals safely
  const totalMain = timeSeriesData.reduce((sum, d) => sum + (d.revenue || d.spent || 0), 0);
  const totalVolume = timeSeriesData.reduce((sum, d) => sum + (d.sales || d.saved || 0), 0);

  // CSV Export
  const exportToCSV = () => {
    const headers = ["Period", role === "farmer" ? "Revenue (MWK)" : "Spent (MWK)", role === "farmer" ? "Sales (kg)" : "Saved (MWK)"];
    const rows = timeSeriesData.map(d => [
      d.name,
      role === "farmer" ? d.revenue : d.spent,
      role === "farmer" ? d.sales : d.saved,
    ]);

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `mlimi-analytics-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-full">
              <BarChart3 className="text-green-600 dark:text-green-500" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {role === "farmer" ? "Farmer Analytics" : "Buyer Insights"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {role === "farmer"
                  ? "Track your sales, revenue, and market trends"
                  : "See your spending, savings, and best deals"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
              {(["weekly", "monthly", "yearly"] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="capitalize"
                >
                  {range}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCSV}
              className="flex items-center gap-2 shadow-sm"
            >
              <Download size={16} /> Export CSV
            </Button>
          </div>
        </div>

        {/* Custom Date Range */}
        <Card className="p-5 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Range:</span>
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-green-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-green-500"
            />
            <Button variant="outline" size="sm" disabled={!startDate || !endDate}>
              Apply
            </Button>
          </div>
        </Card>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <stat.icon className={`${stat.color} h-8 w-8`} />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"} flex items-center gap-1`}>
                      {stat.change}
                      {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts - Always render, but show placeholder if no data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Revenue / Spending Line Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {role === "farmer" ? "Revenue Over Time" : "Spending Over Time"}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                MWK {totalMain.toLocaleString()}
              </span>
            </div>
            <div className="h-80">
              {timeSeriesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData} key={timeRange}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={role === "farmer" ? "revenue" : "spent"}
                      stroke={role === "farmer" ? "#10B981" : "#3B82F6"}
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No data available for this range
                </div>
              )}
            </div>
          </Card>

          {/* Volume / Saved Bar Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {role === "farmer" ? "Sales Volume (kg)" : "Savings Over Time"}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {role === "farmer" ? `${totalVolume.toLocaleString()} kg` : `MWK ${totalVolume.toLocaleString()}`}
              </span>
            </div>
            <div className="h-80">
              {timeSeriesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeSeriesData} key={timeRange}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Bar
                      dataKey={role === "farmer" ? "sales" : "saved"}
                      fill={role === "farmer" ? "#3B82F6" : "#10B981"}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No data available for this range
                </div>
              )}
            </div>
          </Card>

          {/* Pie Chart - Product / Category Breakdown */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {role === "farmer" ? "Revenue by Product" : "Spending by Category"}
              </h3>
            </div>
            <div className="h-80">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#F3F4F6",
                      }}
                    />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                  No product data available
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Insights & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-green-600" size={22} />
              Market Insights
            </h3>
            <div className="space-y-4">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <span className="text-gray-700 dark:text-gray-300">{insight.label}</span>
                  <span className={`font-bold ${insight.color}`}>{insight.value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-amber-600" size={22} />
              {role === "farmer" ? "Alerts & Opportunities" : "Savings Tips & Recommendations"}
            </h3>
            <div className="space-y-4">
              {role === "farmer" ? (
                <>
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="font-medium text-amber-800 dark:text-amber-300">
                      Low stock: Tomatoes (only 3 crates left)
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                      Consider increasing production next cycle.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-300">
                      Maize price up 15% in your region
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Opportunity: List more maize this week.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                    <p className="font-medium text-green-800 dark:text-green-300">
                      You saved MWK 85,000 by buying direct
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Great job avoiding middlemen fees!
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-medium text-blue-800 dark:text-blue-300">
                      Bulk buy discount available on soybeans
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Next order over 100kg gets 10% off.
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}