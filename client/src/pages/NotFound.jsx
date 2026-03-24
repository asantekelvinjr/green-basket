import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 md:px-16 lg:px-24 bg-gray-50 text-center">
      
      {/* 404 CODE */}
      <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">
        404
      </h1>

      {/* MESSAGE */}
      <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-800 mb-4">
        Oops! Page not found.
      </p>

      <p className="text-sm md:text-base text-gray-600 mb-8 max-w-md">
        The page you’re looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* BUTTON */}
      <button
        onClick={() => navigate("/")}
        className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:opacity-90 transition duration-300"
      >
        Go Back Home
      </button>

    </div>
  );
};

export default NotFound;