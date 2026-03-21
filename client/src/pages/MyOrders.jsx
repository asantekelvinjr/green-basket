import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  // 🔥 FILTER LOGIC
  const filteredOrders = myOrders.filter((order) => {
    if (filter === "ALL") return true;

    if (filter === "PENDING")
      return ["PLACED", "CONFIRMED"].includes(order.status);

    if (filter === "READY") return order.status === "READY";

    if (filter === "COMPLETED") return order.status === "COMPLETED";

    if (filter === "CANCELLED") return order.status === "CANCELLED";

    return true;
  });

  // 🔥 STATUS BADGE
  const getStatusStyle = (status) => {
    switch (status) {
      case "PLACED":
      case "CONFIRMED":
        return "bg-yellow-100 text-yellow-700";
      case "READY":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPaymentStyle = (paymentStatus) => {
    return paymentStatus === "PAID"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="mt-16 pb-16">
      {/* HEADER */}
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My Orders</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>

      {/* 🔥 FILTER TABS */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {["ALL", "PENDING", "READY", "COMPLETED", "CANCELLED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-sm border transition
              ${
                filter === tab
                  ? "bg-primary text-white border-primary"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      {filteredOrders.map((order, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-xl mb-10 p-5 max-w-4xl shadow-sm hover:shadow-md transition"
        >
          {/* ORDER HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center text-sm text-gray-500 gap-2 border-b border-black/10 pb-4 mb-4">
            <span>Order ID: {order._id}</span>
            <span>Payment: {order.paymentType}</span>
            <span>
              Total: {currency}
              {order.amount}
            </span>
          </div>

          {/* 🔥 STATUS + PAYMENT */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <span
              className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                order.status,
              )}`}
            >
              {order.status}
            </span>

            <span
              className={`px-3 py-1 text-xs rounded-full ${getPaymentStyle(
                order.paymentStatus || "PENDING",
              )}`}
            >
              {order.paymentStatus || "PENDING"}
            </span>
          </div>

          {/* ITEMS */}
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row md:items-center justify-between gap-6 py-4 ${
                order.items.length !== index + 1 && "border-b border-black/10"
              }`}
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <img
                    src={item.product.image[0]}
                    alt=""
                    className="w-16 h-16 object-contain"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {item.product.category}
                  </p>
                </div>
              </div>

              {/* MIDDLE */}
              <div className="text-sm text-gray-500 space-y-1">
                <p>Qty: {item.quantity || 1}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {/* RIGHT */}
              <div className="text-right">
                <p className="text-primary font-semibold text-lg">
                  {currency} {item.product.offerPrice * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
