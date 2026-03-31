import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import api from "../lib/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const {
    user, setUser, setShowUserLogin,
    navigate, setSearchQuery, searchQuery, getCartCount,
  } = useAppContext();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) navigate("/products");
  }, [searchQuery, navigate]);

  const logout = async () => {
    try {
      const { data } = await api.get("/api/user/logout");
      if (data.success) toast.success("Logged out");
    } catch {}
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `text-[16px] font-medium transition ${
      isActive ? "text-primary border-b-2 border-primary pb-1" : "text-gray-700 hover:text-primary"
    }`;

  // Avatar: profile image or initials
  const Avatar = () => {
    if (user?.profileImage) {
      return (
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/40"
        />
      );
    }
    const initials = user?.name
      ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";
    return (
      <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold ring-2 ring-primary/30">
        {initials}
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-3 border-b border-gray-200 bg-[#F6FFFB]/90 backdrop-blur-md h-[72px]">
      {/* Logo */}
      <NavLink to="/">
        <img className="h-26" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop links */}
      <div className="hidden lg:flex items-center gap-8 text-sm">
        <NavLink to="/" className={navLinkClass}>Home</NavLink>
        <NavLink to="/products" className={navLinkClass}>All Products</NavLink>
        <NavLink to="/my-orders" className={navLinkClass}>Orders</NavLink>
        <NavLink to="/seller" className={navLinkClass}>Seller</NavLink>

        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-300 px-4 py-1.5 rounded-full text-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="bg-transparent outline-none placeholder-gray-400 w-36"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-60" />
        </div>

        {/* Cart */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer group">
          <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80 group-hover:scale-110 transition" />
          <span className="absolute -top-2 -right-2 text-[10px] flex items-center justify-center text-white bg-primary min-w-[18px] h-[18px] px-1 rounded-full">
            {getCartCount()}
          </span>
        </div>

        {/* Auth */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="px-5 py-2 bg-primary hover:bg-primary-dull text-white text-sm rounded-full shadow-sm transition"
          >
            Login
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar />
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {user.name?.split(" ")[0]}
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-xl border border-gray-100 rounded-xl w-52 py-2 z-50 animate-fade-in">
                {/* User info header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-800 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <ul className="py-1 text-sm text-gray-700">
                  <li
                    onClick={() => { navigate("/my-orders"); setDropdownOpen(false); }}
                    className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2"
                  >
                    <span>📦</span> My Orders
                  </li>
                  <li
                    onClick={() => { navigate("/profile"); setDropdownOpen(false); }}
                    className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2"
                  >
                    <span>👤</span> My Profile
                  </li>
                  <li
                    onClick={() => { navigate("/seller"); setDropdownOpen(false); }}
                    className="px-4 py-2.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2"
                  >
                    <span>🏪</span> Seller Dashboard
                  </li>
                  <li
                    onClick={logout}
                    className="px-4 py-2.5 hover:bg-red-50 text-red-500 cursor-pointer flex items-center gap-2 border-t border-gray-100 mt-1"
                  >
                    <span>🚪</span> Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;