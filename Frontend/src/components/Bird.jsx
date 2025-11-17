import React from "react";

const Bird = ({ className = "" }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-2xl">
      {/* Body */}
      <ellipse cx="100" cy="140" rx="55" ry="65" fill="#f0f0f0" />
      {/* Belly */}
      <ellipse cx="100" cy="150" rx="40" ry="50" fill="white" />
      {/* Head */}
      <circle cx="100" cy="80" r="45" fill="#f0f0f0" />
        {/* Green feather - simple decorative path (fixed) */}
        <path d="M100 35 Q85 20 90 45 T100 35" fill="#58cc02" />
      {/* Eyes */}
      <circle cx="85" cy="75" r="12" fill="white" />
      <circle cx="115" cy="75" r="12" fill="white" />
      <circle cx="88" cy="75" r="8" fill="#2b2b2b" />
      <circle cx="118" cy="75" r="8" fill="#2b2b2b" />
      {/* Beak */}
      <path d="M 100 85 L 110 95 L 100 98 Z" fill="#ff9600" />
      {/* Wings */}
      <ellipse cx="60" cy="140" rx="25" ry="45" fill="#58cc02" />
      <ellipse cx="140" cy="140" rx="25" ry="45" fill="#58cc02" />
    </svg>
  </div>
);

export default Bird;
