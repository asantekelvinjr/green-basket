import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

// --- Create App Context ---
export const AppContext = createContext();

// --- Provider ---
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || "₵";

  // --- Axios instance ---
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  if (!BASE_URL || BASE_URL === "http://localhost:4000") {
    console.warn(
      "VITE_BACKEND_URL is not set or defaulting to localhost. Login may fail in production!"
    );
  }

  const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // --- State ---
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // --- Auth functions ---
  const fetchUser = async () => {
    try {
      if (!api?.get) throw new Error("Axios instance is undefined!");
      const { data } = await api.get("/api/user/is-auth");
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

  // const loginUser = async (email, password) => {
  //   try {
  //     if (!api?.post) throw new Error("Axios instance is undefined!");
  //     const { data } = await api.post("/api/user/login", { email, password });

  //     if (data.success) {
  //       setUser(data.user);
  //       setShowUserLogin(false);
  //       toast.success("Logged in successfully!");
  //     } else {
  //       toast.error(data.message || "Login failed");
  //     }
  //   } catch (error) {
  //     console.error("loginUser error:", error);
  //     toast.error(error.message || "Login failed");
  //   }
  // };

  const loginUser = async (email, password) => {
  try {
    if (!api?.post) throw new Error("Axios instance is undefined!");

    // --- DEBUG LOG ---
    console.log("[DEBUG] Attempting login:", {
      url: `${BASE_URL}/api/user/login`,
      payload: { email, password },
      headers: api.defaults.headers,
    });

    const { data } = await api.post("/api/user/login", { email, password });

    if (data.success) {
      setUser(data.user);
      setShowUserLogin(false);
      toast.success("Logged in successfully!");
      console.log("[DEBUG] Login successful:", data.user);
    } else {
      toast.error(data.message || "Login failed");
      console.warn("[DEBUG] Login failed:", data.message);
    }
  } catch (error) {
    console.error("[DEBUG] loginUser error:", error);
    toast.error(error.message || "Login failed");
  }
};

  const logoutUser = async () => {
    try {
      if (!api?.get) throw new Error("Axios instance is undefined!");
      const { data } = await api.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        toast.success("Logged out successfully!");
      }
    } catch (error) {
      console.error("logoutUser error:", error);
      toast.error(error.message || "Logout failed");
    }
  };

  // --- Product functions ---
  const fetchProducts = async () => {
    try {
      if (!api?.get) throw new Error("Axios instance is undefined!");
      const { data } = await api.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (error) {
      console.error("fetchProducts error:", error);
      toast.error(error.message || "Failed to fetch products");
    }
  };

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

  const getCartCount = () =>
    Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) total += product.offerPrice * cartItems[id];
    }
    return Math.floor(total * 100) / 100;
  };

  // --- Sync cart to backend ---
  useEffect(() => {
    if (!user) return;

    const updateCart = async () => {
      try {
        if (!api?.post) throw new Error("Axios instance is undefined!");
        const { data } = await api.post("/api/cart/update", { cartItems });
        if (!data.success) toast.error(data.message);
      } catch (error) {
        console.error("updateCart error:", error);
        toast.error(error.message || "Failed to update cart");
      }
    };

    updateCart();
  }, [cartItems, user]);

  // --- Initial fetch ---
  useEffect(() => {
    fetchUser();
    fetchProducts();
  }, []);

  // --- Context value ---
  const value = {
    navigate,
    user,
    setUser,
    loginUser,
    logoutUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
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

// --- Hook to use context ---
export const useAppContext = () => useContext(AppContext);