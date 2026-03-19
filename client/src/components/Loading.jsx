import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";

const Loading = () => {
  const { navigate } = useAppContext();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const nextUrl = query.get("next");

  useEffect(() => {
    // disable scrolling while loader is active
    document.body.style.overflow = "hidden";

    if (nextUrl) {
      const timer = setTimeout(() => {
        navigate(`/${nextUrl}`);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [nextUrl, navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="h-24 w-24 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
    </div>
  );
};

export default Loading;