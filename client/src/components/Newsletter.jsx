import React, { useState } from "react";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("access_key", "0957a67a-9c43-4f39-b1d1-f260c7ed4021");
    formData.append("email", email);
    formData.append("subject", "🌿 New Newsletter Subscriber — Green Basket");
    formData.append("message", `New subscriber: ${email}`);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        toast.success("You're subscribed! 🎉");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch {
      toast.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-24 px-6 md:px-16 lg:px-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 to-emerald-700 py-14 px-6 md:px-16 text-center shadow-lg">

        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        {/* Leaf emoji accent */}
        <div className="text-4xl mb-3">🌿</div>

        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
          Never Miss a Fresh Deal
        </h2>
        <p className="mt-3 text-white/80 max-w-md mx-auto text-sm md:text-base">
          Join our community and get exclusive offers, early product drops, and seasonal discounts straight to your inbox.
        </p>

        <form onSubmit={onSubmit} className="mt-8 max-w-md mx-auto">
          <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-white/60 transition">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-5 py-3.5 outline-none text-sm text-gray-700 bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 bg-primary hover:bg-emerald-800 text-white font-semibold text-sm transition disabled:opacity-60 rounded-full m-1"
            >
              {loading ? "..." : "Subscribe"}
            </button>
          </div>
          <p className="text-white/50 text-xs mt-3">No spam, unsubscribe anytime.</p>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;