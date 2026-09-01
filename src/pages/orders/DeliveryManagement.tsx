import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import api, { getApiError } from "../../lib/api";
import AddressSearch from "../../components/AddressSearch";
import type { AddressSelection } from "../../components/AddressSearch";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

type Delivery = {
  id: number; status: string; pickup_location: string; delivery_location: string;
  distance_km: string; delivery_fee: string; liability_rule: string; transporter: string | null;
  quotes: Array<{ id: number; transporter: string; amount: string; estimated_hours: number; status: string }>;
  locations: Array<{ latitude: string; longitude: string; status_note: string; created_at: string }>;
};

export default function DeliveryManagement() {
  const { orderId } = useParams();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [error, setError] = useState("");
  const [pickup, setPickup] = useState<AddressSelection | null>(null);
  const [destination, setDestination] = useState<AddressSelection | null>(null);

  const load = () => api.get<Delivery | null>(`/api/deliveries/requests/?order_id=${orderId}`)
    .then(response => { setDelivery(response.data); setError(""); })
    .catch(requestError => setError(getApiError(requestError, "Delivery information could not be loaded.")));
  useEffect(() => { void load(); }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const requestQuotes = async () => {
    setError("");
    if (!pickup || !destination) { setError("Search for and confirm both the pickup and delivery locations."); return; }
    try {
      await api.post("/api/deliveries/requests/", { order_id: orderId, pickup_selection_token: pickup.selection_token, delivery_selection_token: destination.selection_token });
      await load();
    } catch (requestError) { setError(getApiError(requestError, "Delivery request could not be created.")); }
  };
  const accept = async (id: number) => { try { await api.patch(`/api/deliveries/${delivery?.id}/quotes/`, { quote_id: id, accept_liability: true }); await load(); } catch (requestError) { setError(getApiError(requestError, "Quotation could not be accepted.")); } };
  const rate = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { await api.post(`/api/deliveries/${delivery?.id}/rating/`, Object.fromEntries(new FormData(event.currentTarget))); } catch (requestError) { setError(getApiError(requestError, "Rating could not be saved.")); } };

  return <div className="mx-auto max-w-5xl p-4 py-8">
    <h1 className="text-3xl font-black">Delivery for order #{orderId}</h1>
    {error && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-red-800">{error}</p>}
    {!delivery ? <Card className="mt-6 p-6">
      <h2 className="text-xl font-bold">Request transporter quotations</h2>
      <p className="mt-2 text-sm text-slate-600">Search for each location, inspect the result and explicitly confirm the correct place. The route distance is estimated from the confirmed coordinates.</p>
      <div className="mt-5 space-y-4"><AddressSearch label="Pickup location" onSelect={setPickup} /><AddressSearch label="Delivery location" onSelect={setDestination} /><Button type="button" onClick={() => void requestQuotes()} disabled={!pickup || !destination}>Open bidding</Button></div>
    </Card> : <>
      <Card className="mt-6 p-6"><strong className="capitalize">{delivery.status.replaceAll("_", " ")}</strong><p className="mt-2">{delivery.pickup_location} → {delivery.delivery_location}</p><p className="mt-1 text-sm">Estimated straight-line distance: {delivery.distance_km} km</p><p className="text-sm">Current fee: MWK {delivery.delivery_fee} · {delivery.transporter || "Awaiting transporter"}</p><p className="mt-2 text-sm text-slate-500">Liability: {delivery.liability_rule}</p><p className="mt-3 text-xs"><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">Location data © OpenStreetMap contributors</a></p></Card>
      <h2 className="mt-7 text-2xl font-bold">Transporter bids</h2>
      <div className="mt-3 space-y-3">{delivery.quotes.map(quote => <Card key={quote.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><strong>{quote.transporter} · MWK {quote.amount}</strong><p className="text-sm">About {quote.estimated_hours} hours · {quote.status}</p></div>{quote.status === "pending" && <Button onClick={() => void accept(quote.id)}>Accept and agree to liability</Button>}</Card>)}</div>
      {delivery.locations.length > 0 && <Card className="mt-7 p-6"><h2 className="text-xl font-bold">Location history</h2>{delivery.locations.map((location, index) => <p key={index} className="mt-2 text-sm">{location.latitude}, {location.longitude} · {location.status_note} · {new Date(location.created_at).toLocaleString()}</p>)}</Card>}
      {delivery.status === "delivered" && <Card className="mt-7 p-6"><h2 className="text-xl font-bold">Rate transporter</h2><form onSubmit={rate} className="mt-3 flex gap-2"><select name="score" className="rounded border p-2">{[5, 4, 3, 2, 1].map(score => <option key={score} value={score}>{score} stars</option>)}</select><input name="comment" placeholder="Delivery feedback" className="w-full rounded border p-2" /><Button type="submit">Submit rating</Button></form></Card>}
    </>}
  </div>;
}
