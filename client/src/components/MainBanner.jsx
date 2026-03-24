import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const slides = [
  {
    bg: assets.hero_slider_1,
    bgSm: assets.hero_slider_1_sm,
    title: "Freshness You Can Trust, Savings You Will Love!",
    btn1: "Shop Now",
    btn2: "Explore deals",
  },
  {
    bg: assets.hero_slider_3, // 👉 add in assets
    bgSm: assets.main_banner_bg_sm,
    title: "Up to 50% Off Daily Essentials",
    btn1: "Shop Deals",
    btn2: "View Offers",
  },
  {
    bg: assets.main_banner_bg,
    bgSm: assets.main_banner_bg_sm,
    title: "Start Selling & Grow Your Business",
    btn1: "Become Seller",
    btn2: "Learn More",
  },
];

const MainBanner = () => {
  return (
    <div className="relative">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        className="w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              {/* Desktop Image */}
              <img
                src={slide.bg}
                alt="banner"
                  className="w-full h-[400px] md:h-[400px] lg:h-[500px] object-cover hidden md:block rounded-xl "

              />

              {/* Mobile Image */}
              <img src={slide.bgSm} alt="banner"  className="w-full h-[600px] object-cover md:hidden" />

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col items-center md:items-start justify-end
                md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24"
              >
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold
                  text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105
                  leading-tight lg:leading-15"
                >
                  {slide.title}
                </h1>

                <div className="flex items-center mt-6 font-medium">
                  {/* Primary Button */}
                  <Link
                    to={"/products"}
                    className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-primary
                    hover:bg-primary-dull transition rounded text-white cursor-pointer"
                  >
                    {slide.btn1}
                    <img
                      className="md:hidden transition group-hover:translate-x-1"
                      src={assets.white_arrow_icon}
                      alt="arrow"
                    />
                  </Link>

                  {/* Secondary Button */}
                  <Link
                    to={"/products"}
                    className="group hidden md:flex items-center gap-2 px-9 py-3 cursor-pointer"
                  >
                    {slide.btn2}
                    <img
                      className="transition group-hover:translate-x-1"
                      src={assets.black_arrow_icon}
                      alt="arrow"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MainBanner;
