// src/pages/advisory/ExpertConnect.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Calendar, User, Clock, Video } from "lucide-react";

const mockExperts = [
  { id: 1, name: "Dr. Jane Agronomist", specialty: "Crop Health & Pests", available: "Today 2-4 PM" },
  { id: 2, name: "Mr. John Market Expert", specialty: "Pricing & Sales", available: "Tomorrow 10 AM" },
];

export default function ExpertConnect() {
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [slot, setSlot] = useState("");

  const book = () => {
    alert("Consultation booked! (Mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Expert Consultations</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockExperts.map(expert => (
            <Card key={expert.id} className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <User size={48} className="text-green-600" />
                <div>
                  <h3 className="text-xl font-semibold">{expert.name}</h3>
                  <p className="text-gray-600">{expert.specialty}</p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Clock size={16} /> Available: {expert.available}
              </p>
              <Button onClick={() => setSelectedExpert(expert.id)}>Book Now</Button>
            </Card>
          ))}
        </div>
        {selectedExpert && (
          <Card className="mt-8 p-6">
            <h2 className="text-2xl font-semibold mb-4">Book Slot</h2>
            <input
              type="datetime-local"
              value={slot}
              onChange={e => setSlot(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <Button className="mt-4 w-full" onClick={book}>
              <Video size={16} className="mr-2" /> Confirm Video Call
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}