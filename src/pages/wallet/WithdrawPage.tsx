// src/pages/wallet/WithdrawPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowDownToLine, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("airtel");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableBalance = 1250000; // Mock – pull from real wallet context later
  const minWithdraw = 1000;
  const feePercent = 1.5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount < minWithdraw) {
      setError(`Minimum withdrawal is MWK ${minWithdraw.toLocaleString()}`);
      return;
    }
    if (withdrawAmount > availableBalance) {
      setError("Amount exceeds available balance");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1800));

    setLoading(false);
    setSuccess(true);
    setAmount("");
    setPhone("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="mb-10">
          <Link
            to="/app/wallet"
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2 mb-4 font-medium"
          >
            ← Back to Wallet
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ArrowDownToLine className="text-emerald-600" size={36} />
            Withdraw Funds
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Transfer your earnings to Airtel Money or TNM Mpamba
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Withdrawal Requested!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your request for MWK {parseFloat(amount).toLocaleString()} has been submitted. Funds will arrive in 24–48 hours.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/app/wallet">Back to Wallet</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Available Balance */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Available Balance</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  MWK {availableBalance.toLocaleString()}
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Withdraw (MWK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  min={minWithdraw}
                  className={`w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-2xl font-bold ${
                    error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Fee: ~{((parseFloat(amount) || 0) * feePercent / 100).toFixed(0)} MWK ({feePercent}%)
                </p>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Money Provider <span className="text-red-500">*</span>
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                  required
                >
                  <option value="airtel">Airtel Money</option>
                  <option value="tnm">TNM Mpamba</option>
                  <option value="other">Other (Bank Transfer)</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (for payout) <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0999 123 456"
                  className="w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                  required
                />
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-300 text-sm">
                <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
                <p>
                  Withdrawals are processed within 24–48 hours. Ensure your phone number is correct and active.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full py-6 text-lg shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Request Withdrawal"
                )}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}