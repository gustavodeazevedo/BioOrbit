import React from 'react';

const CanalMestreBadge = ({ text = "Master", className = "" }) => {
  return (
    <span className={`ml-3 relative inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-yellow-800 bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 rounded-full border border-yellow-300 shadow-sm overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-yellow-400/20 transform -skew-x-12 -translate-x-full animate-pulse"></div>
      <div className="relative flex items-center">
        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-ping"></div>
        <div className="w-2 h-2 bg-yellow-600 rounded-full mr-2 absolute left-0"></div>
        <span className="tracking-wide">{text}</span>
      </div>
    </span>
  );
};

export default CanalMestreBadge;
