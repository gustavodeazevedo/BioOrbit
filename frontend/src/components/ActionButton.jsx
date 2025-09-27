import React from "react";

const ActionButton = ({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  disabled = false,
  type = "button",
  className = "",
  title,
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          className:
            "text-white px-6 py-2 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 transition-colors font-medium",
          style: {
            backgroundColor: "rgb(120, 170, 80)",
            "--tw-ring-color": "rgb(120, 170, 80)",
          },
          hoverColor: "rgb(100, 150, 60)",
          defaultColor: "rgb(120, 170, 80)",
        };
      case "secondary":
        return {
          className:
            "text-white px-6 py-2 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 transition-colors font-medium",
          style: {
            backgroundColor: "rgb(144, 199, 45)",
            "--tw-ring-color": "rgb(144, 199, 45)",
          },
          hoverColor: "rgb(130, 180, 40)",
          defaultColor: "rgb(144, 199, 45)",
        };
      case "success":
        return {
          className:
            "flex items-center text-sm px-3 py-1.5 rounded-md border border-green-300",
          style: {
            backgroundColor: "rgb(240, 253, 244)",
            color: "rgb(34, 197, 94)",
          },
          hoverColor: "rgb(220, 252, 231)",
          defaultColor: "rgb(240, 253, 244)",
        };
      case "gray":
        return {
          className:
            "px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500",
          style: {
            color: "rgb(75, 85, 99)",
          },
          hoverColor: "rgb(229, 231, 235)",
          defaultColor: "rgb(243, 244, 246)",
        };
      case "outline-green":
        return {
          className:
            "flex items-center text-sm px-3 py-1.5 rounded-md border transition-colors duration-200 bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
          style: {},
          hoverColor: "rgb(240, 253, 244)",
          defaultColor: "rgb(249, 250, 251)",
        };
      case "automation-active":
        // Estilos básicos com animações modernas
        return {
          className:
            "relative flex items-center text-sm px-3 py-1.5 rounded-md border transition-all duration-300 bg-green-100 text-green-800 border-green-300 hover:bg-green-200 automation-active",
          style: {},
          hoverColor: "rgb(220, 252, 231)",
          defaultColor: "rgb(240, 253, 244)",
        };
      case "automation-inactive":
        // Estilos básicos - sem animações
        return {
          className:
            "relative flex items-center text-sm px-3 py-1.5 rounded-md border transition-all duration-300 bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 automation-inactive",
          style: {},
          hoverColor: "rgb(229, 231, 235)",
          defaultColor: "rgb(243, 244, 246)",
        };
      case "outline":
        return {
          className:
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-white hover:bg-gray-50 px-6 py-2",
          style: {
            borderColor: "rgb(209, 213, 219)",
            color: "rgb(75, 85, 99)",
            "--tw-ring-color": "rgb(144, 199, 45)",
          },
          hoverColor: "rgb(249, 250, 251)",
          defaultColor: "white",
        };
      case "outline-small":
        return {
          className:
            "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground px-3 py-1.5",
          style: {
            borderColor: "rgb(144, 199, 45)",
            color: "white",
            backgroundColor: "rgb(144, 199, 45)",
            "--tw-ring-color": "rgb(144, 199, 45)",
          },
          hoverColor: "rgb(130, 180, 40)",
          defaultColor: "rgb(144, 199, 45)",
        };
      default:
        return {
          className:
            "text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2",
          style: {
            backgroundColor: "rgb(144, 199, 45)",
            "--tw-ring-color": "rgb(144, 199, 45)",
          },
          hoverColor: "rgb(130, 180, 40)",
          defaultColor: "rgb(144, 199, 45)",
        };
    }
  };

  const buttonConfig = getVariantStyles();

  const handleMouseEnter = (e) => {
    if (!disabled && buttonConfig.hoverColor) {
      e.target.style.backgroundColor = buttonConfig.hoverColor;
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && buttonConfig.defaultColor) {
      e.target.style.backgroundColor = buttonConfig.defaultColor;
    }
  };

  // Determine icon spacing based on variant
  const getIconClassName = () => {
    if (!children) return "";
    if (variant === "outline-small" || variant === "outline") return "";
    return "mr-2";
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${buttonConfig.className} ${className}`}
      style={{
        ...buttonConfig.style,
        ...style,
        ...(disabled && { opacity: 0.5, cursor: "not-allowed" }),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Icon && <Icon className={getIconClassName()} />}
      {children}
    </button>
  );
};

export default ActionButton;
