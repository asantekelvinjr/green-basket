import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔥 UPDATE ORDER STATUS
  const updateStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put("/api/order/update-status", {
        orderId,
        status: newStatus,
      });

      if (data.success) {
        toast.success("Order updated");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🎨 STATUS COLORS
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

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll">
      <div className="md:p-10 p-4 space-y-6">
        
        <h2 className="text-xl font-semibold">Orders Management</h2>

        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4"
          >
            {/* 🔥 HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between gap-2 text-sm text-gray-500 border-b border-black/10 pb-3">
              <span>Order ID: {order._id}</span>
              <span>
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="font-semibold text-black">
                {currency}
                {order.amount}
              </span>
            </div>

            {/* 🔥 STATUS + PAYMENT */}
            <div className="flex flex-wrap gap-3 items-center">
              
              {/* STATUS BADGE */}
              <span
                className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>

              {/* PAYMENT */}
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  order.paymentStatus
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.paymentStatus ? "PAID" : "PENDING"}
              </span>

              <span className="text-sm text-gray-500">
                {order.paymentType}
              </span>
            </div>

            {/* 🔥 MAIN CONTENT */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* ITEMS */}
              <div>
                <p className="text-sm font-semibold mb-2">Items</p>
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    {item.product.name}{" "}
                    <span className="text-primary">
                      x{item.quantity}
                    </span>
                  </p>
                ))}
              </div>

              {/* CUSTOMER */}
              <div>
                <p className="text-sm font-semibold mb-2">Customer</p>
                <p className="text-sm text-gray-700">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {order.address.street}, {order.address.city}
                </p>
                <p className="text-sm text-gray-500">
                  {order.address.phone}
                </p>
              </div>

              {/* 🔥 STATUS CONTROL */}
              <div>
                <p className="text-sm font-semibold mb-2">
                  Update Status
                </p>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="READY">READY</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;