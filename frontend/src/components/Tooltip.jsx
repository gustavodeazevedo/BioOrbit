import React, { useState } from "react";

const Tooltip = ({ children, text }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        className="inline-block"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div
          className="absolute z-10 px-3 py-2 text-xs font-medium text-white bg-gray-700 rounded-lg shadow-sm 
                       -translate-x-1/2 left-1/2 -top-10 min-w-max animate-fade-in"
        >
          {text}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-t-4 border-l-4 border-r-4 
                         border-transparent border-t-gray-700 w-0 h-0"
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
