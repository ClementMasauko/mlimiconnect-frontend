// src/pages/wallet/WalletDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  FileText,
  Smartphone,
} from "lucide-react";

const mockBalance = {
  available: 1250000,
  pendingEscrow: 340000,
  totalEarned: 2895000,
  currency: "MWK",
};

const mockTransactions = [
  { id: "tx1", date: "2026-02-10", type: "sale", amount: 450000, status: "completed", desc: "Maize - 50kg to Shoprite Lilongwe" },
  { id: "tx2", date: "2026-02-08", type: "withdrawal", amount: -800000, status: "completed", desc: "To Airtel Money ****1234" },
  { id: "tx3", date: "2026-02-05", type: "sale", amount: 620000, status: "pending", desc: "Tomatoes - 120kg (escrow)" },
  { id: "tx4", date: "2026-02-01", type: "fee", amount: -18000, status: "completed", desc: "Platform fee (3%)" },
  { id: "tx5", date: "2026-01-28", type: "sale", amount: 320000, status: "completed", desc: "Groundnuts - 40kg" },
];

export default function WalletDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Wallet className="text-emerald-600" size={36} /> My Wallet
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Manage your earnings, escrow balance, and transaction history
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 text-center hover:shadow-xl transition-shadow">
            <DollarSign className="mx-auto text-emerald-600 mb-4" size={40} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Available Balance</p>
            <p className="text-4xl md:text-5xl font-extrabold text-emerald-700 dark:text-emerald-400">
              MWK {mockBalance.available.toLocaleString()}
            </p>
            <Link to="/app/wallet/withdraw">
              <Button variant="outline" size="sm" className="mt-6">
                Withdraw Funds
              </Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-shadow">
            <Clock className="mx-auto text-amber-600 mb-4" size={40} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending (Escrow)</p>
            <p className="text-4xl md:text-5xl font-extrabold text-amber-600">
              MWK {mockBalance.pendingEscrow.toLocaleString()}
            </p>
          </Card>

          <Card className="p-8 text-center hover:shadow-xl transition-shadow">
            <TrendingUp className="mx-auto text-blue-600 mb-4" size={40} />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Earned</p>
            <p className="text-4xl md:text-5xl font-extrabold text-blue-700 dark:text-blue-400">
              MWK {mockBalance.totalEarned.toLocaleString()}
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <ArrowUpRight className="text-emerald-600" size={24} /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/app/wallet/withdraw">
              <Button variant="primary" className="w-full py-6 text-lg flex items-center justify-center gap-2">
                <ArrowDownLeft size={20} /> Withdraw Funds
              </Button>
            </Link>

            <Link to="/app/wallet/deposit">
  <Button variant="primary" className="w-full py-6 text-lg flex items-center justify-center gap-2">
    <ArrowUpRight size={20} /> Deposit Funds
  </Button>
</Link>

<Link to="/app/wallet/payment-methods">
  <Button variant="outline" className="w-full py-6 text-lg flex items-center justify-center gap-2">
    <Smartphone size={20} /> Payment Methods
  </Button>
</Link>

            <Link to="/app/wallet/withdraw-history">
  <Button variant="outline" className="w-full py-6 text-lg flex items-center justify-center gap-2">
    <Clock size={20} /> Withdrawal History
  </Button>
</Link>

<Link to="/app/wallet/invoices">
  <Button variant="outline" className="w-full py-6 text-lg flex items-center justify-center gap-2">
    <FileText size={20} /> Invoices & Receipts
  </Button>
</Link>
            <Button variant="outline" className="w-full py-6 text-lg flex items-center justify-center gap-2">
              <ArrowUpRight size={20} /> Deposit Funds
            </Button>
            <Button variant="outline" className="w-full py-6 text-lg flex items-center justify-center gap-2">
              <DollarSign size={20} /> View Payment Methods
            </Button>
          </div>
        </Card>

        {/* Transactions */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <ArrowUpRight className="text-emerald-600" size={24} /> Recent Transactions
          </h2>

          {mockTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <AlertCircle className="mx-auto h-12 w-12 mb-4" />
              <p>No transactions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="mb-3 sm:mb-0">
                    <p className="font-medium text-gray-900 dark:text-white">{tx.desc}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-xl ${
                        tx.amount > 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}MWK {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <span
                      className={`inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}