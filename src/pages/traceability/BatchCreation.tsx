// src/pages/traceability/BatchCreation.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Leaf, Save, Calendar, MapPin } from "lucide-react";

export default function BatchCreation() {
  const [form, setForm] = useState({
    product: "",
    quantity: "",
    startDate: "",
    notes: "",
  });

  const submit = () => {
    // POST /api/traceability/products/
    alert("Batch registered! ID: BATCH-NEW-001 (Mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Register New Batch</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block mb-2">Product</label>
            <input value={form.product} onChange={e => setForm({...form, product: e.target.value})} placeholder="e.g. Maize" className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block mb-2">Quantity</label>
            <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="e.g. 1000 kg" className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block mb-2">Start Date</label>
            <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block mb-2">Initial Notes</label>
            <textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={4} className="w-full p-3 border rounded" />
          </div>
          <Button className="w-full" onClick={submit}><Save className="mr-2" /> Register Batch</Button>
        </div>
      </Card>
    </div>
  );
}