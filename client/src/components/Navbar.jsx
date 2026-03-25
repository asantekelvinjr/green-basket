import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [open, setOpen] = React.useState(false);

  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios,
  } = useAppContext();

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery, navigate]);

  const navLinkClass = ({ isActive }) =>
    `transition font-medium ${
      isActive
        ? "text-primary border-b-2 border-primary pb-1"
        : "text-gray-700 hover:text-primary"
    }`;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-[#F6FFFB]/80 backdrop-blur-md transition-all h-22">

      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-25" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu (≥1024px) */}
      <div className="hidden lg:flex items-center gap-8">

        <NavLink to="/" className={navLinkClass}>
          Home
        </NavLink>

        <NavLink to="/products" className={navLinkClass}>
          All Products
        </NavLink>

        <NavLink to="/my-orders" className={navLinkClass}>
          Orders
        </NavLink>

        {/* Seller Dashboard */}
        <NavLink to="/seller" className={navLinkClass}>
          Seller
        </NavLink>

        {/* Search */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-4 py-1.5 rounded-full focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="bg-transparent outline-none placeholder-gray-500 w-40"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search" className="w-4 h-4 opacity-70" />
        </div>

        {/* Cart */}
        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer group"
        >
          <img
            src={assets.nav_cart_icon}
            alt="cart"
            className="w-6 opacity-80 group-hover:scale-110 transition"
          />
          <span className="absolute -top-2 -right-2 text-[10px] flex items-center justify-center text-white bg-primary min-w-[18px] h-[18px] px-1 rounded-full">
            {getCartCount()}
          </span>
        </div>

        {/* Auth */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full shadow-sm hover:shadow-md"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img
              src={assets.profile_icon}
              className="w-10 cursor-pointer"
              alt=""
            />

            {/* Dropdown */}
            <ul className="absolute top-12 right-0 bg-white shadow-lg border border-gray-200 py-2 w-40 rounded-md text-sm z-40 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
              <li
                onClick={() => navigate("my-orders")}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>

              <li
                onClick={() => navigate("/seller")}
                className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
              >
                Seller Dashboard
              </li>

              <li
                onClick={logout}
                className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile & Tablet Menu (<1024px) */}
      <div className="flex items-center gap-4 lg:hidden">
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
            <span className="absolute -top-2 -right-2 text-[10px] flex items-center justify-center text-white bg-primary font-semibold min-w-[20px] h-[20px] px-1 rounded-full animate-pulse">
              {getCartCount()}
            </span>
          )}
        </div>

        {/* Hamburger Menu */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <img src={assets.menu_icon} alt="menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile & Tablet Dropdown */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 px-5 flex flex-col gap-3 text-base lg:hidden animate-slideDown z-50">

          {/* Search Bar */}
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
          <NavLink
            to="/"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded hover:bg-primary/10 transition"
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded hover:bg-primary/10 transition"
          >
            All Products
          </NavLink>

          <NavLink
            to="/my-orders"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded hover:bg-primary/10 transition"
          >
            Orders
          </NavLink>

          <NavLink
            to="/seller"
            onClick={() => setOpen(false)}
            className="px-3 py-2 rounded hover:bg-primary/10 transition"
          >
            Seller Dashboard
          </NavLink>

          {/* Auth Buttons */}
          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                setShowUserLogin(true);
              }}
              className="mt-2 w-full py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="mt-2 w-full py-2 bg-primary text-white rounded-full shadow hover:bg-primary-dull transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;