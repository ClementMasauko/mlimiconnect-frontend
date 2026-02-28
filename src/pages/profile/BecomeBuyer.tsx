import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Briefcase, Building, MapPin, FileText, Upload, ShoppingBag, CheckCircle, Mic, MicOff, Loader2 } from "lucide-react";

export default function BecomeBuyer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: "individual",
    companyName: "",
    location: "",
    preferredCrops: "",
    businessRegistration: null as File | null,
    profilePhoto: null as File | null,
  });

  // Voice input states
  const [listeningField, setListeningField] = useState<"location" | "crops" | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
      setMicSupported(false);
      return;
    }

    recognition.lang = "ny-MW"; // Chichewa first
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (listeningField === "location") {
        setFormData((prev) => ({ ...prev, location: transcript }));
      } else if (listeningField === "crops") {
        setFormData((prev) => ({ ...prev, preferredCrops: transcript }));
      }
      stopListening();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") setPermissionDenied(true);
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningField(null);
    };

    return () => recognition?.abort();
  }, [listeningField]);

  const startListening = (field: "location" | "crops") => {
    if (!micSupported) {
      alert("Voice input not supported in this browser.");
      return;
    }
    if (permissionDenied) {
      alert("Microphone permission denied. Please enable it in browser settings.");
      return;
    }

    setListeningField(field);
    setIsListening(true);
    // recognition?.start(); // Uncomment if you have recognition defined globally or pass it
  };

  const stopListening = () => {
    // recognition?.stop(); // Uncomment if needed
    setIsListening(false);
    setListeningField(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "businessRegistration" | "profilePhoto") => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const submit = () => {
    alert("Buyer profile verification request submitted! (Mock)");
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
            <ShoppingBag className="text-green-600" size={32} /> Become a Verified Buyer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Set up your buyer profile to access bulk purchasing, direct farmer connections, and traceability features.
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
          {/* Progress Steps */}
          <div className="flex justify-between mb-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= i
                    ? "bg-green-600 text-white ring-2 ring-green-300 dark:ring-green-500/50"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Buyer Type</label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                >
                  <option value="individual">Individual / Household Buyer</option>
                  <option value="restaurant">Restaurant / Hotel</option>
                  <option value="wholesaler">Wholesaler / Market Vendor</option>
                  <option value="exporter">Exporter / Processor</option>
                  <option value="institution">Institution (School, NGO, Hospital)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.businessType === "individual" ? "Full Name" : "Business / Organization Name"}
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder={
                    formData.businessType === "individual"
                      ? "e.g. Alick Mwale"
                      : "e.g. Lilongwe Fresh Foods Ltd"
                  }
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Main Location / City</span>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() =>
                        isListening && listeningField === "location"
                          ? stopListening()
                          : startListening("location")
                      }
                      className={`p-2 rounded-full transition-colors ${
                        isListening && listeningField === "location"
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "hover:bg-green-100 text-green-600"
                      }`}
                      aria-label="Voice input for location"
                    >
                      {isListening && listeningField === "location" ? (
                        <MicOff size={20} />
                      ) : (
                        <Mic size={20} />
                      )}
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Lilongwe, Blantyre, Mzuzu"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                />
                {isListening && listeningField === "location" && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Listening...
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                  <span>Preferred Crops / Products (comma separated)</span>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() =>
                        isListening && listeningField === "crops"
                          ? stopListening()
                          : startListening("crops")
                      }
                      className={`p-2 rounded-full transition-colors ${
                        isListening && listeningField === "crops"
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : "hover:bg-green-100 text-green-600"
                      }`}
                      aria-label="Voice input for preferred crops"
                    >
                      {isListening && listeningField === "crops" ? (
                        <MicOff size={20} />
                      ) : (
                        <Mic size={20} />
                      )}
                    </button>
                  )}
                </label>
                <textarea
                  name="preferredCrops"
                  value={formData.preferredCrops}
                  onChange={handleChange}
                  placeholder="e.g. Maize, Tomatoes, Onions, Beans, Irish Potatoes"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
                {isListening && listeningField === "crops" && (
                  <p className="text-sm text-green-600 mt-1 flex items-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> Listening...
                  </p>
                )}
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
                  <FileText size={20} /> Business Registration / ID Document
                  <span className="text-xs text-gray-500 dark:text-gray-400">(optional for individuals)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Upload certificate, business reg, or National ID
                  </p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "businessRegistration")}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="regUpload"
                  />
                  <label htmlFor="regUpload" className="cursor-pointer text-green-600 hover:underline">
                    Choose File
                  </label>
                  {formData.businessRegistration && (
                    <p className="mt-2 text-sm text-green-600">{formData.businessRegistration.name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                  <Building size={20} /> Profile Photo / Business Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Upload a clear photo or logo</p>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "profilePhoto")}
                    accept="image/*"
                    className="hidden"
                    id="logoUpload"
                  />
                  <label htmlFor="logoUpload" className="cursor-pointer text-green-600 hover:underline">
                    Choose Photo
                  </label>
                  {formData.profilePhoto && (
                    <p className="mt-2 text-sm text-green-600">{formData.profilePhoto.name}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 py-6" onClick={prevStep}>
                  Back
                </Button>
                <Button variant="primary" className="flex-1 py-6" onClick={nextStep}>
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Buyer Verification Request Sent!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Our team will review your information within 2–5 business days. You’ll get a notification once approved — then you can start browsing and ordering directly from farmers.
              </p>
              <Button variant="primary" size="lg" asChild>
                <Link to="/app/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          )}
        </Card>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Need help? Visit <Link to="/app/help" className="text-green-600 hover:underline">Help Center</Link>
        </p>
      </div>
    </div>
  );
}