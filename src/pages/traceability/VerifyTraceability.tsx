// src/pages/traceability/VerifyTraceability.tsx
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { QrCode, Search, ShieldCheck, CheckCircle, AlertTriangle, Camera, X, Link } from "lucide-react";

export default function VerifyTraceability() {
  const [productId, setProductId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<"success" | "failed" | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (result: any) => {
  if (result && result.length > 0) {
    const value = result[0].rawValue;
    setProductId(value);
    setShowScanner(false);
    handleVerify();
  }
};


  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      if (productId.trim()) {
        setResult("success");
      } else {
        setResult("failed");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <ShieldCheck className="mx-auto text-green-600 mb-6" size={80} />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Verify Product Traceability
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Scan QR or enter ID for blockchain-verified journey
          </p>
        </motion.div>

        <Card className="p-8 md:p-12 shadow-xl">
          <div className="max-w-md mx-auto space-y-6">
            {showScanner ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Scanner
  onScan={handleScan}
  onError={(error) => console.error(error)}
  constraints={{ facingMode: "environment" }}
  styles={{ container: { width: "100%" } }}
/>

                <button
                  onClick={() => setShowScanner(false)}
                  className="absolute top-4 right-4 bg-white text-gray-600 rounded-full p-2 shadow"
                >
                  <X size={24} />
                </button>
              </motion.div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                  <QrCode className="text-gray-400" size={80} />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Product ID or Batch Number
              </label>
              <input
                type="text"
                value={productId}
                onChange={e => setProductId(e.target.value)}
                placeholder="e.g. PRD-4782 or BATCH-MZ-2025-06"
                className="w-full px-4 py-4 border rounded-lg text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleVerify}
                disabled={verifying || !productId.trim()}
                className="flex-1 py-4 text-lg flex items-center justify-center gap-3"
              >
                {verifying ? "Verifying..." : <><Search size={20} /> Verify</>}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScanner(!showScanner)}
                className="flex-1 py-4 text-lg flex items-center justify-center gap-3"
              >
                <Camera size={20} /> {showScanner ? "Close Scanner" : "Scan QR"}
              </Button>
            </div>

            {result === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-center"
              >
                <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                  Verified!
                </h2>
                <p className="text-green-700 dark:text-green-400">
                  This product has a complete, blockchain-verified journey.
                </p>
                <Link to={`/app/traceability/PRD-4782`}>
                  <Button className="mt-6">View Full Journey</Button>
                </Link>
              </motion.div>
            )}

            {result === "failed" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-center"
              >
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-3">
                  Not Found
                </h2>
                <p className="text-red-700 dark:text-red-400">
                  No record found. Please check the ID or QR code.
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}