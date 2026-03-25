import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    navigate("/");
  };

  // ✅ Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* Top Mobile Bar */}
      <div className="flex items-center h-20 justify-between lg:hidden px-4 py-3 sticky top-0 z-50 bg-[#F6FFFB]/80 backdrop-blur-md border-b border-gray-200">

        {/* Left - Logo (BIGGER) */}
        <NavLink to="/" onClick={() => setOpen(false)}>
          <img className="h-20 md:30" src={assets.logo} alt="logo" />
        </NavLink>

        {/* Right - Icons Group */}
        <div className="flex items-center gap-4">

          {/* Hamburger / Close */}
          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md hover:bg-gray-100 transition"
          >
            <img
              src={open ? assets.close_icon : assets.menu_icon}
              alt="menu"
              className="w-6 h-6"
            />
          </button>

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <img
              src={assets.nav_cart_icon}
              alt="cart"
              className="w-7 h-7 opacity-90"
            />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] flex items-center justify-center text-white bg-primary font-semibold min-w-[20px] h-[20px] px-1 rounded-full">
                {getCartCount()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40"></div>
      )}

      {/* Dropdown (FROM TOP ✅) */}
      <div
        ref={menuRef}
        className={`absolute top-[64px] left-0 w-full bg-white shadow-md py-4 px-5 flex flex-col gap-3 text-base lg:hidden z-50 transition-all duration-300
        ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none"}`}
      >
        {/* Search */}
        <div className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-full focus-within:ring-1 focus-within:ring-primary">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="bg-transparent outline-none w-full placeholder-gray-500 text-sm"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-5 h-5 opacity-70" />
        </div>

        {/* Links */}
        <NavLink onClick={() => setOpen(false)} to="/" className="px-3 py-2 rounded hover:bg-primary/10">Home</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/products" className="px-3 py-2 rounded hover:bg-primary/10">All Products</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/my-orders" className="px-3 py-2 rounded hover:bg-primary/10">Orders</NavLink>
        <NavLink onClick={() => setOpen(false)} to="/seller" className="px-3 py-2 rounded hover:bg-primary/10">Seller Dashboard</NavLink>

        {/* Auth */}
        {!user ? (
          <button
            onClick={() => {
              setOpen(false);
              setShowUserLogin(true);
            }}
            className="mt-3 w-full py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition"
          >
            Login
          </button>
        ) : (
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="mt-3 w-full py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition"
          >
            Logout
          </button>
        )}
      </div>
    </>
  );
};

export default MobileNavbar;