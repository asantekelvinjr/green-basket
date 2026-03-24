import React from "react";

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Return & Refund Policy
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. Since we deal with food products, we
          take quality and safety seriously. Please read our policy carefully.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            1. Returns
          </h2>
          <p className="text-gray-600">
            Due to the nature of food items, we do not accept returns once the
            product has been delivered. However, exceptions may apply in certain
            cases (see below).
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            2. Refund Eligibility
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Damaged or spoiled items upon delivery</li>
            <li>Incorrect items received</li>
            <li>Missing items from your order</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            3. How to Request a Refund
          </h2>
          <p className="text-gray-600">
            If you experience any issue with your order, please contact us within
            24 hours of delivery with:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
            <li>Your order number</li>
            <li>A description of the issue</li>
            <li>Photos of the product (if applicable)</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            4. Refund Process
          </h2>
          <p className="text-gray-600">
            Once your request is reviewed and approved, refunds will be processed
            within 3–5 business days to your original payment method.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            5. Non-Refundable Situations
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Change of mind after delivery</li>
            <li>Incorrect delivery address provided</li>
            <li>Failure to receive order at delivery time</li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h2>
          <p className="text-gray-600">
            If you have any questions about our refund policy, feel free to reach
            out to our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;