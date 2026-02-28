// src/pages/advisory/PestDetection.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Bug, Camera, Leaf, AlertTriangle, CheckCircle, Loader2, ShieldCheck, X } from "lucide-react";

export default function PestDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    pest: string;
    severity: "low" | "medium" | "high";
    recommendation: string;
  } | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      analyzeImage();
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResult(null);

    // Simulate AI analysis (replace with real API call later)
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        pest: "Fall Armyworm",
        severity: "high",
        recommendation: "Apply organic neem-based pesticide immediately. Monitor neighboring fields. Avoid chemical overuse to protect pollinators.",
      });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/app/advisory" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2 mb-4">
            ← Back to Advisory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bug className="text-red-600" size={32} /> Pest & Disease Detection
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload leaf/plant photo — get instant AI-powered diagnosis and treatment advice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload & Preview */}
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Camera className="text-green-600" size={24} /> Upload Photo
            </h2>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Uploaded plant"
                      className="max-h-80 mx-auto rounded-lg shadow-lg object-contain"
                    />
                    <button
                      onClick={() => setImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <Camera size={48} className="text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">
                        Click or drag photo here
                      </p>
                      <p className="text-sm text-gray-500">Supported: JPG, PNG</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <Button
                onClick={analyzeImage}
                disabled={!image || analyzing}
                className="w-full flex items-center justify-center gap-2 py-4"
              >
                {analyzing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bug size={20} /> Detect Pests & Diseases
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Results */}
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="p-6 md:p-8 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-red-600" size={28} />
                    <h2 className="text-2xl font-semibold">Detection Result</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <p className="text-lg font-medium text-red-800 dark:text-red-300">
                        Pest/Disease: <strong>{result.pest}</strong>
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        Severity: <strong className="uppercase">{result.severity}</strong>
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Recommended Actions</h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {result.recommendation}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <Leaf size={18} /> Organic Solutions
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <ShieldCheck size={18} /> Report to Experts
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : analyzing ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto text-green-600 mb-4" size={48} />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                    Analyzing your photo...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few seconds
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center text-center"
              >
                <div>
                  <Bug className="mx-auto text-gray-400 mb-4" size={64} />
                  <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                    Upload a clear photo of affected leaves or stems
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}