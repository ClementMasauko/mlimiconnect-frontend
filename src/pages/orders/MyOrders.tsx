// src/pages/orders/MyOrders.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Clock, CheckCircle, Truck, AlertCircle, Package } from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: 4782,
    created_at: "2025-02-08",
    status: "completed",
    total: 185000,
    items_count: 1,
  },
  {
    id: 4781,
    created_at: "2025-02-07",
    status: "in_transit",
    total: 72000,
    items_count: 2,
  },
  {
    id: 4779,
    created_at: "2025-02-05",
    status: "pending_payment",
    total: 95000,
    items_count: 1,
  },
  {
    id: 4775,
    created_at: "2025-02-02",
    status: "processing",
    total: 42000,
    items_count: 3,
  },
  {
    id: 4768,
    created_at: "2025-01-28",
    status: "cancelled",
    total: 15000,
    items_count: 1,
  },
];

export default function MyOrders() {
  const [orders] = useState(mockOrders);

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pending_payment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const icons = {
      completed: <CheckCircle size={14} />,
      in_transit: <Truck size={14} />,
      pending_payment: <Clock size={14} />,
      processing: <Package size={14} />,
      cancelled: <AlertCircle size={14} />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {icons[status as keyof typeof icons]}
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track and view all your recent purchases</p>
        </div>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold mb-3">No orders yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">When you place an order, it will appear here.</p>
            <Link to="/app/marketplace">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="p-5 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        Order #{order.id}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Placed on {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {order.items_count} item{order.items_count !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-700 dark:text-green-500">
                        MWK {order.total.toLocaleString()}
                      </p>
                    </div>
                    <Link to={`/app/orders/${order.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
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