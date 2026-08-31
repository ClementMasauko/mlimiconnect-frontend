// src/pages/traceability/VerifyTraceability.tsx
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { QrCode, Search, ShieldCheck, CheckCircle, AlertTriangle, Camera, X } from "lucide-react";
import api, { getApiError } from "../../lib/api";
import { extractPublicTraceabilityCode } from "../../lib/traceability";

interface VerificationRecord {
  id: number;
  batch_code: string;
  product: string;
  quantity: string;
  status: string;
  public_data?: { origin?: string; producer?: string };
  updated_at?: string;
  events?: Array<{ id: number; stage: string; description: string; location: string; occurred_at: string; actor: string }>;
}

export default function VerifyTraceability() {
  const { publicCode } = useParams();
  const [searchParams] = useSearchParams();
  const initialCode = publicCode || searchParams.get("product") || "";
  const [productId, setProductId] = useState(initialCode);
  const [verifying, setVerifying] = useState(false);
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleVerify = async (value = productId) => {
    const code = extractPublicTraceabilityCode(value);
    if (!code) return;
    setProductId(code);
    setVerifying(true);
    setError("");
    setRecord(null);
    try {
      const { data } = await api.get<VerificationRecord>(`/api/traceability/verify/${encodeURIComponent(code)}/`);
      setRecord(data);
    } catch (requestError) {
      setError(getApiError(requestError, "No public traceability record was found for this code."));
    } finally {
      setVerifying(false);
    }
  };

  const handleScan = (results: Array<{ rawValue: string }>) => {
    const value = results[0]?.rawValue;
    if (!value) return;
    setShowScanner(false);
    void handleVerify(value);
  };

  useEffect(() => {
    if (initialCode) void handleVerify(initialCode);
    // The route/query value is intentionally verified only when it changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

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
            Scan a MlimiConnect QR code or enter a public batch number
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
  onError={() => setError("The camera could not be started. Enter the batch number instead.")}
  constraints={{ facingMode: "environment" }}
  styles={{ container: { width: "100%" } }}
/>

                <button
                  onClick={() => setShowScanner(false)}
                  aria-label="Close QR scanner"
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
                onClick={() => void handleVerify()}
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

            {record && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl text-center"
              >
                <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                  Public record found
                </h2>
                <p className="text-green-700 dark:text-green-400">
                  {record.product} · {record.status}
                </p>
                <dl className="mt-5 grid gap-2 text-left text-sm text-green-900 dark:text-green-200">
                  <div><dt className="font-semibold">Batch code</dt><dd>{record.batch_code}</dd></div>
                  <div><dt className="font-semibold">Quantity</dt><dd>{record.quantity}</dd></div>
                  {record.public_data?.origin && <div><dt className="font-semibold">Origin</dt><dd>{record.public_data.origin}</dd></div>}
                  {record.public_data?.producer && <div><dt className="font-semibold">Producer</dt><dd>{record.public_data.producer}</dd></div>}
                  {record.updated_at && <div><dt className="font-semibold">Last updated</dt><dd>{new Date(record.updated_at).toLocaleDateString()}</dd></div>}
                </dl>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-center"
              >
                <AlertTriangle className="mx-auto text-red-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-3">
                  Verification unavailable
                </h2>
                <p className="text-red-700 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
