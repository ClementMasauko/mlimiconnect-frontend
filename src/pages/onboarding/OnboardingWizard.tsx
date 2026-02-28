import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Check, ChevronRight, ChevronLeft, Globe, Leaf, User } from "lucide-react";

const steps = [
  { id: 0, title: "Welcome to MlimiConnect", icon: Leaf },
  { id: 1, title: "Choose Your Language", icon: Globe },
  { id: 2, title: "Tell Us About Your Farm", icon: User },
  { id: 3, title: "You're All Set!", icon: Check },
];

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState("english");
  const [farmSize, setFarmSize] = useState("");
  const [mainCrops, setMainCrops] = useState("");

  const next = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const back = () => setStep((prev) => Math.max(prev - 1, 0));

  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 flex-1 flex flex-col">
        {/* Progress */}
        <div className="flex justify-between mb-10">
          {steps.map((s, i) => (
            <div
              key={s.id}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i <= step
                  ? "bg-green-600 text-white ring-2 ring-green-300 dark:ring-green-500/50"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              {React.createElement(steps[step].icon, { size: 40, className: "text-green-600 dark:text-green-400" })}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {steps[step].title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {step === 0 && "Direct market access and smart farming tools for Malawi farmers"}
              {step === 1 && "Select your preferred language"}
              {step === 2 && "Help us personalize your experience"}
              {step === 3 && "Start selling and growing smarter today"}
            </p>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Farm Size (acres)
                </label>
                <input
                  type="number"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  placeholder="e.g. 3.5"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Main Crops (comma separated)
                </label>
                <input
                  type="text"
                  value={mainCrops}
                  onChange={(e) => setMainCrops(e.target.value)}
                  placeholder="e.g. Maize, Tomatoes, Groundnuts"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          {isLast && (
            <div className="text-center mb-12">
              <div className="w-24 h-24 mx-auto mb-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Check size={48} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Your account is ready!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Start listing your produce and connect directly with buyers today.
              </p>
            </div>
          )}

          <div className="mt-auto flex gap-4">
            {step > 0 && (
              <Button
                variant="outline"
                className="flex-1 py-6 text-lg"
                onClick={back}
              >
                <ChevronLeft size={20} className="mr-2" /> Back
              </Button>
            )}
            <Button
              variant="primary"
              className="flex-1 py-6 text-lg"
              onClick={isLast ? () => window.location.href = "/app/dashboard" : next}
            >
              {isLast ? "Go to Dashboard" : <>Continue <ChevronRight size={20} className="ml-2" /></>}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}