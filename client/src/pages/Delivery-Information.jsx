import React from "react";

const DeliveryInformation = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Delivery Information
        </h1>

        <p className="text-gray-600 mb-6">
          We are committed to delivering your food fresh and on time. Below are
          the details of our delivery process.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            1. Delivery Areas
          </h2>
          <p className="text-gray-600">
            We currently deliver to selected locations. Enter your address at
            checkout to confirm availability in your area.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            2. Delivery Time
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Standard delivery: 1–3 business days</li>
            <li>Same-day delivery available for selected locations</li>
            <li>Orders are processed within 24 hours</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            3. Delivery Fees
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Delivery fees vary based on your location</li>
            <li>Free delivery on orders above a certain amount</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            4. Order Tracking
          </h2>
          <p className="text-gray-600">
            Once your order is shipped, you will receive a tracking link via
            email or SMS to monitor your delivery in real time.
          </p>
        </div>

        {/* Section 5 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            5. Important Notes
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Please ensure your contact details are correct</li>
            <li>Someone must be available to receive the order</li>
            <li>Delays may occur during peak periods or bad weather</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h2>
          <p className="text-gray-600">
            If you have questions about delivery, feel free to contact our
            support team.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DeliveryInformation;