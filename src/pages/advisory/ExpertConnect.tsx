// src/pages/advisory/ExpertConnect.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Calendar, User, Clock, Video } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getAdvisoryAccess } from "../../lib/access";
import api, { getApiError } from "../../lib/api";

const mockExperts = [
  { id: 1, name: "Dr. Jane Agronomist", specialty: "Crop Health & Pests", available: "Today 2-4 PM" },
  { id: 2, name: "Mr. John Market Expert", specialty: "Pricing & Sales", available: "Tomorrow 10 AM" },
];

export default function ExpertConnect() {
  const { user } = useAuth();
  const access = getAdvisoryAccess(user);
  const [selectedExpert, setSelectedExpert] = useState<number | null>(null);
  const [slot, setSlot] = useState("");

  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const book = async () => {
    if (!selectedExpert || !slot) return;
    setBusy(true); setStatus("");
    try { await api.post("/api/advisory/expert-consultations/", { expert_id: selectedExpert, starts_at: new Date(slot).toISOString() }); setStatus("Consultation request submitted. You will receive confirmation after the expert accepts it."); }
    catch (reason) { setStatus(getApiError(reason, "We could not request this consultation.")); }
    finally { setBusy(false); }
  };

  if (!access.expertConsultations) return <div className="mx-auto max-w-2xl py-8"><Card className="p-6 text-center"><User className="mx-auto text-green-700" size={44} /><h1 className="mt-4 text-2xl font-bold">Expert consultations are a managed service</h1><p className="mt-2 text-slate-600 dark:text-slate-300">AI advisory remains available on Free. Live experts are included with Farmer Plus, Cooperative, Organization and Enterprise plans so consultations can be scheduled responsibly.</p><Link to="/app/subscription"><Button className="mt-5">Compare advisory plans</Button></Link></Card></div>;

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
            <Button className="mt-4 w-full" onClick={book} disabled={!slot || busy}>
              <Video size={16} className="mr-2" /> {busy ? "Requesting…" : "Request Video Call"}
            </Button>
            {status && <p role="status" className="mt-3 text-sm text-slate-600 dark:text-slate-300">{status}</p>}
          </Card>
        )}
      </div>
    </div>
  );
}
