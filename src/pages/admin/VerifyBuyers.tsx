// src/pages/admin/VerifyBuyers.tsx
import React from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CheckCircle, XCircle, Clock, UserCheck } from "lucide-react";

const mockPendingBuyers = [
  {
    id: 1,
    name: "Alick Mwale",
    type: "Restaurant",
    company: "Lilongwe Fresh Foods",
    location: "Lilongwe",
    submitted: "Feb 10, 2026",
    status: "pending",
  },
  {
    id: 2,
    name: "Zomba Agro Ltd",
    type: "Exporter",
    company: "Zomba Agro Ltd",
    location: "Zomba",
    submitted: "Feb 8, 2026",
    status: "pending",
  },
];

export default function VerifyBuyers() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-8">
          <UserCheck className="text-green-600" size={32} /> Verify Buyer Requests
        </h1>

        <Card className="p-6">
          {mockPendingBuyers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No pending buyer verification requests at the moment.
            </div>
          ) : (
            <div className="space-y-6">
              {mockPendingBuyers.map((buyer) => (
                <div
                  key={buyer.id}
                  className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{buyer.company || buyer.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {buyer.type} • {buyer.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {buyer.submitted}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm">
                      <Clock size={14} /> Pending
                    </span>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <Button variant="primary" size="sm" className="flex-1">
                      <CheckCircle size={16} className="mr-2" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      <XCircle size={16} className="mr-2" /> Reject
                    </Button>
                    <Button variant="outline" size="sm">
                      View Documents
                    </Button>
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