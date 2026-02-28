// src/pages/advisory/SmartContracts.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ShieldCheck, FileText, DollarSign, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react";

const mockContracts = [
  {
    id: "SC-001",
    type: "Yield Insurance",
    product: "Maize",
    amount: "MWK 500,000",
    status: "Active",
    expiry: "2025-12-31",
    trigger: "Rainfall < 400mm during growing season",
  },
  {
    id: "SC-002",
    type: "Price Floor Agreement",
    product: "Tomatoes",
    amount: "MWK 120,000/10kg",
    status: "Pending",
    expiry: "2025-08-15",
    trigger: "Market price falls below agreed floor",
  },
];

export default function SmartContracts() {
  const [contracts] = useState(mockContracts);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/app/advisory" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2 mb-4">
            ← Back to Advisory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-green-600" size={32} /> Smart Contracts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Blockchain-based agreements for yield protection, price guarantees, and automatic payments
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button className="flex items-center gap-2 flex-1 justify-center">
            <Plus size={18} /> Create New Contract
          </Button>
          <Button variant="outline" className="flex items-center gap-2 flex-1 justify-center">
            <FileText size={18} /> View All Contracts
          </Button>
        </div>

        <div className="space-y-6">
          {contracts.map((contract) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full">
                      <ShieldCheck className="text-purple-600" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{contract.type}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {contract.product} • {contract.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      contract.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {contract.status}
                    </span>
                    <p className="text-sm text-gray-500">
                      Expires: {contract.expiry}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t dark:border-gray-700">
                  <h4 className="text-lg font-medium mb-3">Trigger Conditions</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {contract.trigger}
                  </p>
                </div>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700">
                    Cancel Contract
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}