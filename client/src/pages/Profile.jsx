import React, { useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser, navigate } = useAppContext();
  const fileInputRef = useRef();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [uploading, setUploading] = useState(false);

  if (!user) {
    navigate("/");
    return null;
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default"); // update with your Cloudinary preset
      formData.append("folder", "green-basket/profiles");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dwqbylpr0"}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setUser((prev) => ({ ...prev, profileImage: data.secure_url }));
        toast.success("Profile photo updated!");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed, try again");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveName = () => {
    if (!name.trim()) return toast.error("Name cannot be empty");
    setUser((prev) => ({ ...prev, name: name.trim() }));
    setIsEditing(false);
    toast.success("Name updated!");
  };

  const stats = [
    { label: "Member Since", value: "2024" },
    { label: "Account Type", value: "Customer" },
    { label: "Status", value: "Active" },
  ];

  return (
    <div className="min-h-screen bg-[#F6FFFB] pt-10 pb-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-primary font-medium hover:underline flex items-center gap-1 text-sm"
        >
          ← Back
        </button>

        {/* Avatar card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-5 text-center relative overflow-hidden">
          {/* Decorative top strip */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary/20 to-emerald-300/20 rounded-t-3xl" />

          {/* Avatar */}
          <div className="relative inline-block mt-6 z-10">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white shadow-md">
                {initials}
              </div>
            )}

            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:bg-primary-dull transition text-sm disabled:opacity-60"
              title="Change photo"
            >
              {uploading ? "⏳" : "📷"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>

          {/* Name */}
          <div className="mt-4 z-10 relative">
            {isEditing ? (
              <div className="flex items-center justify-center gap-2 mt-1">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-primary/40 rounded-lg px-3 py-1.5 text-center text-gray-800 font-semibold outline-primary text-lg w-48"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                />
                <button
                  onClick={handleSaveName}
                  className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dull transition"
                >Save</button>
                <button
                  onClick={() => { setIsEditing(false); setName(user.name); }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition"
                >Cancel</button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 mt-1">
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-primary transition text-sm"
                  title="Edit name"
                >✏️</button>
              </div>
            )}
            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          </div>

          {/* Stats row */}
          <div className="flex justify-center gap-6 mt-6 pt-5 border-t border-gray-100">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-semibold text-gray-700 text-sm mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-100 overflow-hidden">
          {[
            { icon: "📦", label: "My Orders", sub: "View and track your orders", action: () => navigate("/my-orders") },
            { icon: "🛍️", label: "Continue Shopping", sub: "Browse our fresh products", action: () => navigate("/products") },
            { icon: "🏪", label: "Seller Dashboard", sub: "Manage your store", action: () => navigate("/seller") },
          ].map(({ icon, label, sub, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-primary/5 transition text-left"
            >
              <span className="text-2xl">{icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
              <span className="text-gray-300">›</span>
            </button>
          ))}
        </div>

        {/* Note about photo upload */}
        <p className="text-xs text-gray-400 text-center mt-4">
          Profile photo is stored temporarily. To persist it, connect your backend to save the Cloudinary URL.
        </p>
      </div>
    </div>
  );
};

export default Profile;