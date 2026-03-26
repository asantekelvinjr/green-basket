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

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// --- Create context ---
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₵";

  // --- Axios defaults (global, like old version) ---
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  console.log("AppContext: Using backend URL:", BASE_URL);
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.withCredentials = true;

  // --- State ---
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // --- Fetch seller auth ---
  const fetchSeller = async () => {
    try {
      console.log("fetchSeller: Checking seller auth...");
      const { data } = await axios.get("/api/seller/is-auth");
      console.log("fetchSeller: Response:", data);
      setIsSeller(!!data.success);
    } catch (error) {
      console.error("fetchSeller error:", error);
      setIsSeller(false);
    }
  };

  // --- Fetch user auth ---
  const fetchUser = async () => {
    try {
      console.log("fetchUser: Checking user auth...");
      const { data } = await axios.get("/api/user/is-auth");
      console.log("fetchUser: Response:", data);
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("fetchUser error:", error);
      setUser(null);
    }
  };

  // --- Login ---
  const loginUser = async (email, password) => {
    try {
      console.log("loginUser: Posting login request", { email });
      const { data } = await axios.post("/api/user/login", { email, password });
      console.log("loginUser: Response:", data);
      if (data.success) {
        setUser(data.user);
        setShowUserLogin(false);
        toast.success("Logged in successfully!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("loginUser error:", error);
      toast.error(error.response?.data?.message || error.message || "Login failed");
    }
  };

  // --- Logout ---
  const logoutUser = async () => {
    try {
      console.log("logoutUser: Logging out...");
      const { data } = await axios.get("/api/user/logout");
      console.log("logoutUser: Response:", data);
      if (data.success) {
        setUser(null);
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error("logoutUser error:", error);
      toast.error(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  // --- Fetch products ---
  const fetchProducts = async () => {
    try {
      console.log("fetchProducts: Fetching products...");
      const { data } = await axios.get("/api/product/list");
      console.log("fetchProducts: Response:", data);
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      console.error("fetchProducts error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch products");
    }
  };

  // --- Cart functions ---
  const addToCart = (itemId) => {
    console.log("addToCart:", itemId);
    const newCart = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(newCart);
    toast.success("Added to cart");
  };

  const updateCartItems = (itemId, quantity) => {
    console.log("updateCartItems:", itemId, quantity);
    const newCart = { ...cartItems, [itemId]: quantity };
    setCartItems(newCart);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    console.log("removeFromCart:", itemId);
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

  // --- Sync cart to backend when cartItems changes ---
  useEffect(() => {
    if (!user) return;
    console.log("Cart changed, syncing to backend...", cartItems);

    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });
        console.log("updateCart response:", data);
        if (!data.success) toast.error(data.message);
      } catch (error) {
        console.error("updateCart error:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to update cart");
      }
    };

    updateCart();
  }, [cartItems, user]);

  // --- Initial fetch ---
  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

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
    searchQuery,
    setSearchQuery,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);