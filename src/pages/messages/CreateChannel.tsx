// src/pages/messages/CreateChannel.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Users, Plus, X, Image as ImageIcon, Lock, Globe, CheckCircle } from "lucide-react";

const cropOptions = [
  "Maize", "Tomatoes", "Groundnuts", "Soybeans", "Beans", "Rice", "Tobacco", "Cotton", "Other"
];

const regionOptions = [
  "Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu", "Nkhotakota", "Salima", "All Malawi"
];

export default function CreateChannel() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    isPublic: true,
    coverImage: null as File | null,
    coverPreview: null as string | null,
    crops: [] as string[],
    regions: [] as string[],
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.name.trim()) errs.name = "Channel name is required";
    if (form.name.length > 50) errs.name = "Name must be 50 characters or less";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, coverImage: file, coverPreview: URL.createObjectURL(file) });
    }
  };

  const removeImage = () => {
    setForm({ ...form, coverImage: null, coverPreview: null });
  };

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise(r => setTimeout(r, 1800)); // simulate API

    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
        <Card className="max-w-lg w-full p-10 text-center">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Channel Created!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your channel "{form.name}" is now live. Share the link below with farmers and buyers.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-8 font-mono text-sm break-all">
            https://mlimiconnect.mw/channels/{form.name.toLowerCase().replace(/\s+/g, "-")}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <Link to="/app/messages">Go to Messages</Link>
            </Button>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText("https://...")}>
              Copy Invite Link
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="text-emerald-600" size={36} />
            Create Community Channel
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">
            Bring farmers, buyers and experts together around a crop, region or topic
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Channel Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Maize Farmers Lilongwe"
                maxLength={50}
                className={`w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg ${
                  errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {50 - form.name.length} characters remaining
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="What is this channel about? Who should join?"
                rows={4}
                className={`w-full px-5 py-4 border rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                  errors.description ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
              )}
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Channel Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPublic: true })}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    form.isPublic
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-gray-300 dark:border-gray-600 hover:border-emerald-400"
                  }`}
                >
                  <Globe className="mx-auto mb-3 text-emerald-600" size={32} />
                  <h3 className="font-semibold">Public</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Anyone can find and join</p>
                </button>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPublic: false })}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    !form.isPublic
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                      : "border-gray-300 dark:border-gray-600 hover:border-emerald-400"
                  }`}
                >
                  <Lock className="mx-auto mb-3 text-emerald-600" size={32} />
                  <h3 className="font-semibold">Private</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Invite-only access</p>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Related Crops & Regions
              </label>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Crops</p>
                  <div className="flex flex-wrap gap-2">
                    {cropOptions.map(crop => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => setForm({ ...form, crops: toggleArrayItem(form.crops, crop) })}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          form.crops.includes(crop)
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Regions</p>
                  <div className="flex flex-wrap gap-2">
                    {regionOptions.map(region => (
                      <button
                        key={region}
                        type="button"
                        onClick={() => setForm({ ...form, regions: toggleArrayItem(form.regions, region) })}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          form.regions.includes(region)
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center">
                {form.coverPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={form.coverPreview}
                      alt="Cover preview"
                      className="max-h-48 rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Upload a photo for your channel
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg cursor-pointer hover:bg-emerald-700 transition-colors"
                    >
                      Choose Image
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full py-6 text-lg shadow-lg"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Channel"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}