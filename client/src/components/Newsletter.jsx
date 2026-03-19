import React from "react";

const Newsletter = () => {
  return (
    <section className="mt-24 px-6 md:px-16 lg:px-24">
      
      <div className="bg-[#F6FFFB] border border-[#E0F5EC] rounded-2xl py-12 px-6 md:px-12 text-center shadow-sm">

        {/* Heading */}
        <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
          Never Miss a Deal
        </h1>

        {/* Subtext */}
        <p className="mt-3 text-gray-600 max-w-xl mx-auto text-sm md:text-base">
          Get exclusive offers, early product drops, and special discounts straight to your inbox.
        </p>

        {/* Form */}
        <form className="mt-8 max-w-xl mx-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition">

            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 outline-none text-sm text-gray-700"
            />

            <button
              type="submit"
              className="px-6 md:px-8 py-3 bg-primary text-white font-medium hover:bg-primary-dull transition"
            >
              Subscribe
            </button> 

          </div>
        </form>

      </div>

    </section>
  );
};

export default Newsletter;