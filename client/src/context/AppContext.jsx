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
import api from "../lib/api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₵";

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Auth ---
  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const { data } = await api.post("/api/user/login", { email, password });
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        setShowUserLogin(false);
        toast.success("Logged in successfully");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logoutUser = async () => {
    try {
      const { data } = await api.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        setCartItems({});
        toast.success("Logged out successfully");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // --- Products ---
  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await api.get("/api/product/list");
      if (data.success) setProducts(data.products || []);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  }, []);

  // --- Cart ---
  const addToCart = (id) => setCartItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const updateCartItems = (id, qty) => setCartItems(prev => ({ ...prev, [id]: qty }));
  const removeFromCart = (id) => setCartItems(prev => {
    const copy = { ...prev };
    if (copy[id] > 1) copy[id] -= 1;
    else delete copy[id];
    return copy;
  });

  const getCartCount = () => Object.values(cartItems).reduce((a,b) => a+b,0);
  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const p = products.find(p => p._id === id);
      if (p) total += p.offerPrice * cartItems[id];
    }
    return Math.floor(total*100)/100;
  };

  // --- Sync cart to backend ---
  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(async () => {
      try { await api.post("/api/cart/update", { cartItems }); } catch {}
    }, 500);
    return () => clearTimeout(timeout);
  }, [cartItems, user]);

  useEffect(() => { fetchUser(); fetchProducts(); }, [fetchUser, fetchProducts]);

  return (
    <AppContext.Provider value={{
      navigate, user, setUser, showUserLogin, setShowUserLogin,
      loginUser, logoutUser, products, currency, cartItems,
      addToCart, updateCartItems, removeFromCart, getCartCount, getCartAmount,
      searchQuery, setSearchQuery, fetchProducts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);