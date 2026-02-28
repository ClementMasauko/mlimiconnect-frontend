// src/pages/admin/Revenue.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Package,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const monthlyRevenueData = [
  { month: "Jan", revenue: 5200000, transactions: 842 },
  { month: "Feb", revenue: 6800000, transactions: 1023 },
  { month: "Mar", revenue: 7400000, transactions: 1156 },
  { month: "Apr", revenue: 8200000, transactions: 1289 },
  { month: "May", revenue: 9100000, transactions: 1421 },
  { month: "Jun", revenue: 10500000, transactions: 1654 },
];

const categoryBreakdown = [
  { category: "Maize", revenue: 4200000, percentage: 40 },
  { category: "Vegetables", revenue: 2800000, percentage: 27 },
  { category: "Legumes", revenue: 2100000, percentage: 20 },
  { category: "Other Crops", revenue: 1360000, percentage: 13 },
];

export default function Revenue() {
  const [dateRange, setDateRange] = useState("6months");
  const currentRevenue = 10500000;
  const previousRevenue = 9100000;
  const growth = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <DollarSign className="text-emerald-600" size={32} />
              Revenue Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Track platform earnings, transaction volume, and growth trends
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              Filter
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue (MTD)</p>
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              MWK {currentRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <ArrowUpRight size={16} />
              +{growth}% from last month
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
              <Package className="text-blue-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">1,654</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
              +16.4% from last month
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
              <DollarSign className="text-purple-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">MWK 6,348</p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
              +8.2% from last month
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Commission Earned</p>
              <Percent className="text-amber-600" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              MWK {Math.round(currentRevenue * 0.035).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              At 3.5% rate
            </p>
          </Card>
        </div>

        {/* Revenue Trend Chart */}
        <Card className="p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Revenue Trend</h2>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="6months">Last 6 months</option>
              <option value="12months">Last 12 months</option>
              <option value="year">This year</option>
            </select>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" tickFormatter={(v) => `MWK ${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                  formatter={(value: number) => [`MWK ${value.toLocaleString()}`, "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Revenue by Category</h2>
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-600" />
                    <span className="font-medium">{cat.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">MWK {cat.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{cat.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Transaction Volume</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Bar dataKey="transactions" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}