// src/pages/profile/MyProfile.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import api from "../../lib/api";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Edit,
  LogOut,
  ShieldCheck,
  Heart,
  Trash2,
  Bell,
  ShoppingCart,
  AlertTriangle,
  ShoppingBag,
  Award,
  Calendar,
  ChevronRight,
  FileCheck,
  Star,
  Layers,
} from "lucide-react";

export default function MyProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isFarmer = user?.user_type === "farmer";

  // Highly personalized profile fields with fallbacks to user context
  const profile = {
    username: user?.username || "Guest User",
    email: user?.email || "No email linked",
    phone: user?.phone || "No phone linked",
    location: user?.location || "No location set",
    bio: (user as any)?.bio || "",
    farmSize: (user as any)?.farm_size || (user as any)?.farmSize || null,
    verified: user?.isBuyerVerified === true || isFarmer, // Assume verified/approved status placeholder
    joinedDate: "August 2025", // Mock Joined date for high-fidelity representation
    avatar: (user as any)?.avatar_url || null,
    savedContacts: isFarmer
      ? [
          { id: 1, name: "Chikondi Wholesale Foods", location: "Lilongwe Area 4", type: "Wholesaler" },
          { id: 2, name: "Malawi National NGO Lunch Program", location: "Zomba", type: "Institution" },
        ]
      : [
          { id: 1, name: "Alick Mwale Farm", location: "Lilongwe, Central Region", type: "Maize & Legumes" },
          { id: 2, name: "Nkhotakota Organic Produce", location: "Nkhotakota", type: "Rice & Cassava" },
        ],
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await api.delete("/api/users/account");
      logout();
      toast.success("Your account has been deleted permanently.");
      navigate("/");
    } catch (error: any) {
      const errMsg = error.response?.data?.detail || "We could not delete your account. Please contact support.";
      setDeleteError(errMsg);
      toast.error(errMsg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950/50 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Title with quick edit & logout actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800/80 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your identity, settings, and agricultural credentials</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/app/profile/edit">
              <Button className="flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                <Edit size={16} /> Edit Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-950/50 dark:text-red-400 dark:hover:bg-red-950/20"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>

        {/* Main Profile Info Card */}
        <Card className="overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl rounded-2xl">
          {/* Header Cover / Avatar banner */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-green-700 p-8 md:p-10 text-white">
            <div className="absolute inset-0 bg-grid-white/[0.08] pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row items-center gap-6 z-10">
              <div className="relative group">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.username}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white dark:border-gray-900 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shadow-2xl">
                    <User size={56} aria-hidden="true" />
                  </div>
                )}
                {profile.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1.5 shadow-lg border border-emerald-100 dark:border-gray-800 animate-bounce">
                    <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                  <h2 className="text-3xl font-extrabold tracking-tight">{profile.username}</h2>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 bg-white/20 dark:bg-black/20 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-white/20">
                      <Award size={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-green-50 mt-1 flex items-center justify-center sm:justify-start gap-2 text-md opacity-90">
                  {isFarmer ? <Leaf className="text-green-300" size={20} /> : <ShoppingCart className="text-green-300" size={20} />}
                  <span className="font-semibold capitalize">{user?.user_type || "buyer"} Account</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-sm"><Calendar size={14} /> Joined {profile.joinedDate}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics / Stats bar */}
          <div className="bg-gray-50 dark:bg-gray-900/60 border-y border-gray-100 dark:border-gray-800 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 py-4 text-center">
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{isFarmer ? "8" : "14"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-1">
                {isFarmer ? "Active Listings" : "Orders Placed"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                {isFarmer ? "4.9" : "98%"}
                <Star size={16} className="fill-emerald-500 text-emerald-500" />
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-1">
                {isFarmer ? "Seller Rating" : "Fulfilment Rate"}
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{isFarmer ? "156" : "2"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mt-1">
                {isFarmer ? "Tons Sold" : "Active Bids"}
              </p>
            </div>
          </div>

          {/* Verification Call-to-Action for Unverified Buyers/Farmers */}
          {user?.user_type !== "admin" && !user?.isBuyerVerified && (
            <div className="m-6 md:mx-8 md:mt-8 p-6 border-2 border-dashed border-emerald-300 dark:border-emerald-700/80 bg-emerald-50/20 dark:bg-emerald-950/10 rounded-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 flex items-center justify-center md:justify-start gap-2">
                    <ShoppingBag size={22} className="animate-pulse" /> Apply for Official Verification
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                    Upload identification credentials or business records to unlock bulk transactions, priority bidding, direct communications, and traceability papers.
                  </p>
                </div>
                <Link to={isFarmer ? "/app/profile/become-farmer" : "/app/profile/become-buyer"}>
                  <Button variant="primary" className="shadow-lg shadow-emerald-600/15 font-semibold hover:scale-105 transition-transform duration-150">
                    Get Verified Now
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Profile Details Body */}
          <div className="p-6 md:p-8 space-y-10">
            {/* Contact / Location Info Cards */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={18} className="text-emerald-600" /> Account Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">Email Address</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.email}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">Phone Contact</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.phone}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">Primary Location</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{profile.location}</p>
                  </div>
                </div>

                {isFarmer && (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                      <Layers size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase">Farm Size / Scope</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{profile.farmSize ? `${profile.farmSize} Hectares` : "Not specified yet"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* About / Bio Statement */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileCheck size={18} className="text-emerald-600" /> Professional Bio & Intentions
              </h3>
              <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80">
                {profile.bio ? (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm">
                    {profile.bio}
                  </p>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No bio has been added yet.</p>
                    <Link to="/app/profile/edit">
                      <button className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                        Write a bio now
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Saved Sellers/Buyers */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="text-rose-500 fill-rose-500" size={18} /> 
                Saved {isFarmer ? "Buyers & Off-takers" : "Farmers & Storefronts"}
              </h3>
              {profile.savedContacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.savedContacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className="p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-200 group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{contact.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5"><MapPin size={12} /> {contact.location}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 tracking-wider">
                        {contact.type}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No saved contacts yet. You can bookmark sellers from the marketplace.
                </p>
              )}
            </div>

            {/* Account Settings / Deep Actions Grid */}
            <div className="pt-8 border-t border-gray-100 dark:border-gray-800/80 space-y-4">
              <h3 className="text-md font-extrabold uppercase text-gray-400 dark:text-gray-500 tracking-wider">Account Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 py-4"
                  onClick={() => navigate("/app/profile/edit")}
                >
                  <Edit size={16} /> Edit My Profile
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 py-4"
                  onClick={() => navigate("/app/profile/notifications")}
                >
                  <Bell size={16} /> Notifications Inbox
                </Button>
                <Button
                  variant="destructive"
                  className="flex items-center justify-center gap-2 py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 dark:bg-red-950/20 dark:hover:bg-red-950/30 dark:text-red-400 dark:border-red-950/40"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 size={16} /> Delete Account
                </Button>
              </div>
            </div>

          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <Card className="max-w-md w-full p-8 text-center shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={36} />
              </div>
              <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">
                Delete Your Account?
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                This is a permanent action that cannot be undone. You will lose access to all agricultural listings, chats, transaction logs, and wallet access immediately.
              </p>
              {deleteError && (
                <div role="alert" className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-xs text-red-600 dark:text-red-400 font-medium">
                  {deleteError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => { setShowDeleteModal(false); setDeleteError(null); }}
                  className="flex-1 py-3"
                >
                  No, Keep Account
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  {deleting ? "Deleting..." : "Permanently Delete"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
