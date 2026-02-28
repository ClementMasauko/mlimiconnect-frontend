// src/pages/wallet/WithdrawHistory.tsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowDownToLine, CheckCircle, Clock, XCircle, Download, Calendar, AlertCircle } from "lucide-react";

const mockWithdrawals = [
  {
    id: "WD-20260215-001",
    date: "Feb 15, 2026",
    amount: 450000,
    fee: 6750,
    netAmount: 443250,
    provider: "Airtel Money",
    phone: "0999 123 456",
    status: "completed",
    reference: "TXN-987654321",
  },
  {
    id: "WD-20260210-002",
    date: "Feb 10, 2026",
    amount: 800000,
    fee: 12000,
    netAmount: 788000,
    provider: "TNM Mpamba",
    phone: "0888 654 321",
    status: "pending",
    reference: "TXN-123456789",
  },
  {
    id: "WD-20260205-003",
    date: "Feb 5, 2026",
    amount: 1200000,
    fee: 18000,
    netAmount: 1182000,
    provider: "Airtel Money",
    phone: "0999 123 456",
    status: "failed",
    reference: "TXN-456789123",
    reason: "Invalid phone number",
  },
  {
    id: "WD-20260128-004",
    date: "Jan 28, 2026",
    amount: 320000,
    fee: 4800,
    netAmount: 315200,
    provider: "TNM Mpamba",
    phone: "0888 654 321",
    status: "completed",
    reference: "TXN-789123456",
  },
];

export default function WithdrawHistory() {
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
            <ArrowDownToLine className="text-emerald-600" size={36} />
            Withdrawal History
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            View all your withdrawal requests and their status
          </p>
        </div>

        <Card className="p-0 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">ID / Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Provider / Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {mockWithdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="font-medium text-gray-900 dark:text-white">{wd.id}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar size={14} />
                        {wd.date}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-bold text-lg">
                        MWK {wd.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Net: MWK {wd.netAmount.toLocaleString()} (Fee: {wd.fee.toLocaleString()})
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium">{wd.provider}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{wd.phone}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                          wd.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : wd.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {wd.status.charAt(0).toUpperCase() + wd.status.slice(1)}
                      </span>
                      {wd.reason && (
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1">{wd.reason}</p>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      {wd.status === "completed" && (
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700">
                          <Download size={16} className="mr-1" /> Receipt
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mockWithdrawals.length === 0 && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <AlertCircle className="mx-auto h-12 w-12 mb-4" />
              <p>No withdrawal history yet.</p>
            </div>
          )}
        </Card>

        <div className="mt-10 text-center">
          <Button variant="primary" size="lg" asChild>
            <Link to="/app/wallet/withdraw">Make a New Withdrawal</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}