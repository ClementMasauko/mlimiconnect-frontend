// src/pages/admin/Disputes.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

const mockDisputes = [
  {
    id: 12,
    orderId: 4789,
    buyer: "Chisomo Traders",
    farmer: "Gift Mwale",
    reason: "Received spoiled vegetables – 40kg affected",
    amount: "MWK 185,000",
    date: "Feb 12, 2026",
    status: "pending",
  },
  {
    id: 11,
    orderId: 4782,
    buyer: "Lilongwe Hotel",
    farmer: "Mary Phiri",
    reason: "Wrong quantity delivered (80kg instead of 100kg)",
    amount: "MWK 92,000",
    date: "Feb 10, 2026",
    status: "in review",
  },
];

export default function Disputes() {
  const [disputes, setDisputes] = useState(mockDisputes);

  const resolveDispute = (id: number, action: "refund" | "reject") => {
    setDisputes((prev) => prev.filter((d) => d.id !== id));
    // In real app → API call + log action
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <AlertTriangle className="text-amber-600" size={32} />
          Dispute Resolution
        </h1>

        {disputes.length === 0 ? (
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            No active disputes at the moment.
          </Card>
        ) : (
          <div className="space-y-6">
            {disputes.map((dispute) => (
              <Card key={dispute.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Dispute #{dispute.id} – Order #{dispute.orderId}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {dispute.buyer} vs {dispute.farmer}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm">
                    <Clock size={14} />
                    {dispute.status === "pending" ? "Pending" : "In Review"}
                  </span>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4">{dispute.reason}</p>

                <div className="flex flex-wrap gap-6 text-sm mb-6">
                  <div>
                    <span className="text-gray-500">Amount:</span>{" "}
                    <span className="font-medium">{dispute.amount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Filed:</span>{" "}
                    <span className="font-medium">{dispute.date}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="primary"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => resolveDispute(dispute.id, "refund")}
                  >
                    <CheckCircle size={16} />
                    Refund Buyer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 flex items-center justify-center gap-2"
                    onClick={() => resolveDispute(dispute.id, "reject")}
                  >
                    <XCircle size={16} />
                    Reject Claim
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}