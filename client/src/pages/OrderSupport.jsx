import React from "react";

const OrderSupport = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl border border-gray-200">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-primary">
          Order Support
        </h1>
        <p className="text-gray-600 mb-8">
          Need help with your order? Find answers to common issues below.
        </p>

        {/* Sections */}
        <div className="space-y-6">

          {/* Track Order */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Track Your Order
            </h2>
            <p className="text-gray-600 mb-3">
              You can track your order status using your order ID on the tracking page.
            </p>
            <a
              href="/track-orders"
              className="inline-block px-5 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition"
            >
              Track Order
            </a>
          </div>

          {/* Cancel Order */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Cancel an Order
            </h2>
            <p className="text-gray-600">
              Orders can only be cancelled before they are marked as READY or COMPLETED.
              Please contact support immediately if you need to cancel your order.
            </p>
          </div>

          {/* Payment Issues */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Payment Issues
            </h2>
            <p className="text-gray-600">
              If your payment failed but money was deducted, it will be automatically refunded
              within 24 hours. If not, please contact support with your payment reference.
            </p>
          </div>

          {/* Delivery Issues */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-primary mb-2">
              Delivery Issues
            </h2>
            <p className="text-gray-600">
              If your order is delayed or marked as delivered but you haven’t received it,
              please contact our support team immediately.
            </p>
          </div>

        </div>

        {/* Contact */}
        <div className="mt-10 text-center">
          <p className="text-gray-600 mb-3">
            Still need help?
          </p>
          <button className="px-6 py-3 rounded-lg bg-primary text-white hover:opacity-90 transition">
            Contact Support
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSupport;