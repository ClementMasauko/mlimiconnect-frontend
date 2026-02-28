// src/pages/onboarding/BuyerOnboarding.tsx
// Very similar structure to the farmer one, but buyer-focused steps

import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "../../components/ui/Button";
import { Check, ChevronRight, ChevronLeft, ShoppingBag, Globe, MapPin } from "lucide-react";

const buyerSteps = [
  { id: 0, title: "Welcome Buyer!", desc: "Get direct access to fresh produce from Malawi farmers" },
  { id: 1, title: "Choose Language", desc: "Chichewa, Chitumbuka or English" },
  { id: 2, title: "Your Buying Preferences", desc: "Tell us what you usually buy" },
  { id: 3, title: "Ready to Shop!", desc: "Start browsing and ordering today" },
];

export default function BuyerOnboarding() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("english");
  const [preferredCrops, setPreferredCrops] = useState("");

  const next = () => setStep((p) => Math.min(p + 1, buyerSteps.length - 1));
  const back = () => setStep((p) => Math.max(p - 1, 0));

  const isLast = step === buyerSteps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 flex flex-col">
        <div className="flex justify-between mb-10">
          {buyerSteps.map((_, i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= step ? "bg-green-600 text-white ring-2 ring-green-300" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              {step === 0 && <ShoppingBag size={40} className="text-green-600" />}
              {step === 1 && <Globe size={40} className="text-green-600" />}
              {step === 2 && <MapPin size={40} className="text-green-600" />}
              {step === 3 && <Check size={40} className="text-green-600" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{buyerSteps[step].title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{buyerSteps[step].desc}</p>
          </div>

          {step === 1 && (
            <div className="space-y-4 mb-12">
              {["Chichewa", "Chitumbuka", "English"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang.toLowerCase())}
                  className={`w-full p-5 border-2 rounded-xl text-left transition-all ${
                    language === lang.toLowerCase()
                      ? "border-green-600 bg-green-50 dark:bg-green-950/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-400"
                  }`}
                >
                  <div className="font-medium text-lg">{lang}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 mb-12">
              <div>
                <label className="block text-sm font-medium mb-2">What do you usually buy? (comma separated)</label>
                <textarea
                  value={preferredCrops}
                  onChange={(e) => setPreferredCrops(e.target.value)}
                  placeholder="e.g. Maize, Tomatoes, Onions, Beans, Vegetables"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  rows={4}
                />
              </div>
            </div>
          )}

          {isLast && (
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check size={48} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">You're ready to shop!</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Browse fresh produce, connect directly with farmers, and manage orders — all in one place.
              </p>
            </div>
          )}

          <div className="mt-auto flex gap-4">
            {step > 0 && (
              <Button variant="outline" className="flex-1 py-6 text-lg" onClick={back}>
                <ChevronLeft size={20} className="mr-2" /> Back
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1 py-6 text-lg"
              onClick={isLast ? () => (window.location.href = "/app/dashboard") : next}
            >
              {isLast ? "Go to Dashboard" : <>Continue <ChevronRight size={20} className="ml-2" /></>}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}