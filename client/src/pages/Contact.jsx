import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here (API or email)
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-24 max-w-4xl mx-auto">
      
      {/* HEADER */}
      <h1 className="text-3xl md:text-4xl font-medium text-primary mb-6">
        Contact Us
      </h1>
      <p className="text-sm md:text-base text-gray-600 mb-10">
        Have questions or feedback? We’d love to hear from you. Fill out the form below and we’ll get back to you as soon as possible.
      </p>

      {/* CONTACT FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* NAME */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300 text-gray-800"
            required
          />
        </div>

        {/* EMAIL */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300 text-gray-800"
            required
          />
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col">
          <label className="text-gray-700 font-medium mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={6}
            className="p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary transition duration-300 text-gray-800 resize-none"
            required
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="bg-primary text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition duration-300"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;