import React from "react";
import { categories } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="mt-16">
      {/* KEEPING YOUR HEADER STYLE */}
      <p className="text-2xl md:text-3xl font-medium">Categories</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">

        {categories.map((category, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
            className="
              group cursor-pointer
              rounded-xl bg-white border border-gray-200
              flex flex-col items-center justify-center text-center
              p-6 md:p-7
              min-h-[140px] md:min-h-[160px]
              transition-all duration-300
              hover:shadow-xl hover:-translate-y-2
            "
          >
            {/* IMAGE */}
            <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-4">
              <img
                src={category.image}
                alt={category.text}
                className="max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>

            {/* TEXT */}
            <p className="text-sm md:text-base font-medium text-gray-700 group-hover:text-primary transition">
              {category.text}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Categories;