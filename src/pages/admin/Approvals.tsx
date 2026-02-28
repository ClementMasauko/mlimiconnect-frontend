// src/pages/admin/Approvals.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const mockPendingProducts = [
  {
    id: 4782,
    name: "Fresh Tomatoes (Grade A)",
    farmer: "John Phiri",
    location: "Salima",
    price: "MWK 450/kg",
    quantity: "500 kg",
    submitted: "Feb 12, 2026",
  },
  {
    id: 4783,
    name: "Hybrid Maize Seeds",
    farmer: "Mary Banda",
    location: "Mzuzu",
    price: "MWK 12,500/bag",
    quantity: "120 bags",
    submitted: "Feb 11, 2026",
  },
  {
    id: 4784,
    name: "Organic Groundnuts",
    farmer: "Blessings Chimwemwe",
    location: "Lilongwe",
    price: "MWK 1,200/kg",
    quantity: "800 kg",
    submitted: "Feb 10, 2026",
  },
];

export default function Approvals() {
  const [items, setItems] = useState(mockPendingProducts);

  const approve = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // In real app → API call
  };

  const reject = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    // In real app → API call + reason modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <Clock className="text-amber-600" size={32} />
          Pending Product Approvals
        </h1>

        {items.length === 0 ? (
          <Card className="p-12 text-center text-gray-500 dark:text-gray-400">
            No pending product approvals at the moment.
          </Card>
        ) : (
          <div className="space-y-6">
            {items.map((product) => (
              <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      By {product.farmer} • {product.location}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm">
                      <span className="font-medium">{product.price}</span>
                      <span>• {product.quantity}</span>
                      <span className="text-gray-500">Submitted: {product.submitted}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => approve(product.id)}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle size={16} />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => reject(product.id)}
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}