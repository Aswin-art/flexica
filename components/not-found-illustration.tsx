import React from "react";

const NotFoundIllustration = () => {
  return (
    <div className="relative mx-auto w-64 h-64">
      <div
        className="absolute inset-0 bg-blue-100 rounded-full opacity-50 animate-pulse"
        style={{ animationDuration: "3s" }}
      ></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <svg
          width="160"
          height="120"
          viewBox="0 0 160 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-90"
        >
          <path
            d="M80 20C91.0457 20 100 28.9543 100 40V80C100 91.0457 91.0457 100 80 100C68.9543 100 60 91.0457 60 80V40C60 28.9543 68.9543 20 80 20Z"
            stroke="#2373eb"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_2s_infinite]"
          />
          <path
            d="M40 20C51.0457 20 60 28.9543 60 40V80C60 91.0457 51.0457 100 40 100C28.9543 100 20 91.0457 20 80V40C20 28.9543 28.9543 20 40 20Z"
            stroke="#2373eb"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_1.8s_infinite]"
            style={{ animationDelay: "0.2s" }}
          />
          <path
            d="M120 20C131.046 20 140 28.9543 140 40V80C140 91.0457 131.046 100 120 100C108.954 100 100 91.0457 100 80V40C100 28.9543 108.954 20 120 20Z"
            stroke="#2373eb"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_2.2s_infinite]"
            style={{ animationDelay: "0.4s" }}
          />
          <line
            x1="25"
            y1="60"
            x2="55"
            y2="60"
            stroke="#007DFC"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="105"
            y1="60"
            x2="135"
            y2="60"
            stroke="#007DFC"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <line
            x1="65"
            y1="60"
            x2="95"
            y2="60"
            stroke="#007DFC"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default NotFoundIllustration;
