// src/pages/wallet/Invoices.tsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FileText, Download, Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

const mockInvoices = [
  {
    id: "INV-20260215-001",
    date: "Feb 15, 2026",
    type: "Sale",
    amount: 450000,
    fee: 13500,
    net: 436500,
    desc: "Maize - 50kg × 10 bags to Shoprite Lilongwe",
    status: "paid",
    pdfUrl: "#", // in real app: actual download link
  },
  {
    id: "INV-20260210-002",
    date: "Feb 10, 2026",
    type: "Withdrawal",
    amount: -800000,
    fee: 12000,
    net: -788000,
    desc: "Withdrawal to Airtel Money ****1234",
    status: "completed",
    pdfUrl: "#",
  },
  {
    id: "INV-20260205-003",
    date: "Feb 5, 2026",
    type: "Sale",
    amount: 620000,
    fee: 18600,
    net: 601400,
    desc: "Tomatoes - 120kg (escrow released)",
    status: "paid",
    pdfUrl: "#",
  },
  {
    id: "INV-20260128-004",
    date: "Jan 28, 2026",
    type: "Commission",
    amount: -18000,
    fee: 0,
    net: -18000,
    desc: "Platform commission (3%) on sale INV-20260205-003",
    status: "deducted",
    pdfUrl: "#",
  },
];

export default function Invoices() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <Link
            to="/app/wallet"
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2 mb-4 font-medium"
          >
            ← Back to Wallet
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FileText className="text-emerald-600" size={36} />
            Invoices & Receipts
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Download receipts for sales, withdrawals, fees, and commissions
          </p>
        </div>

        <Card className="p-0 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Invoice ID / Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type / Description</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Amount (MWK)</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-medium text-gray-900 dark:text-white">{inv.id}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {inv.date}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium">{inv.type}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{inv.desc}</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className={`font-bold text-lg ${inv.amount > 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {inv.amount > 0 ? "+" : ""}{inv.amount.toLocaleString()}
                      </div>
                      {inv.fee !== 0 && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Fee: {inv.fee.toLocaleString()} • Net: {inv.net.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          inv.status === "paid" || inv.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                        <Download size={16} className="mr-1" /> Download PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mockInvoices.length === 0 && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <AlertCircle className="mx-auto h-12 w-12 mb-4" />
              <p>No invoices or receipts yet.</p>
            </div>
          )}
        </Card>

        <div className="mt-10 text-center">
          <Button variant="primary" size="lg" asChild>
            <Link to="/app/wallet">Back to Wallet</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}