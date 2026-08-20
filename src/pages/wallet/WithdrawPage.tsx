import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowDownToLine, AlertTriangle } from "lucide-react";
import api from "../../lib/api";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("airtel");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      await api.post("/api/wallet/withdrawals/", { amount: Number(amount), provider, phone });
      setStatus("Withdrawal request submitted successfully.");
      setAmount("");
      setPhone("");
    } catch {
      setStatus("We could not submit your withdrawal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            to="/app/wallet"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← Back to Wallet
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ArrowDownToLine className="text-green-600" size={32} /> Withdraw
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Transfer earnings to your mobile money account
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex items-start gap-3 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg">
            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Withdrawals processed within 24-48 hours. Min: MWK 1,000. Fee: ~1.5%.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {status && <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/30 dark:text-green-300">{status}</p>}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Amount (MWK)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                min="1000"
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Available: MWK 1,250,000
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mobile Money Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="airtel">Airtel Money</option>
                <option value="tnm">TNM Mpamba</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0999 123 456"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <Button variant="primary" size="lg" className="w-full py-6 text-lg" disabled={submitting}>
              {submitting ? "Submitting..." : "Request Withdrawal"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
