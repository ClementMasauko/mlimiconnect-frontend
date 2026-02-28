// src/pages/Prices.tsx
import React from "react";
import Card from "../components/ui/Card";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Link } from "lucide-react";
import Button from "../components/ui/Button";

const mockPrices = [
  { crop: "Maize (50kg bag)", location: "Lilongwe", price: "MWK 42,500", change: "+3.2%", trend: "up" },
  { crop: "Tomatoes (10kg crate)", location: "Blantyre", price: "MWK 18,000", change: "-1.8%", trend: "down" },
  { crop: "Groundnuts (50kg bag)", location: "Mzuzu", price: "MWK 58,000", change: "+5.1%", trend: "up" },
  { crop: "Soybeans (50kg bag)", location: "Mzimba", price: "MWK 65,000", change: "+2.4%", trend: "up" },
  { crop: "Beans (50kg bag)", location: "Zomba", price: "MWK 48,000", change: "-0.5%", trend: "down" },
];

export default function Prices() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Live Market Prices
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Real-time prices across major markets in Malawi – updated daily for maize, tomatoes, groundnuts, soybeans & more.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-2">
            <Calendar size={16} /> Last updated: February 22, 2026 – 03:16 PM CAT
          </p>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPrices.map((item, i) => (
            <Card key={i} className="p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.crop}</h3>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    item.trend === "up"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {item.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {item.change}
                </span>
              </div>

              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
                {item.price}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="font-medium">{item.location} Market</span>
              </p>
            </Card>
          ))}
        </div>

        {/* Disclaimer & CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-3xl mx-auto">
            Prices are indicative averages from major markets and may vary by location, quality, and negotiation. For real-time updates, use the MlimiConnect app or dial *1399#.
          </p>
          <div className="flex justify-center gap-6">
            <Button variant="primary" size="lg" asChild>
              <Link to="/register">Start Selling Now</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/marketplace">Browse Listings</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}