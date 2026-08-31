// src/pages/listings/EditListing.tsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Upload, X, Save, ArrowLeft, Trash2, Package, AlertCircle } from "lucide-react";
import ReactQuill from "react-quill";
import { compressImage, formatFileSize, useDataPreferences } from "../../lib/lowData";
import "react-quill/dist/quill.snow.css";
import api, { getApiError } from "../../lib/api";

// ────────────────────────────────────────────────────────────────
// Mock data (replace with real fetch later)
// ────────────────────────────────────────────────────────────────
interface ListingResponse {
  id: number;
  name: string;
  description: string;
  price: string | number;
  quantity: string | number;
  category: string;
  subcategory?: string;
  image?: string | null;
}

const categories = [
  { value: "crops", label: "Crops" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "legumes", label: "Legumes" },
  { value: "other", label: "Other" },
];

const subcategories: Record<string, { value: string; label: string }[]> = {
  crops: [
    { value: "maize", label: "Maize" },
    { value: "rice", label: "Rice" },
    { value: "soybeans", label: "Soybeans" },
  ],
  vegetables: [
    { value: "tomatoes", label: "Tomatoes" },
    { value: "onions", label: "Onions" },
    { value: "cabbage", label: "Cabbage" },
  ],
  fruits: [
    { value: "mangoes", label: "Mangoes" },
    { value: "bananas", label: "Bananas" },
    { value: "oranges", label: "Oranges" },
  ],
  legumes: [
    { value: "groundnuts", label: "Groundnuts" },
    { value: "beans", label: "Beans" },
  ],
  other: [{ value: "other", label: "Other" }],
};

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "crops",
    subcategory: "",
    image: null as File | null,
    currentImage: "" as string | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) { setError("The listing ID is missing."); setLoading(false); return; }
    api.get<ListingResponse>(`/api/marketplace/listings/${encodeURIComponent(id)}/`)
      .then(({ data }) => {
        setForm({ name: data.name, description: data.description, price: String(data.price), quantity: String(data.quantity), category: data.category, subcategory: data.subcategory || "", image: null, currentImage: data.image || null });
        setPreview(data.image || null);
      })
      .catch(requestError => setError(getApiError(requestError, "The listing could not be loaded.")))
      .finally(() => setLoading(false));
  }, [id]);

  const {lowData}=useDataPreferences();
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, image: await compressImage(file) });
      setPreview(URL.createObjectURL(file));

      setUploadProgress(0);
    }
  };

  const removeNewImage = () => {
    setForm({ ...form, image: null });
    setPreview(form.currentImage);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setError("");
    const payload = new FormData();
    payload.set("name", form.name.trim());
    payload.set("description", form.description);
    payload.set("price", form.price);
    payload.set("quantity", form.quantity);
    payload.set("category", form.category);
    if (form.subcategory) payload.set("subcategory", form.subcategory);
    if (form.image) payload.set("image", form.image);
    try {
      await api.patch(`/api/marketplace/listings/${encodeURIComponent(id)}/`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => navigate("/app/listings"), 2000);
    } catch (requestError) {
      setError(getApiError(requestError, "The listing could not be updated."));
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setSubmitting(true);
    setError("");
    try {
      await api.delete(`/api/marketplace/listings/${encodeURIComponent(id)}/`);
      navigate("/app/listings", { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "The listing could not be deleted."));
      setSubmitting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading listing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && <div role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">{error}</div>}
        <div className="mb-8">
          <button
            onClick={() => navigate("/app/listings")}
            className="inline-flex items-center text-green-700 dark:text-green-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to My Listings
          </button>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Listing
            </h1>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete Listing
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your product details
          </p>
        </div>

        {success ? (
          <Card className="p-12 text-center">
            <div className="text-green-600 text-6xl mb-6">✓</div>
            <h2 className="text-2xl font-bold mb-4">Listing Updated!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your changes have been saved successfully.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/app/listings">
                <Button variant="outline">Back to Listings</Button>
              </Link>
              <Link to={`/app/marketplace/product/${id}`}>
                <Button>View in Marketplace</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Photo
                </label>
                <div className="flex flex-col sm:flex-row gap-6">
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-700"
                      />
                      {form.image && (
                        <button
                          type="button"
                          onClick={removeNewImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      )}
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                          <div
                            className="h-full bg-green-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Package size={48} className="text-gray-400" />
                    </div>
                  )}

                  <label className="flex flex-col justify-center cursor-pointer">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 hover:underline">
                      <Upload size={18} />
                      <span>{preview ? "Change photo" : "Upload photo"}</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {form.image&&<small className="mt-2 text-slate-500">Upload: {formatFileSize(form.image.size)}</small>}
                  </label>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Rich Text Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                {lowData?<textarea value={form.description} onChange={event=>setForm({...form,description:event.target.value})} className="min-h-40 w-full rounded border p-3" aria-label="Description"/>:<ReactQuill
                  theme="snow"
                  value={form.description}
                  onChange={(value) => setForm({ ...form, description: value })}
                  className="bg-white dark:bg-gray-800 rounded-lg"
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                />}
              </div>

              {/* Price, Quantity, Category, Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (MWK) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity Available *
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        category: e.target.value,
                        subcategory: "",
                      })
                    }
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subcategory *
                  </label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    required
                    disabled={!form.category}
                  >
                    <option value="">Select subcategory</option>
                    {form.category &&
                      subcategories[form.category]?.map((sub) => (
                        <option key={sub.value} value={sub.value}>
                          {sub.label}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-6 border-t dark:border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/app/listings")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="min-w-[180px] flex items-center gap-2"
                >
                  <Save size={18} />
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full p-8 text-center">
              <AlertCircle className="mx-auto text-red-500 mb-6" size={64} />
              <h2 className="text-2xl font-bold mb-4">Delete Listing?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                This action cannot be undone. The product will be permanently removed from your listings and the marketplace.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Listing
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
