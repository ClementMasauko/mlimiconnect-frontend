import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ShoppingBag, PackageCheck, Star, TrendingUp, Clock } from "lucide-react";

const mockBuyerStats = {
  ordersPlaced: 18,
  totalSpent: 2450000,
  activeOrders: 4,
  favoriteFarmers: 7,
};

const mockRecentOrders = [
  { id: "ORD-4782", product: "Maize 100kg", farmer: "John Phiri", amount: 2800000, status: "Delivered", date: "Feb 10, 2026" },
  { id: "ORD-4781", product: "Tomatoes 200kg", farmer: "Mary Banda", amount: 890000, status: "In Transit", date: "Feb 8, 2026" },
];

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <ShoppingBag className="text-green-600" size={32} /> Buyer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your purchases, saved farmers, and market insights
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="p-6 text-center">
            <PackageCheck className="mx-auto text-blue-600 mb-3" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Orders Placed</p>
            <p className="text-3xl font-bold mt-1">{mockBuyerStats.ordersPlaced}</p>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="mx-auto text-emerald-600 mb-3" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">
              MWK {mockBuyerStats.totalSpent.toLocaleString()}
            </p>
          </Card>
          <Card className="p-6 text-center">
            <Clock className="mx-auto text-amber-600 mb-3" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Orders</p>
            <p className="text-3xl font-bold mt-1">{mockBuyerStats.activeOrders}</p>
          </Card>
          <Card className="p-6 text-center">
            <Star className="mx-auto text-purple-600 mb-3" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">Favorite Farmers</p>
            <p className="text-3xl font-bold mt-1">{mockBuyerStats.favoriteFarmers}</p>
          </Card>
        </div>

        <Card className="p-6 mb-10">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Clock size={24} /> Recent Orders
          </h2>
          <div className="space-y-4">
            {mockRecentOrders.map(order => (
              <div
                key={order.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div>
                  <p className="font-medium">{order.product}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">From {order.farmer}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">MWK {order.amount.toLocaleString()}</p>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    {order.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{order.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Browse Marketplace
              </Button>
              <Button variant="outline" className="w-full justify-start">
                View Saved Farmers
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Request Traceability Docs
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Market Insights</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Maize prices rising in Central Region – good time to stock up.
            </p>
            <Button variant="link" className="mt-4 p-0">
              View Full Forecast →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}