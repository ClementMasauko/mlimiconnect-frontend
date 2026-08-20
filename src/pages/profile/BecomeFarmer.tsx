// src/pages/profile/BecomeFarmer.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { toast } from "react-hot-toast";
import {
  UserCheck,
  Upload,
  Leaf,
  MapPin,
  FileText,
  Mic,
  MicOff,
  Loader2,
  ArrowLeft,
  X,
  FileCheck,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Layers,
} from "lucide-react";

export default function BecomeFarmer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    farmSize: "",
    location: "",
    mainCrops: "",
    organicCertified: false,
    idDocument: null as File | null,
    farmPhoto: null as File | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Voice state
  const [listeningField, setListeningField] = useState<"location" | "crops" | "size" | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [micSupported, setMicSupported] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Web Speech API setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (!recognition) {
      setMicSupported(false);
      return;
    }

    recognition.lang = "ny-MW"; // Chichewa (Malawi)
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      if (listeningField === "location") {
        setFormData((prev) => ({ ...prev, location: transcript }));
        toast.success(`Voice recognized: "${transcript}"`);
      } else if (listeningField === "crops") {
        setFormData((prev) => ({ ...prev, mainCrops: transcript }));
        toast.success(`Voice recognized: "${transcript}"`);
      } else if (listeningField === "size") {
        const match = transcript.match(/(\d+(\.\d+)?)/);
        if (match) {
          setFormData((prev) => ({ ...prev, farmSize: match[1] }));
          toast.success(`Extracted size: ${match[1]} acres`);
        } else {
          setFormData((prev) => ({ ...prev, farmSize: transcript }));
          toast.success(`Voice recognized: "${transcript}"`);
        }
      }
      stopListening();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech Error:", event.error);
      if (event.error === "not-allowed") setPermissionDenied(true);
      stopListening();
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningField(null);
    };

    return () => recognition?.abort();
  }, [listeningField]);

  const startListening = (field: "location" | "crops" | "size") => {
    if (!micSupported) {
      toast.error("Voice input not supported in this browser.");
      return;
    }
    if (permissionDenied) {
      toast.error("Microphone permission was denied. Please enable it.");
      return;
    }

    setListeningField(field);
    setIsListening(true);
    toast.loading("Listening (Chichewa/English)...", { id: "voice-toast-farmer" });

    try {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = "ny-MW";
      rec.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const stopListening = () => {
    toast.dismiss("voice-toast-farmer");
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "idDocument" | "farmPhoto") => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
      toast.success(`${field === "farmPhoto" ? "Farm Photo" : "National ID"} uploaded!`);
    }
  };

  const removeFile = (field: "idDocument" | "farmPhoto") => {
    setFormData((prev) => ({ ...prev, [field]: null }));
    toast.success("File removed.");
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.farmSize.trim()) {
      newErrors.farmSize = "Farm size in acres is required";
    } else if (isNaN(Number(formData.farmSize))) {
      newErrors.farmSize = "Please enter a valid numeric value";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Farm location description is required";
    }

    if (!formData.mainCrops.trim()) {
      newErrors.mainCrops = "Main crops are required";
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
            <UserCheck className="text-emerald-600" size={32} /> Become a Verified Farmer
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Build your professional farming credentials, list high-quality organic produce, and join Malawi's direct-bidding networks
          </p>
        </div>

        {/* Steps progress indicator */}
        <div className="relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 pointer-events-none" />
          <div className="relative flex justify-between">
            {[
              { label: "Farm Scope", desc: "Sizing & Commodities" },
              { label: "Credentials", desc: "Upload Verification" },
              { label: "Verification Status", desc: "Operations Review" },
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

        {/* Form Card wrapper */}
        <Card className="p-6 md:p-8 shadow-xl border border-gray-100 dark:border-gray-800 rounded-2xl">
          
          {step === 1 && (
            <div className="space-y-6">
              
              {/* Farm Size with Voice support */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                    <Layers size={14} className="text-emerald-600" /> Farm Area (Acres) *
                  </label>
                  {micSupported && (
                    <button
                      type="button"
                      onClick={() => (isListening && listeningField === "size" ? stopListening() : startListening("size"))}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border cursor-pointer transition-colors ${
                        isListening && listeningField === "size"
                          ? "bg-red-500 text-white border-red-500 animate-pulse"
                          : "bg-emerald-50/50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-950/40"
                      }`}
                    >
                      {isListening && listeningField === "size" ? <MicOff size={12} /> : <Mic size={12} />}
                      {isListening && listeningField === "size" ? "Stop Voice" : "Chichewa Voice Input"}
                    </button>
                  )}
                </div>
                <Input
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleChange}
                  error={errors.farmSize}
                  placeholder="e.g. 5.5"
                />
                {isListening && listeningField === "size" && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 animate-pulse font-semibold">
                    <Loader2 className="animate-spin" size={12} /> Speak number of acres (e.g. "Maekala khumi")
                  </div>
                )}
              </div>

              {/* Farm Location with Voice support */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600" /> Farm Location Description *
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
                  placeholder="e.g. Nathenje, 15km south of Lilongwe"
                />
                {isListening && listeningField === "location" && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 animate-pulse font-semibold">
                    <Loader2 className="animate-spin" size={12} /> Speak location (e.g. "Mponela, Dowa")
                  </div>
                )}
              </div>

              {/* Commodities with Voice input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                    <Sparkles size={14} className="text-emerald-600" /> Principal Crops Grown *
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
                  name="mainCrops"
                  value={formData.mainCrops}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl dark:bg-gray-800 dark:text-white outline-none text-sm transition-all ${
                    errors.mainCrops ? "border-red-500 focus:ring-red-500/20" : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-gray-700/80"
                  }`}
                  placeholder="e.g. White Maize, Pigeon Peas, Groundnuts, Soya"
                />
                {errors.mainCrops && <p className="text-red-500 text-xs mt-1">{errors.mainCrops}</p>}
                {isListening && listeningField === "crops" && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500 animate-pulse font-semibold">
                    <Loader2 className="animate-spin" size={12} /> Speak main crops (e.g. "Mtedza ndi Nandolo")
                  </div>
                )}
              </div>

              {/* Organic Checkbox */}
              <div className="p-4 rounded-xl border border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/10 flex items-center gap-3">
                <input
                  type="checkbox"
                  name="organicCertified"
                  id="organicCertified"
                  checked={formData.organicCertified}
                  onChange={handleChange}
                  className="h-5 w-5 text-emerald-600 rounded-lg cursor-pointer accent-emerald-600 outline-none"
                />
                <label htmlFor="organicCertified" className="text-sm font-bold text-emerald-800 dark:text-emerald-400 cursor-pointer flex items-center gap-1.5">
                  <Leaf size={16} /> I am fully Organic Certified / Participating in cooperative standards
                </label>
              </div>

              <Button variant="primary" className="w-full py-4 text-base font-bold shadow-lg shadow-emerald-600/10" onClick={nextStep}>
                Continue to Documentation <ChevronRight size={16} className="ml-1 inline" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              
              {/* ID document upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                  <FileText size={16} className="text-emerald-600" /> National ID or Passport *
                </label>

                {formData.idDocument ? (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/10 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileCheck className="text-emerald-600" size={24} />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.idDocument.name}</p>
                        <p className="text-xs text-gray-400">{(formData.idDocument.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile("idDocument")} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/30 dark:bg-gray-900/10">
                    <Upload className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={32} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Upload a clear photo of your National ID Card</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">PNG, JPG or PDF up to 5MB</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "idDocument")}
                      accept="image/*,.pdf"
                      className="hidden"
                      id="idUpload"
                    />
                    <label htmlFor="idUpload" className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-200/40">
                      Choose Document
                    </label>
                  </div>
                )}
              </div>

              {/* Farm Photo upload */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1.5">
                  <MapPin size={16} className="text-emerald-600" /> Photo of Your Farm or Harvest Area
                </label>

                {formData.farmPhoto ? (
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/10 dark:border-emerald-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-emerald-600" size={24} />
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{formData.farmPhoto.name}</p>
                        <p className="text-xs text-gray-400">{(formData.farmPhoto.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button onClick={() => removeFile("farmPhoto")} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center bg-gray-50/30 dark:bg-gray-900/10">
                    <Upload className="mx-auto text-gray-300 dark:text-gray-700 mb-3" size={32} />
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Upload farm fields, storage area or harvest produce photo</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">PNG, JPG up to 5MB</p>
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, "farmPhoto")}
                      accept="image/*"
                      className="hidden"
                      id="farmUpload"
                    />
                    <label htmlFor="farmUpload" className="cursor-pointer bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-200/40">
                      Choose Photo
                    </label>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-gray-100 dark:border-gray-800/80">
                <Button variant="outline" className="flex-1 py-4" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 py-4 shadow-lg shadow-emerald-600/10" 
                  onClick={submit}
                  disabled={!formData.idDocument}
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
                  Farmer Request Submitted!
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Your verification documents are queued for verification by regional Ministry of Agriculture officers. You can expect approval within 2 business days.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-left space-y-3">
                <h4 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500">While you wait:</h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">🟢 Build your default catalog drafts in listing manager</li>
                  <li className="flex items-center gap-2">🟢 Learn crop recommendations inside Advisory Hub</li>
                  <li className="flex items-center gap-2">🟢 Link your Malawian Mobile Money wallet details</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button variant="primary" size="lg" onClick={() => navigate("/app/dashboard")} className="shadow-lg shadow-emerald-600/10">
                  Go to My Dashboard
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
