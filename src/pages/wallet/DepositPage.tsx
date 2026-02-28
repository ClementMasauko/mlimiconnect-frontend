// src/pages/wallet/DepositPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowUpRight, AlertCircle, CheckCircle, Loader2, DollarSign } from "lucide-react";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [provider, setProvider] = useState("airtel");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minDeposit = 500;
  const maxDeposit = 10000000; // e.g. 10M MWK limit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount < minDeposit) {
      setError(`Minimum deposit is MWK ${minDeposit.toLocaleString()}`);
      return;
    }
    if (depositAmount > maxDeposit) {
      setError(`Maximum deposit per transaction is MWK ${maxDeposit.toLocaleString()}`);
      return;
    }

    setLoading(true);

    // Simulate API call (replace with real payment gateway integration)
    await new Promise(resolve => setTimeout(resolve, 2200));

    setLoading(false);
    setSuccess(true);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/app/wallet"
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2 mb-4 font-medium"
          >
            ← Back to Wallet
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ArrowUpRight className="text-emerald-600" size={36} />
            Deposit Funds
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Add money to your MlimiConnect wallet via mobile money
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Deposit Requested!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your request to deposit MWK {parseFloat(amount).toLocaleString()} has been submitted. Funds will appear in your wallet shortly.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/app/wallet">Back to Wallet</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Deposit (MWK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  min={minDeposit}
                  max={maxDeposit}
                  className={`w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-2xl font-bold ${
                    error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  required
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Minimum: MWK {minDeposit.toLocaleString()} • Maximum per deposit: MWK {maxDeposit.toLocaleString()}
                </p>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deposit Via <span className="text-red-500">*</span>
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                  required
                >
                  <option value="airtel">Airtel Money</option>
                  <option value="tnm">TNM Mpamba</option>
                  <option value="bank">Bank Transfer (Manual)</option>
                </select>
              </div>

              {/* Instructions */}
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
                  <DollarSign size={20} /> How to Deposit
                </h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>Enter the amount you want to add to your wallet.</li>
                  <li>Select your mobile money provider.</li>
                  <li>Click "Deposit Now" and follow the prompts on your phone.</li>
                  <li>Funds will appear in your wallet within minutes.</li>
                </ol>
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
                  "Deposit Now"
                )}
              </Button>
            </form>
          )}
        </Card>

        <div className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
          Need help? <Link to="/support" className="text-emerald-600 dark:text-emerald-400 hover:underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}