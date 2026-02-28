// src/pages/Features.tsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  DollarSign,
  Truck,
  ShieldCheck,
  BarChart3,
  Smartphone,
  Leaf,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: <DollarSign className="h-10 w-10" />,
    title: "Better Prices & Direct Buyers",
    description: "List your crops and connect directly with buyers – no middlemen, higher profits.",
    color: "text-emerald-600",
  },
  {
    icon: <Truck className="h-10 w-10" />,
    title: "Reliable Transport Booking",
    description: "Compare transporter bids, book delivery, and track in real-time.",
    color: "text-blue-600",
  },
  {
    icon: <ShieldCheck className="h-10 w-10" />,
    title: "Secure Escrow Payments",
    description: "Funds held safely until delivery confirmed – pay/receive via mobile money.",
    color: "text-purple-600",
  },
  {
    icon: <BarChart3 className="h-10 w-10" />,
    title: "Live Market Prices & Analytics",
    description: "Daily price updates, trends, and your sales performance dashboard.",
    color: "text-amber-600",
  },
  {
    icon: <Smartphone className="h-10 w-10" />,
    title: "USSD & Offline Access",
    description: "Dial *1399# for prices, weather, and wallet balance – no internet needed.",
    color: "text-teal-600",
  },
  {
    icon: <Leaf className="h-10 w-10" />,
    title: "Pest & Weather Advisory",
    description: "Crop-specific pest alerts, forecasts, and organic farming tips.",
    color: "text-green-700",
  },
  {
    icon: <MessageCircle className="h-10 w-10" />,
    title: "Direct Farmer-Buyer Chat",
    description: "Negotiate deals, share photos, and build trust in-app.",
    color: "text-pink-600",
  },
  {
    icon: <TrendingUp className="h-10 w-10" />,
    title: "Traceability & Reputation",
    description: "Blockchain-backed batch tracking + verified ratings for better deals.",
    color: "text-indigo-600",
  },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Powerful Features for Malawi Farmers
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
            Everything you need to sell smarter, earn more, and farm better – built for Malawi.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-opacity-10 ${feature.color.replace("text-", "bg-")}`}>
                {React.cloneElement(feature.icon, { className: `text-${feature.color.split("-")[1]}` })}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8">
            Ready to experience these features yourself?
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link to="/register">Start Free Today</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/support">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}