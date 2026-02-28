// src/pages/admin/DashboardHome.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  LayoutDashboard,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const stats = [
  { icon: Users, label: "Total Users", value: "1,842", change: "+12%", color: "text-blue-600" },
  { icon: Package, label: "Active Listings", value: "3,674", change: "+8%", color: "text-green-600" },
  { icon: DollarSign, label: "Platform Revenue", value: "MWK 8.4M", change: "+19%", color: "text-emerald-600" },
  { icon: AlertTriangle, label: "Pending Disputes", value: "7", change: "+2", color: "text-amber-600" },
];

export default function DashboardHome() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <LayoutDashboard className="text-green-600" size={32} />
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className={`${stat.color} bg-opacity-10 bg-current p-3 rounded-lg`}>
                    <stat.icon size={28} />
                  </div>
                  <span className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="text-amber-600" /> Pending Actions
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between">
                <span>Product Approvals</span>
                <span className="font-medium">12</span>
              </li>
              <li className="flex justify-between">
                <span>Disputes</span>
                <span className="font-medium text-amber-600">7</span>
              </li>
              <li className="flex justify-between">
                <span>Buyer Verifications</span>
                <span className="font-medium">5</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4 text-sm">
              {[
                { time: "10 min ago", text: "New dispute filed on Order #4789" },
                { time: "45 min ago", text: "Product 'Fresh Tomatoes' approved" },
                { time: "2 hrs ago", text: "User 'Alick Mwale' registered as buyer" },
                { time: "Yesterday", text: "Revenue reached MWK 8.4M this month" },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{item.text}</span>
                  <span className="text-xs">{item.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}