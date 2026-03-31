import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import api from "../../lib/api";
import toast from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/seller/login", { email, password });
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSeller) navigate("/seller");
  }, [isSeller, navigate]);

  return (
    !isSeller && (
      <div className="min-h-screen flex items-center justify-center bg-[#F6FFFB] px-4">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100 p-8 py-10"
        >
          <div className="text-center mb-2">
            <p className="text-2xl font-semibold text-gray-800">
              <span className="text-primary">Seller</span> Login
            </p>
            <p className="text-xs text-gray-400 mt-1">Access your seller dashboard</p>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="seller@example.com"
              className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 text-sm outline-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="w-full">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="••••••••"
              className="border border-gray-200 rounded-lg w-full p-2.5 mt-1 text-sm outline-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dull transition text-white w-full py-2.5 rounded-full font-medium shadow-sm disabled:opacity-60 mt-1"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;