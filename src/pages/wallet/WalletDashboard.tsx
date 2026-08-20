import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  DollarSign,
  TrendingUp,
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
];

export default function WalletDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link
            to="/app/dashboard"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Wallet className="text-green-600" size={32} /> My Wallet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your earnings, escrow balance and transactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 text-center">
              <DollarSign className="mx-auto text-green-600 mb-3" size={32} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-400 mt-1">
                MWK {mockBalance.available.toLocaleString()}
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-6 text-center">
              <Clock className="mx-auto text-amber-600 mb-3" size={32} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending (Escrow)</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">
                MWK {mockBalance.pendingEscrow.toLocaleString()}
              </p>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6 text-center">
              <TrendingUp className="mx-auto text-blue-600 mb-3" size={32} />
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Earned</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-400 mt-1">
                MWK {mockBalance.totalEarned.toLocaleString()}
              </p>
            </Card>
          </motion.div>
        </div>

        <Card className="p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <ArrowUpRight className="text-green-600" size={24} /> Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="primary" className="flex items-center justify-center gap-2 py-6 text-lg" asChild>
              <Link to="/app/wallet/withdraw"><ArrowDownLeft size={20} /> Withdraw Funds</Link>
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2 py-6 text-lg" asChild>
              <Link to="/app/profile/address-book"><DollarSign size={20} /> View Payment Methods</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{tx.desc}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-lg ${
                      tx.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}MWK {Math.abs(tx.amount).toLocaleString()}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      tx.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >

                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
