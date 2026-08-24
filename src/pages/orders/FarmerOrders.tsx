// src/pages/orders/FarmerOrders.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { Truck, CheckCircle, AlertCircle, DollarSign, MessageSquare, ShieldCheck } from "lucide-react";
import api, { getApiError } from "../../lib/api";

const mockIncomingOrders = [
  {
    id: 4782,
    buyer: "Shoprite Lilongwe",
    product: "Maize 50kg",
    quantity: 10,
    total: 185000,
    status: "paid-pending-delivery",
    escrowStatus: "held",
    disputeWindow: "24 hours left",
    date: "2026-02-10",
  },
  {
    id: 4783,
    buyer: "Zomba Restaurant",
    product: "Tomatoes 20kg",
    quantity: 5,
    total: 95000,
    status: "in-dispute",
    escrowStatus: "disputed",
    disputeWindow: "Open",
    date: "2026-02-08",
  },
];

export default function FarmerOrders() {
  const [orders, setOrders] = useState(mockIncomingOrders);
  const [loadError, setLoadError] = useState("");
  const [deliveryOrder, setDeliveryOrder] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (import.meta.env.VITE_DEMO_DATA_ENABLED === "true") return;
    api.get("/api/marketplace/seller-orders/").then(({ data }) => {
      const rows = Array.isArray(data) ? data : data.results ?? [];
      setOrders(rows.map((order: { id: number; created_at: string; status: string; total: string | number; items?: Array<{ name: string; quantity: number }> }) => ({
        id: order.id, buyer: "Verified buyer", product: order.items?.[0]?.name ?? "Agricultural order",
        quantity: order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
        total: Number(order.total), status: order.status, escrowStatus: order.status === "delivered" ? "released" : "held",
        disputeWindow: "24 hours after delivery", date: order.created_at,
      })));
    }).catch(error => { setOrders([]); setLoadError(getApiError(error, "Incoming orders could not be loaded.")); });
  }, []);

  const confirmDelivery = async (id: number) => {
    try {
      if (import.meta.env.VITE_DEMO_DATA_ENABLED !== "true") await api.patch(`/api/marketplace/orders/${id}/status/`, { status: "delivered" });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "delivered", escrowStatus: "released" } : o));
      setDeliveryOrder(null);
    } catch (error) { setLoadError(getApiError(error, "Delivery could not be confirmed.")); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Incoming Orders</h1>
        {loadError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{loadError}</p>}
        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <DollarSign className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold mb-3">No incoming orders yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              When buyers place orders on your listings, they'll appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {order.buyer} • {order.product} x {order.quantity} • MWK {order.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "delivered" ? "bg-green-100 text-green-800" :
                    order.status === "in-dispute" ? "bg-red-100 text-red-800" :
                    "bg-amber-100 text-amber-800"
                  }`}>
                    {order.status.replace("-", " ")}
                  </span>
                </div>

                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-blue-600" />
                    <span className="font-medium">Escrow: {order.escrowStatus}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Dispute window: {order.disputeWindow}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-4">
                  {order.status === "paid-pending-delivery" && (
                    <Button
                      variant="primary"
                      onClick={() => setDeliveryOrder(order.id)}
                      className="flex-1 min-w-[150px]"
                    >
                      <Truck size={16} className="mr-2" /> Confirm Delivery
                    </Button>
                  )}
                  {order.status === "in-dispute" && (
                    <Button variant="outline" className="flex-1 text-red-600" onClick={() => navigate(`/app/orders/${order.id}/dispute`)}>
                      <AlertCircle size={16} className="mr-2" /> View Dispute
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/app/messages/${order.id}`)}>
                    <MessageSquare size={16} className="mr-2" /> Message Buyer
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Modal open={deliveryOrder !== null} title="Confirm delivery" onClose={() => setDeliveryOrder(null)}>
        <p className="text-gray-600 dark:text-gray-300">Only confirm after the buyer has received the complete order. This will release the escrow payment to your wallet.</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setDeliveryOrder(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => deliveryOrder !== null && confirmDelivery(deliveryOrder)}>
            <CheckCircle size={16} className="mr-2" /> Confirm and release payment
          </Button>
        </div>
      </Modal>
    </div>
  );
}
