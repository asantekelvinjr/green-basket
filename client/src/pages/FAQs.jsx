import React, { useState } from "react";
import { faqsData } from "../assets/assets";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="mt-16 px-6 md:px-16 lg:px-24">

      {/* HEADER */}
      <p className="text-3xl md:text-4xl font-medium mb-8">
        Frequently Asked Questions
      </p>

      {/* FAQ LIST */}
      <div className="space-y-5 max-w-4xl">
        {faqsData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl bg-white transition-all duration-300"
          >
            
            {/* QUESTION */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left p-5 md:p-6 lg:p-7 cursor-pointer"
            >
              <span className="text-base md:text-lg lg:text-xl font-medium text-gray-800">
                {faq.question}
              </span>

              <span className="text-primary text-2xl md:text-3xl">
                {activeIndex === index ? "-" : "+"}
              </span>
            </button>

            {/* ANSWER */}
            <div
              className={`overflow-hidden transition-all duration-300 ${
                activeIndex === index
                  ? "max-h-60 px-5 md:px-6 lg:px-7 pb-5 md:pb-6"
                  : "max-h-0"
              }`}
            >
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default FAQs;