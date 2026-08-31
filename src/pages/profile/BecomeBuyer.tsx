// src/pages/profile/BecomeBuyer.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toast } from "react-hot-toast";
import {
  Briefcase,
  Building,
  MapPin,
  FileText,
  Upload,
  ShoppingBag,
  CheckCircle,
  Mic,
  MicOff,
  Loader2,
  ArrowLeft,
  X,
  FileCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function BecomeBuyer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessType: "individual",
    companyName: "",
    location: "",
    preferredCrops: "",
    businessRegistration: null as File | null,
    profilePhoto: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Voice input states
  const [listeningField, setListeningField] = useState<"location" | "crops" | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
      setMicSupported(false);
      return;
    }

    recognition.lang = "ny-MW"; // Chichewa (Malawi) / English hybrid
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (listeningField === "location") {
        setFormData((prev) => ({ ...prev, location: transcript }));
        toast.success(`Voice input recognized: "${transcript}"`);
      } else if (listeningField === "crops") {
        setFormData((prev) => ({ ...prev, preferredCrops: transcript }));
        toast.success(`Voice input recognized: "${transcript}"`);
      }
      toast.dismiss("voice-toast");
      setIsListening(false);
      setListeningField(null);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech Error:", event.error);
      if (event.error === "not-allowed") setPermissionDenied(true);
      toast.dismiss("voice-toast");
      setIsListening(false);
      setListeningField(null);
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningField(null);
    };

    return () => recognition?.abort();
  }, [listeningField]);

  const startListening = (field: "location" | "crops") => {
    if (!micSupported) {
      toast.error("Voice input not supported in this browser.");
      return;
    }
    if (permissionDenied) {
      toast.error("Microphone permission denied. Enable it in browser settings.");
      return;
    }

    setListeningField(field);
    setIsListening(true);
    toast.loading("Listening (Chichewa/English)... Speaks now!", { id: "voice-toast" });

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) throw new Error("Speech recognition is unavailable.");
      const rec = new SpeechRecognition();
      rec.lang = "ny-MW";
      rec.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    toast.dismiss("voice-toast");
    setIsListening(false);
    setListeningField(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "businessRegistration" | "profilePhoto") => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
      toast.success(`${field === "profilePhoto" ? "Logo" : "Registration ID"} uploaded!`);
    }
  };

  const removeFile = (field: "businessRegistration" | "profilePhoto") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    toast.success("File removed.");
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      newErrors.companyName = formData.businessType === "individual" ? "Full Name is required" : "Business Name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Main location/city is required";
    }
    if (!formData.preferredCrops.trim()) {
      newErrors.preferredCrops = "Preferred commodities are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const submit = () => {
    toast.success("Verification request submitted successfully!");
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div>
          <Link
            to="/app/profile"
            className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Profile
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-emerald-600" size={32} /> Become a Verified Buyer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete verification credentials to gain wholesale access, priority smart contracts, and full traceability datasets
          </p>
        </div>

        {/* Progress Bar / Steps indicator */}
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 pointer-events-none" />
          <div className="relative flex justify-between">
            {[
              { label: "Business Details", desc: "Type & Location" },
              { label: "Credentials", desc: "Upload Documentation" },
              { label: "Verification Status", desc: "Reviewing Process" },
            ].map((s, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isCompleted = step > num;

              return (
                <div key={num} className="flex flex-col items-center z-10 text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                      isActive
                        ? "bg-emerald-600 text-white ring-4 ring-emerald-500/20"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={18} /> : num}
                  </div>
                  <p className={`text-xs font-bold mt-2 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}>{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <Card className="p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 rounded-2xl">
          
          {step === 1 && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">Buyer Profile Type</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm rounded-xl outline-none transition-all duration-150"
                  >
                    <option value="individual">Individual Buyer / Household</option>
                    <option value="restaurant">Restaurant, Caterer or Hotel</option>
                    <option value="wholesaler">Agricultural Wholesaler / Market Vendor</option>
                    <option value="exporter">Exporter / Bulk Processor</option>
                    <option value="institution">Institutional (School, Cooperative, NGO)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase">
                    {formData.businessType === "individual" ? "Full Personal Name *" : "Registered Entity Name *"}
                  </label>
                  <Input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    error={errors.companyName}
                    placeholder={formData.businessType === "individual" ? "e.g. Alick Mwale" : "e.g. Lilongwe Foods Cooperative"}
                  />
                </div>
              </div>

              {/* Location Input with voice support */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600" /> Main Business Location / Depot *
                  </label>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => (isListening && listeningField === "location" ? stopListening() : startListening("location"))}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-colors ${
                        isListening && listeningField === "location"
                          ? "bg-red-500 text-white border-red-500 animate-pulse"
                          : "bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-950/40"
                      }`}
                    >
                      {isListening && listeningField === "location" ? <MicOff size={12} /> : <Mic size={12} />}
                      {isListening && listeningField === "location" ? "Stop Voice" : "Chichewa Voice Input"}
                    </button>
                  )}
                </div>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                  placeholder="e.g. Lilongwe Area 18, near Central Depot"
                />
                {isListening && listeningField === "location" && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 animate-pulse font-semibold">
                    <Loader2 className="animate-spin" size={12} /> Speak location (e.g. "Zomba town center")
                  </div>
                )}
              </div>

              {/* Crop Targets with Voice input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-600" /> Commodities of Interest *
                  </label>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => (isListening && listeningField === "crops" ? stopListening() : startListening("crops"))}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-colors ${
                        isListening && listeningField === "crops"
                          ? "bg-red-500 text-white border-red-500 animate-pulse"
                          : "bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-950/40"
                      }`}
                    >
                      {isListening && listeningField === "crops" ? <MicOff size={12} /> : <Mic size={12} />}
                      {isListening && listeningField === "crops" ? "Stop Voice" : "Chichewa Voice Input"}
                    </button>
                  )}
                </div>
                <textarea
                  name="preferredCrops"
                  value={formData.preferredCrops}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:text-white outline-none text-sm transition-all ${
                    errors.preferredCrops ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700/80"
                  }`}
                  placeholder="e.g. Maize, Soybean, Groundnuts, Irish Potatoes"
                />
                {errors.preferredCrops && <p className="text-red-500 text-xs mt-1">{errors.preferredCrops}</p>}
                {isListening && listeningField === "crops" && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 animate-pulse font-semibold">
                    <Loader2 className="animate-spin" size={12} /> Speak commodities (e.g. "Chitowe ndi Chimanga")
                  </div>
                )}
              </div>

              <Button variant="primary" className="w-full py-4 text-base font-bold shadow-lg shadow-emerald-600/10" onClick={nextStep}>
                Continue to Documentation <ChevronRight size={16} className="ml-1 inline" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              
              {/* Document registration file */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                  <FileText size={16} className="text-emerald-600" /> Business License or Government National ID *
                </label>
                
                {formData.businessRegistration ? (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/10 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="text-emerald-600" size={24} />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.businessRegistration.name}</p>
                        <p className="text-xs text-gray-400">{(formData.businessRegistration.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile("businessRegistration")} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/30 dark:bg-gray-900/10">
                    <Upload className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={32} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Upload Certificate of Incorporation or ID card</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">PDF, PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "businessRegistration")}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="regUpload"
                    />
                    <label htmlFor="regUpload" className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-200/40">
                      Choose Document
                    </label>
                  </div>
                )}
              </div>

              {/* Logo upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                  <Building size={16} className="text-emerald-600" /> Profile Photo or Cooperative Brand Logo
                </label>

                {formData.profilePhoto ? (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/10 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building className="text-emerald-600" size={24} />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.profilePhoto.name}</p>
                        <p className="text-xs text-gray-400">{(formData.profilePhoto.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile("profilePhoto")} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/30 dark:bg-gray-900/10">
                    <Upload className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={32} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Upload profile photograph or brand logo</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "profilePhoto")}
                      accept="image/*"
                      className="hidden"
                      id="logoUpload"
                    />
                    <label htmlFor="logoUpload" className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-200/40">
                      Choose Photo
                    </label>
                  </div>
                )}
              </div>

              {/* Form operations */}
              <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-800/80">
                <Button variant="outline" className="flex-1 py-4" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 py-4 shadow-lg shadow-emerald-600/10" 
                  onClick={submit}
                  disabled={!formData.businessRegistration}
                >
                  Submit for Verification
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
              <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle size={40} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Buyer Review Requested!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Our regional operations board reviews licensing credentials within 48 business hours. You'll receive instant notification in your Inbox once approved!
                </p>
              </div>
              
              <div className="max-w-md mx-auto p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500">Next Steps:</h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">🟢 Access temporary read-only marketplace catalog</li>
                  <li className="flex items-center gap-2">🟢 Learn crop quality verification parameters</li>
                  <li className="flex items-center gap-2">🟢 Setup your mobile wallet payment preferences</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button variant="primary" size="lg" onClick={() => navigate("/app/dashboard")} className="shadow-lg shadow-emerald-600/10">
                  Return to Dashboard
                </Button>
              </div>
            </div>
          )}
        </Card>
        
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          Need operational support? Browse our <Link to="/app/help" className="text-emerald-600 hover:underline">Help & Guides Guide</Link>
        </p>
      </div>
    </div>
  );
}
