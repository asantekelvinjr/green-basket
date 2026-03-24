import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const TrackOrders = () => {
  const { user } = useAppContext();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

  const steps = [
    { name: "PLACED", icon: "📦" },
    { name: "CONFIRMED", icon: "✔" },
    { name: "READY", icon: "🚚" },
    { name: "COMPLETED", icon: "🏠" },
  ];

  const getStepIndex = (status) =>
    steps.findIndex((step) => step.name === status);

  const handleTrack = async () => {
    if (!user) {
      setError("You must be logged in to track an order.");
      return;
    }

    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/order/track/${orderId}`
      );
      const data = res.data;

      if (!data.success) {
        setError(data.message || "Order not found");
      } else {
        setOrder(data.order);
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Track Your Order
        </h1>
        <p className="text-gray-500 mb-6">
          Enter your order ID to see delivery progress
        </p>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="e.g. 65f8c2a9..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            disabled={!user}
          />
          <button
            onClick={handleTrack}
            className={`px-6 rounded-lg transition ${
              user
                ? "bg-primary text-white hover:bg-primary-dull"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
            disabled={loading || !user}
          >
            {loading ? "Tracking..." : "Track"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Result */}
        {order && (
          <div className="border border-gray-200 rounded-xl p-6 bg-white">
            {/* Order Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id || "N/A"}</p>
            </div>

            {/* Status Progress Tracker */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">Order Status</p>

              <div className="flex items-center">
                {steps.map((step, index) => {
                  const currentIndex = getStepIndex(order.status);
                  const completed = index <= currentIndex;

                  return (
                    <React.Fragment key={step.name}>
                      {/* Step */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                            completed
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p className="text-xs mt-2">{step.name}</p>
                      </div>

                      {/* Line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 ${
                            index < currentIndex
                              ? "bg-black"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Payment</p>
                <p className="font-medium">
                  {order.paymentStatus || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Amount</p>
                <p className="font-medium">
                  ₵{order.amount ?? "0.00"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="mt-4 bg-yellow-50 text-yellow-700 p-3 rounded-lg">
            You must be logged in to track an order.
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrders;