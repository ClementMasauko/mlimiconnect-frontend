// src/pages/profile/MyProfile.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
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
  Truck, // ← Added for transporter icon
} from "lucide-react";

export default function MyProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock/fallback profile data
  const profile = {
    username: user?.username || "ChikondiFarm",
    email: user?.email || "chikondi@example.com",
    phone: user?.phone || "+265 999 123 456",
    location: "Lilongwe, Area 18",
    bio: "Passionate smallholder farmer growing maize, tomatoes, and groundnuts. Open to bulk buyers and long-term partnerships.",
    farmSize: user?.user_type === "farmer" ? "3.2 hectares" : null,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    joined: "January 2025",
    savedSellers: [
      { id: 1, name: "Mary Banda", location: "Kasungu", type: "farmer" },
      { id: 2, name: "Zomba Fresh Produce", location: "Zomba", type: "buyer" },
    ],
  };

  const isFarmer = user?.user_type === "farmer";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert("Account deletion request sent. This action cannot be undone.");
    // In real app: api.delete("/api/users/account")
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <div className="flex flex-wrap gap-3">
            <Link to="/app/profile/edit">
              <Button className="flex items-center gap-2">
                <Edit size={16} /> Edit Profile
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden shadow-lg">
          {/* Header / Avatar */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {profile.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow">
                    <ShieldCheck className="text-green-600" size={24} />
                  </div>
                )}
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-3xl font-bold">{profile.username}</h2>
                <p className="text-green-100 mt-2 flex items-center justify-center sm:justify-start gap-2 text-lg">
                  {isFarmer ? <Leaf size={20} /> : <ShoppingCart size={20} />}
                  {isFarmer ? "Farmer" : "Buyer"} • Joined {profile.joined}
                </p>
              </div>
            </div>
          </div>

          {/* Become Buyer Card */}
          {user?.user_type !== "buyer" && !user?.isBuyerVerified && (
            <Card className="p-6 mt-8 border-2 border-dashed border-green-300 dark:border-green-700 bg-green-50/30 dark:bg-green-950/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 flex items-center gap-2 mb-2">
                    <ShoppingBag size={24} /> Become a Verified Buyer
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Unlock bulk ordering, direct farmer messaging, traceability docs and more.
                  </p>
                </div>
                <Button variant="primary" size="lg" asChild>
                  <Link to="/app/profile/become-buyer">Get Started</Link>
                </Button>
              </div>
            </Card>
          )}

          {/* NEW: Become Transporter Card */}
          {user?.user_type !== "transporter" && !user?.isTransporterVerified && (
            <Card className="p-6 mt-8 border-2 border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2">
                    <Truck size={24} /> Become a Verified Transporter
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Offer transport services, bid on deliveries, earn extra income, and access farmer networks.
                  </p>
                </div>
                <Button variant="primary" size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/app/profile/become-transporter">Become a Transporter</Link>
                </Button>
              </div>
            </Card>
          )}

          {/* Body */}
          <div className="p-6 md:p-8 space-y-10">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="text-gray-500 dark:text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="text-gray-500 dark:text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="text-gray-500 dark:text-gray-400 mt-1" size={20} />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.location}</p>
                  </div>
                </div>
              </div>

              {isFarmer && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Leaf className="text-green-600 mt-1" size={20} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Farm Size</p>
                      <p className="font-medium text-gray-900 dark:text-white">{profile.farmSize}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {profile.bio || "No bio added yet."}
              </p>
            </div>

            {/* Saved Sellers/Buyers (Address Book) */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Heart className="text-red-500" size={20} /> Saved {isFarmer ? "Buyers" : "Sellers"}
              </h3>
              {profile.savedSellers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.savedSellers.map((contact) => (
                    <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contact.location}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No saved contacts yet. Add from marketplace or messages.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t dark:border-gray-700">
              <Link to="/app/profile/edit">
                <Button className="flex-1 flex items-center justify-center gap-2">
                  <Edit size={16} /> Edit Profile
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => navigate("/app/profile/notifications")}
              >
                <Bell size={16} /> Notification Settings
              </Button>
              <Button
                variant="destructive"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 size={16} /> Delete Account
              </Button>
            </div>
          </div>
        </Card>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-8 text-center">
              <AlertTriangle className="mx-auto text-red-500 mb-6" size={64} />
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Delete Your Account?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                This action is permanent and cannot be undone. All your data, listings, orders, and messages will be deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="flex-1"
                >
                  Delete Account
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}