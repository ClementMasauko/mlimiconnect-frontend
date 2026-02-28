// src/pages/profile/BecomeTransporter.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Truck, FileText, Upload, CheckCircle, AlertCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function BecomeTransporter() {
  const [form, setForm] = useState({
    vehicleType: "",
    capacity: "",
    license: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.vehicleType.trim()) {
      newErrors.vehicleType = "Vehicle type is required";
    }
    if (!form.capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    }
    if (!form.license) {
      newErrors.license = "Please upload your license or vehicle documents";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, license: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearFile = () => {
    setForm({ ...form, license: null });
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("idle");

    if (!validateForm()) return;

    setLoading(true);

    // Simulate API call (replace with real fetch/axios later)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Mock success/failure (random for demo)
    const isSuccess = Math.random() > 0.3;
    setStatus(isSuccess ? "success" : "error");

    if (isSuccess) {
      // Reset form on success
      setForm({ vehicleType: "", capacity: "", license: null });
      setPreviewUrl(null);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
            <Truck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Become a Verified Transporter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join our trusted network of transporters. Bid on deliveries, earn competitive rates, and help farmers move their produce safely across Malawi.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-8 shadow-lg">
          {status === "success" ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Application Submitted!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Thank you! Our team will review your documents within 2–5 business days. You'll receive an email once approved.
              </p>
              <Button variant="outline" asChild>
                <Link to="/app/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          ) : status === "error" ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Something Went Wrong
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Please try again or contact support if the issue persists.
              </p>
              <Button variant="primary" onClick={() => setStatus("idle")}>
                Try Again
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Vehicle Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.vehicleType}
                  onChange={e => setForm({ ...form, vehicleType: e.target.value })}
                  placeholder="e.g. Isuzu NPR 5-ton Truck, Toyota Dyna, Tractor Trailer"
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.vehicleType ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.vehicleType && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.vehicleType}</p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Load Capacity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })}
                  placeholder="e.g. 5000 kg, 10 tons, 20 pallets"
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.capacity ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.capacity}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Driver License / Vehicle Registration / Insurance <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.license ? "border-red-500" : "border-gray-300 dark:border-gray-600 hover:border-blue-500"
                }`}>
                  {!previewUrl ? (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Drag & drop your documents or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG • Max 5MB
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        id="license-upload"
                      />
                      <label
                        htmlFor="license-upload"
                        className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                      >
                        Choose Files
                      </label>
                    </>
                  ) : (
                    <div className="space-y-4">
                      {previewUrl && (
                        <div className="relative inline-block">
                          <img
                            src={previewUrl}
                            alt="Document preview"
                            className="max-h-48 rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={clearFile}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {form.license?.name || "Selected file"}
                      </p>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm underline"
                      >
                        Remove file
                      </button>
                    </div>
                  )}
                </div>
                {errors.license && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.license}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full py-4 text-lg shadow-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </div>

              {/* Trust note */}
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Your documents are encrypted and reviewed securely. We never share your personal information.
              </p>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}