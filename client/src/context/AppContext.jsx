// import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import axios from "axios";

// export const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const currency = import.meta.env.VITE_CURRENCY || "₵";
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [isSeller, setIsSeller] = useState(false);
//   const [showUserLogin, setShowUserLogin] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [cartItems, setCartItems] = useState({});
//   const [searchQuery, setSearchQuery] = useState("");

//   // --- Set axios defaults dynamically ---
//   const BASE_URL =
//     import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
//   axios.defaults.baseURL = BASE_URL;
//   axios.defaults.withCredentials = true;

//   // --- Fetch seller authentication ---
//   const fetchSeller = async () => {
//     try {
//       const { data } = await axios.get("/api/seller/is-auth");
//       setIsSeller(!!data.success);
//     } catch {
//       setIsSeller(false);
//     }
//   };

//   // --- Fetch user authentication ---
//   const fetchUser = async () => {
//     try {
//       const { data } = await axios.get("/api/user/is-auth");
//       if (data.success) {
//         setUser(data.user);
//         setCartItems(data.user.cartItems || {});
//       } else {
//         setUser(null);
//       }
//     } catch {
//       setUser(null);
//     }
//   };

//   // --- Fetch products ---
//   const fetchProducts = async () => {
//     try {
//       const { data } = await axios.get("/api/product/list");
//       if (data.success) {
//         setProducts(data.products);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // --- Cart functions ---
//   const addToCart = (itemId) => {
//     const newCart = structuredClone(cartItems);
//     newCart[itemId] = (newCart[itemId] || 0) + 1;
//     setCartItems(newCart);
//     toast.success("Added to Cart");
//   };

//   const updateCartItems = (itemId, quantity) => {
//     const newCart = structuredClone(cartItems);
//     newCart[itemId] = quantity;
//     setCartItems(newCart);
//     toast.success("Cart Updated");
//   };

//   const removeFromCart = (itemId) => {
//     const newCart = structuredClone(cartItems);
//     if (newCart[itemId] > 1) newCart[itemId] -= 1;
//     else delete newCart[itemId];
//     setCartItems(newCart);
//     toast.success("Removed from Cart");
//   };

//   const getCartCount = () =>
//     Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

//   const getCartAmount = () => {
//     let total = 0;
//     for (const id in cartItems) {
//       const product = products.find((p) => p._id === id);
//       if (product) total += product.offerPrice * cartItems[id];
//     }
//     return Math.floor(total * 100) / 100;
//   };

//   // --- Initial fetch on mount ---
//   useEffect(() => {
//     fetchUser();
//     fetchSeller();
//     fetchProducts();
//   }, []);

//   // --- Update cart in DB whenever cartItems changes ---
//   useEffect(() => {
//     if (!user) return;

//     const updateCart = async () => {
//       try {
//         const { data } = await axios.post("/api/cart/update", { cartItems });
//         if (!data.success) toast.error(data.message);
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };
//     updateCart();
//   }, [cartItems]);

//   const value = {
//     navigate,
//     user,
//     setUser,
//     isSeller,
//     setIsSeller,
//     showUserLogin,
//     setShowUserLogin,
//     products,
//     currency,
//     cartItems,
//     addToCart,
//     updateCartItems,
//     removeFromCart,
//     getCartCount,
//     getCartAmount,
//     searchQuery,
//     setSearchQuery,
//     fetchProducts,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export const useAppContext = () => useContext(AppContext);

// context/AppContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "../lib/api"; // ✅ use shared Axios instance

// --- Create context ---
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₵";

  // --- State ---
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch user auth ---
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/user/is-auth");
      if (data.success && data.user) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[fetchUser] Error:", error);
      setUser(null);
    }
  }, []);

  // --- Fetch seller auth ---
  const fetchSeller = useCallback(async () => {
    try {
      const { data } = await api.get("/api/seller/is-auth");
      setIsSeller(!!data.success);
    } catch (error) {
      console.error("[fetchSeller] Error:", error);
      setIsSeller(false);
    }
  }, []);

  // --- Login user ---
  const loginUser = async (email, password) => {
    try {
      const { data } = await api.post("/api/user/login", { email, password });
      if (data.success && data.user) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        setShowUserLogin(false);
        toast.success("Logged in successfully!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("[loginUser] Error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
    }
  };

  // --- Logout user ---
  const logoutUser = async () => {
    try {
      const { data } = await api.get("/api/user/logout"); // backend clears cookie
      if (data.success) {
        setUser(null);
        setCartItems({});
        toast.success("Logged out successfully!");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("[logoutUser] Error:", error);
      toast.error(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  // --- Fetch products ---
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/api/product/list");
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        toast.error(data.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("[fetchProducts] Error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
    }
  }, []);

  // --- Cart functions ---
  const addToCart = (itemId) => {
    const newCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(newCart);
    toast.success("Added to cart");
  };

  const updateCartItems = (itemId, quantity) => {
    const newCart = { ...cartItems, [itemId]: quantity };
    setCartItems(newCart);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    const newCart = { ...cartItems };
    if (newCart[itemId] > 1) newCart[itemId] -= 1;
    else delete newCart[itemId];
    setCartItems(newCart);
    toast.success("Removed from cart");
  };

  const getCartCount = () => Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return Math.floor(total * 100) / 100;
  };

  const getFormattedCartAmount = () => `${currency} ${getCartAmount()}`;

  // --- Debounced Cart Sync ---
  useEffect(() => {
    if (!user) return;
    if (!cartItems || Object.keys(cartItems).length === 0) return;

    const timeout = setTimeout(async () => {
      try {
        const { data } = await api.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message || "Failed to update cart");
      } catch (error) {
        console.error("[CartSync] Error:", error);
      }
    }, 500); // debounce 500ms

    return () => clearTimeout(timeout);
  }, [cartItems, user]);

  // --- Initial fetch ---
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, [fetchUser, fetchSeller, fetchProducts]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    loginUser,
    logoutUser,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItems,
    removeFromCart,
    getCartCount,
    getCartAmount,
    getFormattedCartAmount,
    searchQuery,
    setSearchQuery,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);