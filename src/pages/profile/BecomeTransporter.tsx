// src/pages/profile/BecomeTransporter.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Truck, FileText, Upload } from "lucide-react";

export default function BecomeTransporter() {
  const [form, setForm] = useState({
    vehicleType: "",
    capacity: "",
    license: null as File | null,
  });

  const submit = () => {
    alert("Transporter verification submitted! (Mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Become a Verified Transporter</h1>
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <label className="block mb-2">Vehicle Type</label>
            <input value={form.vehicleType} onChange={e => setForm({...form, vehicleType: e.target.value})} placeholder="e.g. Truck 5-ton" className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block mb-2">Capacity</label>
            <input value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} placeholder="e.g. 5000 kg" className="w-full p-3 border rounded" />
          </div>
          <div>
            <label className="block mb-2">Driver License / Vehicle Docs</label>
            <input type="file" onChange={e => setForm({...form, license: e.target.files?.[0] || null})} />
          </div>
          <Button onClick={submit}>Submit for Verification</Button>
        </div>
      </Card>
    </div>
  );
}