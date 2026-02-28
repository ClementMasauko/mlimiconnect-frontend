// src/pages/Pricing.tsx
import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { CheckCircle, XCircle, Star, Link } from "lucide-react";

const plans = [
  {
    name: "Free (Starter)",
    price: "MWK 0",
    description: "Perfect for new farmers testing the platform",
    features: [
      "Unlimited crop listings",
      "Basic market prices",
      "USSD access (*1399#)",
      "Mobile money payouts",
      "Community chat",
      "Standard support",
    ],
    notIncluded: ["Priority buyer visibility", "Advanced analytics", "Premium badges"],
    buttonText: "Get Started Free",
    variant: "outline",
    popular: false,
  },
  {
    name: "Pro Farmer",
    price: "MWK 15,000",
    period: "/month",
    description: "Best value – full visibility & premium features",
    features: [
      "All Free features",
      "Priority listing placement",
      "Advanced analytics & sales reports",
      "Verified Pro badge",
      "Priority support (WhatsApp + call)",
      "Featured in buyer recommendations",
      "Traceability module access",
    ],
    notIncluded: [],
    buttonText: "Choose Pro",
    variant: "primary",
    popular: true,
  },
  {
    name: "Enterprise Buyer",
    price: "Custom",
    description: "For restaurants, wholesalers & exporters",
    features: [
      "Unlimited bulk orders",
      "Dedicated account manager",
      "API access for integration",
      "Advanced search & filters",
      "Priority transport matching",
      "Custom reporting",
      "White-label options",
    ],
    notIncluded: [],
    buttonText: "Contact Sales",
    variant: "outline",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Free to start. Upgrade only when you need more visibility and premium tools.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`p-8 relative ${plan.popular ? "border-2 border-emerald-500 shadow-2xl scale-105" : "border border-gray-200 dark:border-gray-700"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-1 rounded-full text-sm font-medium shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{plan.price}</span>
                {plan.period && <span className="text-gray-500 dark:text-gray-400"> {plan.period}</span>}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8">{plan.description}</p>

              <ul className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-500 line-through">
                    <XCircle className="h-5 w-5 text-gray-400" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.variant}
                size="lg"
                className="w-full"
                asChild
              >
                <Link to={plan.popular ? "/register?plan=pro" : "/register"}>
                  {plan.buttonText}
                </Link>
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Need a custom plan for cooperatives, exporters, or large buyers?
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/support">Contact Sales Team</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}