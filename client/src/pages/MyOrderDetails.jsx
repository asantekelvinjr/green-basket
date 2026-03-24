import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const MyOrderDetails = () => {
  const { orderId } = useParams(); // get the dynamic orderId from URL
  const { axios, currency, navigate } = useAppContext();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await axios.get(`/api/order/track/${orderId}`);
      if (data.success) {
        setOrder(data.order);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <p className="mt-16 text-center">Loading...</p>;
  if (!order) return <p className="mt-16 text-center">Order not found</p>;

  return (
    <div className="mt-16 pb-16 max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate("/my-orders")}
        className="mb-6 text-primary font-medium hover:underline"
      >
        &larr; Back to My Orders
      </button>

      {/* ORDER HEADER */}
      <div className="border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-2">Order Details</h1>
        <p>Order ID: {order._id}</p>
        <p>Payment: {order.paymentType}</p>
        <p>Total Amount: {currency}{order.amount}</p>
        <p>Status: {order.status}</p>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 border border-gray-200 rounded-lg"
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <img
                  src={item.product.image[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-sm text-gray-500">{item.product.category}</p>
              </div>
            </div>

            {/* MIDDLE */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>Qty: {item.quantity || 1}</p>
              <p>Price per unit: {currency}{item.product.offerPrice}</p>
            </div>

            {/* RIGHT */}
            <div className="text-right text-lg font-semibold text-primary">
              {currency}{item.product.offerPrice * item.quantity}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrderDetails;