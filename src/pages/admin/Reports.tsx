// src/pages/admin/Reports.tsx
import React from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Download, FileText, BarChart3, TrendingUp } from "lucide-react";

const reportTypes = [
  { title: "Monthly Sales Report", desc: "Revenue, top products, order volume", date: "Feb 2026" },
  { title: "User Growth Report", desc: "New registrations, retention rate", date: "Last 90 days" },
  { title: "Product Performance", desc: "Most sold items, average price", date: "This month" },
  { title: "Dispute Summary", desc: "Resolved vs pending, common reasons", date: "Last 30 days" },
];

export default function Reports() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <FileText className="text-green-600" size={32} />
          Reports & Exports
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportTypes.map((report, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <BarChart3 className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{report.desc}</p>
                    <p className="text-xs text-gray-500 mt-2">Period: {report.date}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download size={16} />
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary Card */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600" size={22} />
            Platform Snapshot
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-500">MWK 12.8M</p>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold">1,673</p>
              <p className="text-sm text-gray-500">Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold">4,892</p>
              <p className="text-sm text-gray-500">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">7</p>
              <p className="text-sm text-gray-500">Active Disputes</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}