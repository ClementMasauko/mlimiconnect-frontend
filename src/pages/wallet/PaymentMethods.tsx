// src/pages/wallet/PaymentMethods.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CreditCard, Smartphone, PlusCircle, Trash2, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const mockPaymentMethods = [
  {
    id: 1,
    type: "mobile_money",
    provider: "Airtel Money",
    number: "0999 123 456",
    isDefault: true,
    verified: true,
  },
  {
    id: 2,
    type: "mobile_money",
    provider: "TNM Mpamba",
    number: "0888 654 321",
    isDefault: false,
    verified: true,
  },
  {
    id: 3,
    type: "bank",
    provider: "National Bank of Malawi",
    number: "****7890",
    isDefault: false,
    verified: false,
  },
];

export default function PaymentMethods() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddMethod = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Remove this payment method?")) {
      // API call would go here
      alert("Payment method removed (mock)");
    }
  };

  const handleSetDefault = (id: number) => {
    // API call would go here
    alert("Set as default payment method (mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <Link
            to="/app/wallet"
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-2 mb-4 font-medium"
          >
            ← Back to Wallet
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Smartphone className="text-emerald-600" size={36} />
            Payment Methods
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Manage your mobile money accounts and bank details for deposits & withdrawals
          </p>
        </div>

        <Card className="p-8 shadow-lg mb-10">
          <h2 className="text-2xl font-bold mb-6">Your Saved Methods</h2>

          {mockPaymentMethods.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <AlertCircle className="mx-auto h-12 w-12 mb-4" />
              <p>No payment methods added yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {mockPaymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {method.type === "mobile_money" ? (
                      <Smartphone className="text-emerald-600" size={32} />
                    ) : (
                      <CreditCard className="text-blue-600" size={32} />
                    )}
                    <div>
                      <p className="font-medium text-lg text-gray-900 dark:text-white">
                        {method.provider}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">{method.number}</p>
                      {method.isDefault && (
                        <span className="inline-flex mt-2 px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Default
                        </span>
                      )}
                      {!method.verified && (
                        <span className="inline-flex mt-2 px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                          Pending Verification
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4 sm:mt-0">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Add New Method */}
        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <PlusCircle className="text-emerald-600" size={28} />
            Add New Payment Method
          </h2>

          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Method Added!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Your new method has been saved and is ready to use.
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/app/wallet">Back to Wallet</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Money Provider
                </label>
                <select className="w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg">
                  <option>Airtel Money</option>
                  <option>TNM Mpamba</option>
                  <option>National Bank of Malawi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number or Account Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0999 123 456"
                  className="w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full py-6 text-lg shadow-lg"
                onClick={handleAddMethod}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  "Add Payment Method"
                )}
              </Button>

              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Your payment information is encrypted and secure.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}