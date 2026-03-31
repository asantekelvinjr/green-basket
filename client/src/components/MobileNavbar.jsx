import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import api from "../lib/api";
import toast from "react-hot-toast";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const { user, setUser, setShowUserLogin, navigate, searchQuery, setSearchQuery, getCartCount } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await api.get("/api/user/logout");
      if (data.success) toast.success("Logged out");
    } catch {}
    setUser(null);
    setOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Avatar initials or image
  const Avatar = ({ size = "w-8 h-8 text-xs" }) => {
    if (user?.profileImage)
      return <img src={user.profileImage} alt={user.name} className={`${size} rounded-full object-cover ring-2 ring-primary/40`} />;
    const initials = user?.name
      ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";
    return (
      <div className={`${size} rounded-full bg-primary text-white flex items-center justify-center font-semibold ring-2 ring-primary/30`}>
        {initials}
      </div>
    );
  };

  return (
    <>
      {/* Top bar */}
      <div className="flex items-center h-16 justify-between lg:hidden px-4 sticky top-0 z-50 bg-[#F6FFFB]/90 backdrop-blur-md border-b border-gray-200">
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img className="h-14" src={assets.logo} alt="logo" />
        </NavLink>

        <div className="flex items-center gap-3">
          {/* Cart */}
          <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
            <img src={assets.nav_cart_icon} alt="cart" className="w-6 h-6 opacity-80" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] flex items-center justify-center text-white bg-primary font-semibold min-w-[18px] h-[18px] px-1 rounded-full">
                {getCartCount()}
              </span>
            )}
          </div>

          {/* Avatar or hamburger */}
          {user && (
            <button onClick={() => setOpen(!open)} className="flex items-center">
              <Avatar />
            </button>
          )}

          <button onClick={() => setOpen(!open)} className="p-1.5 rounded-md hover:bg-gray-100 transition">
            <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Slide-down menu */}
      <div
        ref={menuRef}
        className={`fixed top-16 left-0 w-full bg-white shadow-lg py-4 px-5 flex flex-col gap-2 text-sm lg:hidden z-50 transition-all duration-300
          ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
      >
        {/* User info if logged in */}
        {user && (
          <div className="flex items-center gap-3 px-2 py-3 mb-1 bg-primary/5 rounded-xl border border-primary/10">
            <Avatar size="w-11 h-11 text-sm" />
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-full focus-within:ring-1 focus-within:ring-primary mb-1">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="bg-transparent outline-none w-full placeholder-gray-400 text-sm"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-60" />
        </div>

        {/* Links */}
        {[
          { to: "/", label: "🏠 Home" },
          { to: "/products", label: "🛍️ All Products" },
          { to: "/my-orders", label: "📦 My Orders" },
          { to: "/seller", label: "🏪 Seller Dashboard" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            onClick={() => setOpen(false)}
            to={to}
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg font-medium transition ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-700"}`
            }
          >
            {label}
          </NavLink>
        ))}

        {user && (
          <NavLink
            onClick={() => setOpen(false)}
            to="/profile"
            className={({ isActive }) =>
              `px-3 py-2.5 rounded-lg font-medium transition ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-50 text-gray-700"}`
            }
          >
            👤 My Profile
          </NavLink>
        )}

        {/* Auth button */}
        {!user ? (
          <button
            onClick={() => { setOpen(false); setShowUserLogin(true); }}
            className="mt-2 w-full py-2.5 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition font-medium"
          >
            Login
          </button>
        ) : (
          <button
            onClick={logout}
            className="mt-2 w-full py-2.5 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition font-medium"
          >
            🚪 Logout
          </button>
        )}
      </div>
    </>
  );
};

export default MobileNavbar;