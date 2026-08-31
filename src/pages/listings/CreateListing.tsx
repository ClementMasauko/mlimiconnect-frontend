import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Upload, X, Gavel, ShoppingBag, Clock, HelpCircle } from "lucide-react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useAuth } from "../../context/AuthContext";
import api, { getApiError } from "../../lib/api";
import { compressImage, formatFileSize } from "../../lib/lowData";

export default function CreateListing() {
  const liveAnimalCategories = ["live-animals","cattle","goats","sheep","pigs","broiler-chickens","layer-chickens","indigenous-chickens","ducks-poultry","chicks-breeding-stock"];
  const navigate = useNavigate();
  const { addListing } = useMarketplace();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "1",
    category: "produce",
    listingType: "fixed-price" as "fixed-price" | "auction",
    condition: "new" as "new" | "used-excellent" | "used-good" | "used-fair",
    durationDays: "5",
    unit:"kg",pack_size:"1",minimum_order:"1",harvest_date:"",available_from:"",expiry_date:"",listing_expires_at:"",grade:"",variety:"",moisture_content:"",certification:"",is_organic:false,storage_conditions:"",delivery_radius_km:"",latitude:"",longitude:"",allow_partial_fulfilment:false,tier_minimum:"",tier_price:"",
    livestock_herd_id:"",livestock_sex:"mixed",livestock_date_of_birth:"",livestock_age_months:"",livestock_sale_format:"group",livestock_purpose:"other",live_weight_kg:"",health_inspection_date:"",animal_identifier:"",breeding_status:"",production_summary:"",transport_available:false,handling_requirements:"",vaccination_summary:"",movement_permit_reference:"",welfare_declaration:false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [livestockHerds,setLivestockHerds]=useState<Array<{id:number;name:string;species:string}>>([]);
  useEffect(()=>{api.get<Array<{id:number;name:string;species:string}>>("/api/livestock/herds/").then(response=>setLivestockHerds(response.data)).catch(()=>setLivestockHerds([]));},[]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed=await compressImage(file);setImageFile(compressed);
      setPreview(URL.createObjectURL(compressed));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const farmerName = user?.username || "John Phiri";
    const farmerLocation = user?.location || "Lilongwe";

    // Set up end date if it is an auction
    let auctionEndStr: string | undefined;
    if (form.listingType === "auction") {
      const days = parseInt(form.durationDays);
      auctionEndStr = new Date(Date.now() + 1000 * 60 * 60 * 24 * days).toISOString();
    }

    const defaultImage = "https://images.unsplash.com/photo-1595914193075-85d013f39a48?w=700&h=500&fit=crop";
    
    const newProductPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.quantity),
      category: form.category,
      farmer: farmerName,
      location: farmerLocation,
      image: preview || defaultImage,
      listingType: form.listingType,
      condition: form.condition,
      auctionEnd: auctionEndStr,
      tag: form.listingType === "auction" ? "Auction" : "New",
    };

    try {
      // 1. Try to post to the actual backend API first
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("quantity", form.quantity);
      payload.append("category", form.category);
      payload.append("listing_type", form.listingType);
      payload.append("condition", form.condition);
      if (form.listingType === "auction") {
        payload.append("duration_days", form.durationDays);
      }
      if (imageFile) payload.append("image", imageFile);
      for(const key of ["unit","pack_size","minimum_order","harvest_date","available_from","expiry_date","listing_expires_at","grade","variety","moisture_content","certification","storage_conditions","delivery_radius_km","latitude","longitude"] as const){if(form[key]!=="")payload.append(key,form[key]);}
      payload.append("is_organic",String(form.is_organic));payload.append("allow_partial_fulfilment",String(form.allow_partial_fulfilment));
      if(form.tier_minimum&&form.tier_price)payload.append("wholesale_tiers",JSON.stringify([{minimum_quantity:Number(form.tier_minimum),price_per_unit:form.tier_price}]));

      const listingResponse = await api.post<{id:number}>("/api/marketplace/listings/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if(liveAnimalCategories.includes(form.category)){
        if(!form.livestock_herd_id||!form.welfare_declaration)throw new Error("Choose the source herd and accept the animal-welfare declaration.");
        await api.post(`/api/livestock/listings/${listingResponse.data.id}/details/`,{herd_id:Number(form.livestock_herd_id),sex:form.livestock_sex,date_of_birth:form.livestock_date_of_birth||null,age_months:form.livestock_age_months||null,sale_format:form.livestock_sale_format,sale_quantity:Number(form.quantity),purpose:form.livestock_purpose,live_weight_kg:form.live_weight_kg||null,health_inspection_date:form.health_inspection_date||null,animal_identifier:form.animal_identifier,breeding_status:form.breeding_status,production_summary:form.production_summary,transport_available:form.transport_available,handling_requirements:form.handling_requirements,vaccination_summary:form.vaccination_summary,movement_permit_reference:form.movement_permit_reference,welfare_declaration:true});
      }
    } catch (requestError: unknown) {
      setError(getApiError(requestError, "The listing could not be published. Please try again."));
      setSubmitting(false);
      return;
    }

    // 2. Always write to client state to guarantee high-fidelity interactivity
    addListing(newProductPayload);
    setSuccess(true);
    setSubmitting(false);

    setTimeout(() => {
      navigate("/app/marketplace");
    }, 2000);
  };

  if (user && user.can_sell === false) return <Card className="mx-auto mt-12 max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">Selling is not enabled</h1><p className="mt-3 text-gray-600">This account is currently configured to buy only. Contact support to request seller verification before publishing products.</p><Button className="mt-6" onClick={() => navigate("/contact")}>Contact support</Button></Card>;
  if (user?.account_type && user.account_type !== "individual" && user.organization_status !== "verified") return <Card className="mx-auto mt-12 max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">Organization verification pending</h1><p className="mt-3 text-gray-600">Your cooperative or company can browse and prepare for trading, but it cannot publish listings until its registration and representative authority are verified.</p><Button className="mt-6" onClick={() => navigate("/app/profile")}>View organization profile</Button></Card>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Create Listing</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm font-medium">
          List your products in Malawi's prime agricultural marketplace. Support both Buy It Now or Auction formats.
        </p>

        {success ? (
          <Card className="p-12 text-center border border-slate-100 dark:border-gray-800 shadow-xl">
            <div className="text-green-600 text-6xl mb-6">✓</div>
            <h2 className="text-2xl font-black mb-3">Listing Created Successfully!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm font-medium">
              Your item is now live in the marketplace for buyers to bid on or buy instantly.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/app/marketplace">
                <Button className="font-bold bg-green-600 text-white hover:bg-green-700 shadow-md">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-6 md:p-8 border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  ✕ {error}
                </p>
              )}

              {/* Format selection tabs (eBay style!) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Selling Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, listingType: "fixed-price" })}
                    className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                      form.listingType === "fixed-price"
                        ? "border-green-600 bg-green-50/20 dark:bg-green-950/20"
                        : "border-slate-100 bg-slate-50 dark:border-gray-800 dark:bg-gray-950/20 text-slate-500"
                    }`}
                  >
                    <ShoppingBag className={form.listingType === "fixed-price" ? "text-green-600" : ""} size={20} />
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">Buy It Now (Fixed Price)</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Set a static price. Buyers purchase instantly.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, listingType: "auction", quantity: "1" })}
                    className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                      form.listingType === "auction"
                        ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/20"
                        : "border-slate-100 bg-slate-50 dark:border-gray-800 dark:bg-gray-950/20 text-slate-500"
                    }`}
                  >
                    <Gavel className={form.listingType === "auction" ? "text-blue-600" : ""} size={20} />
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">eBay-Style Auction</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Set a starting price. Highest bidder wins after countdown.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Product Image
                </label>
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-xl border border-slate-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-colors bg-slate-50/50 dark:bg-gray-950/10">
                    <Upload size={28} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      Click to upload photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {imageFile&&<small className="mt-2 block text-slate-500">Upload: {formatFileSize(imageFile.size)}</small>}
                  </label>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Product / Item Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Pure Kilombero Aromatic Rice (50kg Bag)"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Detailed Item Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe details regarding crop quality, harvest dates, sorting standards, or equipment condition details..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Condition Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Item Condition
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value as typeof form.condition })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="new">Brand New / Handpicked Fresh</option>
                    <option value="used-excellent">Pre-owned (Used - Excellent / Like New)</option>
                    <option value="used-good">Pre-owned (Used - Good / Functional)</option>
                    <option value="used-fair">Pre-owned (Used - Fair / Restored)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Category Selector *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="produce">Produce & Crops</option>
                    <option value="seeds">Seeds & Grains</option>
                    <option value="farm-inputs">Fertilizer & Farm Inputs</option>
                    <option value="tools">Hand Tools</option>
                    <option value="equipment">Farm Equipment</option>
                    <option value="machinery">Machinery & Vehicles</option>
                    <option value="eggs">Eggs</option>
                    <option value="milk">Milk & dairy</option>
                    <option value="animal-feed">Animal feed</option>
                    <option value="manure">Manure</option>
                    <option value="live-animals">Live animals (verification required)</option>
                    <option value="cattle">Cattle</option><option value="goats">Goats</option><option value="sheep">Sheep</option><option value="pigs">Pigs</option><option value="broiler-chickens">Broiler chickens</option><option value="layer-chickens">Layer chickens</option><option value="indigenous-chickens">Indigenous chickens</option><option value="ducks-poultry">Ducks & other poultry</option><option value="chicks-breeding-stock">Chicks & breeding stock</option><option value="veterinary-supplies">Veterinary supplies</option><option value="livestock-services">Livestock services</option>
                  </select>
                </div>
              </div>

              {liveAnimalCategories.includes(form.category) && <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 dark:bg-amber-950/20">
                <h3 className="font-bold text-amber-950 dark:text-amber-100">Live-animal verification</h3><p className="mt-1 text-xs text-amber-900 dark:text-amber-200">This listing remains hidden until its welfare and supporting records are reviewed.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2"><select required className="rounded-lg border p-3 dark:bg-gray-900" value={form.livestock_herd_id} onChange={e=>setForm({...form,livestock_herd_id:e.target.value})}><option value="">Select source herd or flock</option>{livestockHerds.map(x=><option key={x.id} value={x.id}>{x.name} · {x.species.replaceAll("_"," ")}</option>)}</select><select className="rounded-lg border p-3 dark:bg-gray-900" value={form.livestock_sex} onChange={e=>setForm({...form,livestock_sex:e.target.value})}><option value="mixed">Mixed</option><option value="female">Female</option><option value="male">Male</option></select><input type="date" title="Date of birth" className="rounded-lg border p-3 dark:bg-gray-900" value={form.livestock_date_of_birth} onChange={e=>setForm({...form,livestock_date_of_birth:e.target.value})}/><input type="number" min="0" className="rounded-lg border p-3 dark:bg-gray-900" placeholder="Estimated age in months" value={form.livestock_age_months} onChange={e=>setForm({...form,livestock_age_months:e.target.value})}/><select className="rounded-lg border p-3 dark:bg-gray-900" value={form.livestock_sale_format} onChange={e=>setForm({...form,livestock_sale_format:e.target.value})}><option value="individual">Individual sale</option><option value="group">Group sale</option></select><select className="rounded-lg border p-3 dark:bg-gray-900" value={form.livestock_purpose} onChange={e=>setForm({...form,livestock_purpose:e.target.value})}>{["breeding","meat","milk","eggs","draught","other"].map(x=><option value={x} key={x}>{x}</option>)}</select><input type="number" min="0" step="0.01" className="rounded-lg border p-3 dark:bg-gray-900" placeholder="Average live weight kg" value={form.live_weight_kg} onChange={e=>setForm({...form,live_weight_kg:e.target.value})}/><input type="date" title="Health inspection date" className="rounded-lg border p-3 dark:bg-gray-900" value={form.health_inspection_date} onChange={e=>setForm({...form,health_inspection_date:e.target.value})}/><input className="rounded-lg border p-3 dark:bg-gray-900" placeholder="Ear tag, ring or batch number" value={form.animal_identifier} onChange={e=>setForm({...form,animal_identifier:e.target.value})}/><input className="rounded-lg border p-3 dark:bg-gray-900" placeholder="Pregnancy or breeding status" value={form.breeding_status} onChange={e=>setForm({...form,breeding_status:e.target.value})}/><textarea className="rounded-lg border p-3 dark:bg-gray-900" placeholder="Vaccination and health summary" value={form.vaccination_summary} onChange={e=>setForm({...form,vaccination_summary:e.target.value})}/><textarea className="rounded-lg border p-3 dark:bg-gray-900" placeholder="Milk, egg, weight or breeding production summary" value={form.production_summary} onChange={e=>setForm({...form,production_summary:e.target.value})}/><textarea className="rounded-lg border p-3 dark:bg-gray-900 sm:col-span-2" placeholder="Humane handling requirements" value={form.handling_requirements} onChange={e=>setForm({...form,handling_requirements:e.target.value})}/><input className="rounded-lg border p-3 dark:bg-gray-900 sm:col-span-2" placeholder="Movement permit reference, if issued" value={form.movement_permit_reference} onChange={e=>setForm({...form,movement_permit_reference:e.target.value})}/></div><label className="mt-3 flex gap-2 text-sm"><input type="checkbox" checked={form.transport_available} onChange={e=>setForm({...form,transport_available:e.target.checked})}/>Suitable animal transport is available</label>
                {!livestockHerds.length&&<p className="mt-3 text-sm"><Link className="font-bold underline" to="/app/livestock">Create a herd or flock record first.</Link></p>}<label className="mt-4 flex items-start gap-2 text-sm"><input required type="checkbox" className="mt-1" checked={form.welfare_declaration} onChange={e=>setForm({...form,welfare_declaration:e.target.checked})}/><span>I confirm that the animals are described accurately and will be handled and transported using appropriate welfare safeguards.</span></label>
              </div>}

              {/* Price & Quantity Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 dark:border-gray-850 pt-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    {form.listingType === "auction" ? "Starting Bid (MWK) *" : "Buy It Now Price (MWK) *"}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder={form.listingType === "auction" ? "350000" : "28500"}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {form.listingType === "auction" ? (
                  /* Auction Duration Options */
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                      Auction Duration <Clock size={12} />
                    </label>
                    <select
                      value={form.durationDays}
                      onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="1">1 Day Hot Auction (24 Hours)</option>
                      <option value="3">3 Days Standard Auction</option>
                      <option value="5">5 Days Standard Auction</option>
                      <option value="7">7 Days Classic Auction</option>
                    </select>
                  </div>
                ) : (
                  /* Fixed Price Stock Units */
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                      Quantity Available (Units) *
                    </label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="50"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                )}
              </div>

              <Card className="grid gap-4 border p-5 sm:grid-cols-3"><h2 className="text-lg font-bold sm:col-span-3">Agricultural sale details</h2><label>Sale unit<select value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="mt-1 w-full rounded border p-2">{["kg","tonne","bag","crate","litre","item"].map(x=><option key={x}>{x}</option>)}</select></label><label>Pack size<input type="number" min="0.01" step="0.01" value={form.pack_size} onChange={e=>setForm({...form,pack_size:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Minimum order<input type="number" min="1" value={form.minimum_order} onChange={e=>setForm({...form,minimum_order:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Harvest date<input type="date" value={form.harvest_date} onChange={e=>setForm({...form,harvest_date:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Available from<input type="date" value={form.available_from} onChange={e=>setForm({...form,available_from:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Product expiry<input type="date" value={form.expiry_date} onChange={e=>setForm({...form,expiry_date:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Listing expires<input type="datetime-local" value={form.listing_expires_at} onChange={e=>setForm({...form,listing_expires_at:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Grade<input value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Variety<input value={form.variety} onChange={e=>setForm({...form,variety:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Moisture (%)<input type="number" min="0" max="100" step="0.01" value={form.moisture_content} onChange={e=>setForm({...form,moisture_content:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Certification<input value={form.certification} onChange={e=>setForm({...form,certification:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Delivery radius (km)<input type="number" min="0" value={form.delivery_radius_km} onChange={e=>setForm({...form,delivery_radius_km:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Storage conditions<input value={form.storage_conditions} onChange={e=>setForm({...form,storage_conditions:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Latitude<input type="number" step="0.000001" value={form.latitude} onChange={e=>setForm({...form,latitude:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Longitude<input type="number" step="0.000001" value={form.longitude} onChange={e=>setForm({...form,longitude:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Wholesale minimum<input type="number" min="1" value={form.tier_minimum} onChange={e=>setForm({...form,tier_minimum:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label>Wholesale unit price<input type="number" min="0" value={form.tier_price} onChange={e=>setForm({...form,tier_price:e.target.value})} className="mt-1 w-full rounded border p-2"/></label><label className="flex items-center gap-2"><input type="checkbox" checked={form.is_organic} onChange={e=>setForm({...form,is_organic:e.target.checked})}/>Certified organic</label><label className="flex items-center gap-2"><input type="checkbox" checked={form.allow_partial_fulfilment} onChange={e=>setForm({...form,allow_partial_fulfilment:e.target.checked})}/>Allow partial fulfilment</label></Card>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-gray-850">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/app/marketplace")}
                  className="font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className={`min-w-[160px] font-bold text-xs ${
                    form.listingType === "auction" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {submitting ? "Creating Item..." : form.listingType === "auction" ? "Launch Auction" : "Publish Listing"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
