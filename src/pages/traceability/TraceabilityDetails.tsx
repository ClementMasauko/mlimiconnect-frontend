// src/pages/traceability/TraceabilityDetails.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import { CheckCircle, Clock, Truck, Sprout, ShieldCheck, MapPin, Calendar, Hash, User, Leaf, Scale, PackageSearch } from "lucide-react";

const mockJourney = {
  productId: "PRD-4782",
  name: "Yellow Maize (50kg)",
  batchId: "BATCH-MZ-2025-06",
  blockchainHash: "0x4a8f...c9d2e1f",
  smartContractAddress: "0x1234...abcd5678", // Mock
  stages: [
    { stage: "Seed Selection & Certification", date: "2025-01-10", location: "Mchinji Farm", completed: true, icon: Sprout, notes: "Certified organic seeds from Malawi Seed Co." },
    { stage: "Planting", date: "2025-01-15", location: "Mchinji Farm", completed: true, icon: Sprout, notes: "Planted with GPS mapping for precision" },
    { stage: "Growing & Monitoring", date: "2025-03-20", location: "Mchinji Farm", completed: true, icon: Leaf, notes: "Organic pest control and IoT soil monitoring" },
    { stage: "Fertilizing", date: "2025-04-05", location: "Mchinji Farm", completed: true, icon: Leaf, notes: "Natural compost applied" },
    { stage: "Harvesting", date: "2025-06-10", location: "Mchinji Farm", completed: true, icon: CheckCircle, notes: "Hand-harvested at peak maturity" },
    { stage: "Quality Check & Grading", date: "2025-06-12", location: "Lilongwe Center", completed: false, icon: Scale, notes: "Pending moisture & quality test" },
    { stage: "Packaging & Labeling", date: "Expected: 2025-06-14", location: "Lilongwe Center", completed: false, icon: PackageSearch, notes: "QR code labeling" },
    { stage: "Transportation & Delivery", date: "Expected: 2025-06-15", location: "Lilongwe Market", completed: false, icon: Truck, notes: "GPS-tracked delivery" },
  ],
  currentStatus: "In Transit",
  verifiedOnChain: true,
};

export default function TraceabilityDetails() {
  const { productId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/app/traceability" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2">
            ← Back to Traceability
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mt-2">
            <ShieldCheck className="text-green-600" size={32} /> Product Traceability
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Full journey of {mockJourney.name} (ID: {productId})
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <Card className="lg:col-span-2 p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Calendar className="text-green-600" size={24} /> Journey Timeline
            </h2>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {mockJourney.stages.map((stage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-6 mb-8"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-gray-950 ${
                      stage.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      <stage.icon size={24} />
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{stage.stage}</h3>
                        {stage.completed ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <Clock className="text-amber-600" size={20} />
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gray-500" />
                          <span>{stage.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span>{stage.date}</span>
                        </div>
                      </div>

                      {stage.notes && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm italic">
                          {stage.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-green-600" size={22} /> Blockchain Verification
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className="font-medium text-green-700 dark:text-green-400">{mockJourney.currentStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Verified on Chain:</span>
                  <span className="font-medium text-green-700 dark:text-green-400">
                    {mockJourney.verifiedOnChain ? "Yes" : "Pending"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Transaction Hash:</p>
                  <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {mockJourney.blockchainHash}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Smart Contract:</p>
                  <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {mockJourney.smartContractAddress}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Smart Contract Mock (commented for real integration) */}
        {/* 
        // Real blockchain integration (Polygon testnet)
        // Install: npm install web3
        // import Web3 from "web3";
        // const web3 = new Web3("https://rpc-mumbai.maticvigil.com");
        // const contract = new web3.eth.Contract(ABI, mockJourney.smartContractAddress);
        // const verify = await contract.methods.verifyBatch(mockJourney.batchId).call();
        */}
      </div>
    </div>
  );
}