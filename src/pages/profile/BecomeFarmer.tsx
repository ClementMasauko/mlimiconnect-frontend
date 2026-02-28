// src/pages/profile/BecomeFarmer.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { UserCheck, Upload, Leaf, MapPin, FileText, Mic, MicOff, Loader2 } from "lucide-react";

export default function BecomeFarmer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    farmSize: "",
    location: "",
    mainCrops: "",
    organicCertified: false,
    idDocument: null as File | null,
    farmPhoto: null as File | null,
  });

  // Voice state
  const [listeningField, setListeningField] = useState<"location" | "crops" | "size" | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Web Speech API setup
  const SpeechRecognition =
    window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    if (!recognition) {
      setMicSupported(false);
      return;
    }

    // Prefer Chichewa (Malawi) if available, fallback to English
    recognition.lang = "ny-MW"; // Chichewa (Malawi) - fallback happens automatically in many browsers
    recognition.continuous = false; // One phrase at a time
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (listeningField === "location") {
        setFormData((prev) => ({ ...prev, location: transcript }));
      } else if (listeningField === "crops") {
        setFormData((prev) => ({ ...prev, mainCrops: transcript }));
      } else if (listeningField === "size") {
        // Try to extract number + "acres" or similar
        const match = transcript.match(/(\d+(\.\d+)?)\s*(acre|acres)?/i);
        if (match) {
          setFormData((prev) => ({ ...prev, farmSize: match[1] }));
        } else {
          setFormData((prev) => ({ ...prev, farmSize: transcript }));
        }
      }
      stopListening();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      if (event.error === "not-allowed") {
        setPermissionDenied(true);
      }
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningField(null);
    };

    return () => {
      if (recognition) recognition.abort();
    };
  }, [listeningField]);

  const startListening = (field: "location" | "crops" | "size") => {
    if (!micSupported) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (permissionDenied) {
      alert("Microphone permission was denied. Please enable it in browser settings.");
      return;
    }

    setListeningField(field);
    setIsListening(true);

    // Request mic permission implicitly by starting recognition
    recognition?.start();
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
    setListeningField(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "idDocument" | "farmPhoto") => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const submit = () => {
    alert("Verification request submitted! (Mock)");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            to="/app/profile"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <UserCheck className="text-green-600" size={32} /> Become a Verified Farmer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Complete your profile to start listing products. Use voice input for hands-free filling!
          </p>
        </div>

        {!micSupported && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300">
            Voice input is not supported in this browser. Please use text fields instead.
          </div>
        )}

        {permissionDenied && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
            Microphone permission denied. Please enable it in your browser settings to use voice input.
          </div>
        )}

        <Card className="p-6">
          {/* Progress */}
          <div className="flex justify-between mb-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= i ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Farm Size (acres)</span>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => (isListening && listeningField === "size" ? stopListening() : startListening("size"))}
                      className={`p-2 rounded-full transition-colors ${
                        isListening && listeningField === "size"
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "hover:bg-green-100 text-green-600"
                      }`}
                      aria-label="Voice input for farm size"
                    >
                      {isListening && listeningField === "size" ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  placeholder="e.g. 4.5"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {isListening && listeningField === "size" && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Listening...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Farm Location</span>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => (isListening && listeningField === "location" ? stopListening() : startListening("location"))}
                      className={`p-2 rounded-full transition-colors ${
                        isListening && listeningField === "location"
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "hover:bg-green-100 text-green-600"
                      }`}
                      aria-label="Voice input for location"
                    >
                      {isListening && listeningField === "location" ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lilongwe, Central Region"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                {isListening && listeningField === "location" && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Listening...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Main Crops (comma separated)</span>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => (isListening && listeningField === "crops" ? stopListening() : startListening("crops"))}
                      className={`p-2 rounded-full transition-colors ${
                        isListening && listeningField === "crops"
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "hover:bg-green-100 text-green-600"
                      }`}
                      aria-label="Voice input for crops"
                    >
                      {isListening && listeningField === "crops" ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                  )}
                </label>
                <textarea
                  name="mainCrops"
                  value={formData.mainCrops}
                  onChange={handleChange}
                  placeholder="e.g. Maize, Tomatoes, Groundnuts"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  rows={3}
                />
                {isListening && listeningField === "crops" && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Listening...
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="organicCertified"
                  checked={formData.organicCertified}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-600 rounded"
                />
                <label className="text-sm font-medium">I am Organic Certified</label>
              </div>

              <Button variant="primary" className="w-full py-6 text-lg" onClick={nextStep}>
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <FileText size={20} /> Upload ID Document (National ID / Passport)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Drag & drop or click to upload</p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "idDocument")}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="idUpload"
                  />
                  <label htmlFor="idUpload" className="cursor-pointer text-green-600 hover:underline">
                    Choose File
                  </label>
                  {formData.idDocument && <p className="mt-2 text-sm text-green-600">{formData.idDocument.name}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <MapPin size={20} /> Upload Photo of Your Farm
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Show your fields/crops</p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "farmPhoto")}
                    accept="image/*"
                    className="hidden"
                    id="farmUpload"
                  />
                  <label htmlFor="farmUpload" className="cursor-pointer text-green-600 hover:underline">
                    Choose Photo
                  </label>
                  {formData.farmPhoto && <p className="mt-2 text-sm text-green-600">{formData.farmPhoto.name}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 py-6" onClick={prevStep}>
                  Back
                </Button>
                <Button variant="primary" className="flex-1 py-6" onClick={submit}>
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Leaf size={48} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Verification Request Sent!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Our team will review your documents within 2-5 business days. You'll receive a notification once approved.
              </p>
              <Button variant="primary" asChild>
                <Link to="/app/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}