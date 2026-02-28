// src/pages/traceability/TraceabilityOverview.tsx (updated with QR generator for farmers)
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, Truck, Sprout, Search, QrCode, ShieldCheck, Leaf, Download, X } from "lucide-react";

const mockProducts = [
  {
    id: 1,
    name: "Yellow Maize (50kg)",
    farmer: "Chikondi Phiri",
    batch: "BATCH-MZ-2025-06",
    status: "In Transit",
    completedStages: 4,
    totalStages: 7,
    lastUpdate: "2025-06-12",
    qrUrl: "http://localhost:5173/verify?product=BATCH-MZ-2025-06", // Mock QR URL
  },
  {
    id: 2,
    name: "Fresh Tomatoes (10kg crate)",
    farmer: "Mary Banda",
    batch: "BATCH-TM-2025-06",
    status: "Quality Check",
    completedStages: 3,
    totalStages: 7,
    lastUpdate: "2025-06-10",
    qrUrl: "http://localhost:5173/verify?product=BATCH-TM-2025-06",
  },
];

export default function TraceabilityOverview() {
  const { user } = useAuth();
  const isFarmer = user?.user_type === "farmer";

  const [searchQuery, setSearchQuery] = useState("");
  const [showQrModal, setShowQrModal] = useState<number | null>(null);

  const filteredProducts = mockProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.batch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadQR = (productId: number) => {
    const canvas = document.getElementById(`qr-canvas-${productId}`) as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qr_${productId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <ShieldCheck className="text-green-600" size={32} /> Traceability
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track every step of your produce — from seed to sale. Secured on Polygon blockchain.
              </p>
            </div>

            {isFarmer && (
              <Link to="/app/traceability/batch/new">
                <Button className="flex items-center gap-2">
                  <Leaf size={16} /> Register New Batch
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        <Card className="p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by product name, ID or batch..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>
        </Card>

        <AnimatePresence>
          <div className="space-y-6">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="p-12 text-center">
                  <QrCode className="mx-auto text-gray-400 mb-4" size={64} />
                  <h2 className="text-2xl font-semibold mb-3">No traceable products found</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {isFarmer ? "Register your first batch to start tracking." : "Scan a QR code or search for a product."}
                  </p>
                  {isFarmer && (
                    <Link to="/app/traceability/batch/new">
                      <Button>Register Batch</Button>
                    </Link>
                  )}
                </Card>
              </motion.div>
            ) : (
              filteredProducts.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-green-500">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Leaf className="text-green-600" size={28} />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Batch: {product.batch} • Farmer: {product.farmer}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.status === "Delivered" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                          product.status === "In Transit" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}>
                          {product.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.completedStages}/{product.totalStages} stages
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowQrModal(product.id)}
                          className="flex items-center gap-2"
                        >
                          <QrCode size={16} /> Generate QR
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </AnimatePresence>

        {/* QR Modal */}
        <AnimatePresence>
          {showQrModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm w-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">QR Code for Product</h2>
                  <button onClick={() => setShowQrModal(null)} className="text-gray-500 hover:text-gray-700">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex justify-center mb-6">
                  <QRCodeCanvas
  id={`qr-canvas-${showQrModal}`}
  value={mockProducts.find(p => p.id === showQrModal)?.qrUrl || ""}
  size={256}
  className="p-4 bg-white rounded-lg shadow-inner"
/>

                </div>
                <Button
                  onClick={() => downloadQR(showQrModal)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Download QR
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Public Scanner CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Card className="p-8 text-center bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-800">
            <QrCode className="mx-auto text-green-600 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Verify Any Product
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Scan a QR code on packaging or enter product ID to view full blockchain-verified journey.
            </p>
            <Link to="/app/traceability/verify">
              <Button size="lg" className="flex items-center gap-2 mx-auto">
                <QrCode size={18} /> Verify Product Now
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}