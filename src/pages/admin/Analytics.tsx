// src/pages/admin/Analytics.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  DollarSign,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const mockStats = [
  { icon: DollarSign, label: "Total Revenue", value: "MWK 12.8M", change: "+22%", trend: "up" },
  { icon: Users, label: "Registered Users", value: "2,341", change: "+14%", trend: "up" },
  { icon: Package, label: "Active Listings", value: "4,892", change: "+9%", trend: "up" },
  { icon: ShoppingCart, label: "Orders Completed", value: "1,673", change: "-3%", trend: "down" },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-green-600" size={32} />
            Platform Analytics
          </h1>

          <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 shadow-sm">
            {(["week", "month", "year"] as const).map((range) => (
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
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {mockStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className={`${stat.trend === "up" ? "text-green-600" : "text-red-600"} p-3 rounded-lg bg-opacity-10 bg-current`}>
                    <stat.icon size={28} />
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium flex items-center gap-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                      {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Placeholder for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Revenue Trend</h3>
            <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
              [Revenue Line Chart Placeholder]
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Top Categories</h3>
            <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
              [Pie Chart / Bar Chart Placeholder]
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}