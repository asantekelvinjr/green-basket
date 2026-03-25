import React from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [result, setResult] = React.useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Subscribing...");

    const formData = new FormData(event.target);

    // ✅ Your Web3Forms access key
    formData.append("access_key", "0957a67a-9c43-4f39-b1d1-f260c7ed4021");

    // Optional (helps identify form)
    formData.append("subject", "New Newsletter Subscription");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Subscribed successfully 🎉");
      setResult("");
      event.target.reset();
    } else {
      console.log("Error", data);
      toast.error(data.message || "Something went wrong");
      setResult("");
    }
  };

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
        <form onSubmit={onSubmit} className="mt-8 max-w-xl mx-auto">
          <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/30 transition">

            <input
              type="email"
              name="email"  // ✅ IMPORTANT for Web3Forms
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 outline-none text-sm text-gray-700"
            />

            <button
              type="submit"
              className="px-6 md:px-8 py-3 bg-primary text-white font-medium hover:bg-primary-dull transition"
            >
              {result ? result : "Subscribe"}
            </button>
          </div>
        </form>

      </div>
    </section>
  );
};

export default Newsletter;