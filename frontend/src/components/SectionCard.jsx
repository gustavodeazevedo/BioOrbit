import React from "react";

const SectionCard = ({
  children,
  title,
  icon: Icon,
  variant = "default",
  className = "",
  headerClassName = "",
  contentClassName = "",
}) => {
  return (
    <div className={`p-4 rounded-md border border-gray-200 ${className}`}>
      {" "}
      {title && (
        <h3
          className={`text-lg font-semibold mb-3 py-2 px-3 relative ${headerClassName}`}
          style={{
            color: "rgb(75, 85, 99)",
          }}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
            style={{
              background:
                "linear-gradient(180deg, rgb(144, 199, 45), rgb(120, 170, 35))",
            }}
          />
          {Icon && (
            <Icon
              className="mr-2 inline"
              style={{ color: "rgb(144, 199, 45)" }}
            />
          )}
          {title}
        </h3>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default SectionCard;
