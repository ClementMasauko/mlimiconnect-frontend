// src/pages/advisory/SmartContractCreation.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { ShieldCheck, FileText, DollarSign, Calendar, Save, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const contractTypes = [
  { value: "yield-insurance", label: "Yield Insurance" },
  { value: "price-floor", label: "Price Floor Agreement" },
  { value: "quality-premium", label: "Quality-Based Premium" },
  { value: "bulk-delivery", label: "Bulk Delivery Commitment" },
];

export default function SmartContractCreation() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "yield-insurance",
    product: "",
    quantity: "",
    price: "",
    triggerCondition: "",
    expiryDate: "",
    partner: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      navigate("/app/advisory/smart-contracts");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to="/app/advisory/smart-contracts" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2 mb-4">
            ← Back to Smart Contracts
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-green-600" size={32} /> Create Smart Contract
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set up automatic, blockchain-enforced agreements with buyers
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-12 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800"
          >
            <div className="text-green-600 text-6xl mb-6">✓</div>
            <h2 className="text-2xl font-bold mb-4">Contract Created!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your smart contract has been deployed on Polygon. Partners can now accept it.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate("/app/advisory/smart-contracts")}>
                View All Contracts
              </Button>
            </div>
          </motion.div>
        ) : (
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contract Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contract Type *
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                  required
                >
                  {contractTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product & Quantity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product *
                  </label>
                  <Input
                    value={form.product}
                    onChange={e => setForm({ ...form, product: e.target.value })}
                    placeholder="e.g. Yellow Maize"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity (kg/bags)
                  </label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: e.target.value })}
                    placeholder="e.g. 5000 kg"
                  />
                </div>
              </div>

              {/* Price & Trigger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Agreed Price (MWK)
                  </label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="e.g. 28500 per 50kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trigger Condition
                  </label>
                  <Input
                    value={form.triggerCondition}
                    onChange={e => setForm({ ...form, triggerCondition: e.target.value })}
                    placeholder="e.g. Rainfall < 400mm"
                  />
                </div>
              </div>

              {/* Expiry & Partner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="date"
                    value={form.expiryDate}
                    onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Partner (Buyer)
                  </label>
                  <Input
                    value={form.partner}
                    onChange={e => setForm({ ...form, partner: e.target.value })}
                    placeholder="Enter buyer name or wallet"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/app/advisory/smart-contracts")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="min-w-[200px] flex items-center gap-2"
                >
                  <Save size={18} />
                  {submitting ? "Deploying..." : "Create Smart Contract"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}