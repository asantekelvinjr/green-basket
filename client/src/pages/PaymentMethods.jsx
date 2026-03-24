import React from "react";

const PaymentMethods = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Payment Methods
        </h1>

        <p className="text-gray-600 mb-6">
          We offer flexible and secure payment options to make your shopping
          experience smooth and convenient.
        </p>

        {/* Section 1 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            1. Online Payment (Paystack)
          </h2>
          <p className="text-gray-600">
            You can securely pay online using Paystack. We accept:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mt-2 space-y-2">
            <li>Debit and Credit Cards</li>
            <li>Mobile Money (where available)</li>
            <li>Bank Transfers</li>
          </ul>
          <p className="text-gray-600 mt-2">
            All transactions are encrypted and processed securely through
            Paystack.
          </p>
        </div>

        {/* Section 2 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            2. Payment on Delivery
          </h2>
          <p className="text-gray-600">
            You can choose to pay when your order is delivered. Please ensure you
            have the exact amount ready, as our delivery agents may have limited
            change.
          </p>
        </div>

        {/* Section 3 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            3. Payment Confirmation
          </h2>
          <p className="text-gray-600">
            After a successful online payment, you will receive a confirmation
            via email or SMS. For cash on delivery, confirmation is made upon
            receipt of payment.
          </p>
        </div>

        {/* Section 4 */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            4. Security
          </h2>
          <p className="text-gray-600">
            We prioritize your security. All online transactions are handled via
            trusted and secure payment gateways to protect your personal and
            financial information.
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Need Help?
          </h2>
          <p className="text-gray-600">
            If you experience any issues with payments, please contact our
            support team for assistance.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PaymentMethods;