// src/pages/orders/FileDispute.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { AlertTriangle, Send } from "lucide-react";

export default function FileDispute() {
  const { id } = useParams();
  const [reason, setReason] = useState("");

  const submit = () => {
    // POST /api/marketplace/orders/{id}/dispute/ { reason }
    alert("Dispute filed! Admin will review. (Mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">File Dispute for Order #{id}</h1>
      <Card className="p-6 max-w-md mx-auto">
        <div className="space-y-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto text-red-600 mb-4" size={48} />
            <p className="text-gray-600">Explain the issue in detail. Admin will review within 24 hours.</p>
          </div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={6}
            placeholder="Describe the problem (e.g. product not as described, delivery issue)..."
            className="w-full px-4 py-3 border rounded-lg"
          />
          <Button className="w-full" onClick={submit} disabled={!reason.trim()}>
            <Send size={16} className="mr-2" /> Submit Dispute
          </Button>
        </div>
      </Card>
    </div>
  );
}