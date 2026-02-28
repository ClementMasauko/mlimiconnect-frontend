// src/pages/orders/OrderDetails.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { CheckCircle, Truck, Clock, AlertCircle, Package, MapPin, User } from "lucide-react";

// Mock order data
const mockOrder = {
  id: 4782,
  created_at: "2025-02-08",
  status: "completed",
  total: 185000,
  delivery_address: "Area 18, Lilongwe",
  payment_method: "Airtel Money",
  items: [
    {
      product: { id: 1, name: "Fresh Maize (50kg bag)", price: 185000 },
      qty: 1,
      subtotal: 185000,
    },
  ],
  farmer: "John Phiri",
  farmer_phone: "+265 999 123 456",
};

export default function OrderDetails() {
  const { id } = useParams();
  const [order] = useState(mockOrder);

  const getStatusInfo = (status: string) => {
    const map = {
      completed: { color: "text-green-600", icon: CheckCircle, text: "Order Completed" },
      in_transit: { color: "text-blue-600", icon: Truck, text: "In Transit" },
      processing: { color: "text-purple-600", icon: Package, text: "Processing" },
      pending_payment: { color: "text-yellow-600", icon: Clock, text: "Awaiting Payment" },
      cancelled: { color: "text-red-600", icon: AlertCircle, text: "Cancelled" },
    };
    return map[status as keyof typeof map] || { color: "text-gray-600", icon: Clock, text: status };
  };

  const status = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/app/orders" className="text-green-700 dark:text-green-400 hover:underline text-sm font-medium">
            ← Back to My Orders
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            Order #{order.id}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Order summary + items */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${status.color} bg-opacity-10 bg-current`}>
                  <status.icon size={16} />
                  {status.text}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Placed on</span>
                  <span className="font-medium">
                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                  <span className="font-medium">{order.payment_method}</span>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                        </div>
                        <p className="font-medium">MWK {item.subtotal.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p>{order.delivery_address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-gray-500 mt-1" size={18} />
                  <div>
                    <p className="font-medium">Sold by</p>
                    <p>{order.farmer}</p>
                    <p className="text-sm text-gray-500">Contact: {order.farmer_phone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column: Summary */}
          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>MWK {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-700 dark:text-green-500">
                      MWK {order.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Order placed on {new Date(order.created_at).toLocaleDateString()}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}