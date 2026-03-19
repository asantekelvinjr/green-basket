import React from "react";
import { assets, features } from "../assets/assets";

const BottomBanner = () => {
  return (
    <section className="mt-24 px-6 md:px-16 lg:px-24">
      
      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT IMAGE */}
        <div className="relative flex justify-center md:justify-start">
          
          <div className="relative rounded-3xl overflow-hidden shadow-xl max-w-md w-full">
            <img
              src={assets.bottom_banner_image}
              alt="delivery"
              className="w-full h-full object-cover"
            />

            {/* Floating Badge */}
            <div className="absolute bottom-4 left-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold">
              <span className="text-primary">⚡</span>
              Fast Delivery <span className="text-gray-500 font-normal">30 min</span>
            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10">
            Why We Are the Best
          </h2>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex gap-5 p-5 rounded-xl border border-gray-200 bg-white 
                hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                {/* ICON */}
                <div className="bg-[#E8FFF5] rounded-xl p-3 flex items-center justify-center w-14 h-14 shrink-0">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-7 h-7 object-contain"
                  />
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-1 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default BottomBanner;