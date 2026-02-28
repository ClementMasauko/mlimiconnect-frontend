import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  CheckCircle,
  Clock,
  Truck,
  Sprout,
  ShieldCheck,
  Plus,
  Calendar,
  Hash,
  Leaf,
  Scale,
  PackageSearch,
  Globe,
} from "lucide-react";

const mockBatch = {
  batchId: "BATCH-MZ-2025-06",
  product: "Yellow Maize",
  quantity: "1200 kg",
  startDate: "2025-01-10",
  status: "Growing",
  blockchainHash: "0x7b9f...e3d1a2c",
  smartContractAddress: "0x1234...abcd5678",
  stagesCompleted: 3,
  stagesTotal: 8,
  events: [
    { stage: "Seed Selection & Certification", date: "2025-01-10", completed: true, notes: "Certified seeds from Malawi Seed Co." },
    { stage: "Soil Preparation", date: "2025-01-12", completed: true, notes: "Organic compost applied" },
    { stage: "Planting", date: "2025-01-15", completed: true, notes: "GPS-mapped rows" },
    { stage: "Irrigation & Watering", date: "Ongoing", completed: false, notes: "Drip irrigation system" },
    { stage: "Pest & Disease Monitoring", date: "2025-04-05", completed: false, notes: "Organic pest control planned" },
    { stage: "Fertilizing", date: "2025-02-20", completed: false, notes: "Natural fertilizers" },
    { stage: "Harvesting", date: "Expected: 2025-06-10", completed: false, notes: "Manual harvest" },
    { stage: "Post-Harvest Processing", date: "Expected: 2025-06-12", completed: false, notes: "Drying and storage" },
  ],
};

export default function BatchTraceability() {
  const { batchId } = useParams();

  // Add Event Modal State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ stage: "", date: "", notes: "" });

  const addEvent = () => {
    // In real app: POST /api/traceability/events/ with batchId and newEvent
    alert("Event added! (Mock)");
    setShowAddEvent(false);
    setNewEvent({ stage: "", date: "", notes: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            to="/app/traceability"
            className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2"
          >
            ← Back to Traceability
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            Batch {batchId}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {mockBatch.product} • {mockBatch.quantity}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <Card className="lg:col-span-2 p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <Calendar className="text-green-600" size={24} /> Batch Journey
            </h2>

            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {mockBatch.events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-6 mb-8"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-4 border-white dark:border-gray-950 ${
                        event.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <CheckCircle size={24} /> {/* Generic for demo */}
                    </div>

                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.stage}</h3>
                        {event.completed ? (
                          <CheckCircle className="text-green-600" size={20} />
                        ) : (
                          <Clock className="text-amber-600" size={20} />
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar size={16} />
                        <span>{event.date}</span>
                      </div>

                      {event.notes && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm italic">
                          {event.notes}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Add Event Button */}
            <Button
              onClick={() => setShowAddEvent(true)}
              className="mt-6 w-full sm:w-auto"
            >
              <Plus size={16} className="mr-2" /> Add Event
            </Button>
          </Card>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Batch Summary</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className="font-medium">{mockBatch.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Progress:</span>
                  <span className="font-medium">
                    {mockBatch.stagesCompleted}/{mockBatch.stagesTotal} stages
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Start Date:</span>
                  <span className="font-medium">{mockBatch.startDate}</span>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Blockchain Hash:</p>
                  <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {mockBatch.blockchainHash}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Smart Contract:</p>
                  <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1 break-all">
                    {mockBatch.smartContractAddress}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl font-bold mb-4">Add Supply Chain Event</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stage</label>
                  <input
                    placeholder="e.g. Harvesting"
                    value={newEvent.stage}
                    onChange={(e) => setNewEvent({ ...newEvent, stage: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea
                    placeholder="Additional details..."
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowAddEvent(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={addEvent}
                  disabled={!newEvent.stage || !newEvent.date}
                >
                  Save Event
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}