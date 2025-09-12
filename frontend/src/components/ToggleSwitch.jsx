import React from "react";

// Constantes de configuração centralizada
const TOGGLE_CONFIG = {
  COLORS: {
    PRIMARY: "rgb(75, 85, 99)",
    GRAY: "bg-gray-300",
  },
  SIZES: {
    sm: {
      container: "w-8 h-4",
      circle: "w-3 h-3",
      translate: "translate-x-4",
    },
    md: {
      container: "w-11 h-6",
      circle: "w-5 h-5",
      translate: "translate-x-5",
    },
    lg: {
      container: "w-14 h-8",
      circle: "w-6 h-6",
      translate: "translate-x-6",
    },
  },
  COLOR_VARIANTS: {
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    red: "bg-red-500",
  },
};

// Utilitários para geração de classes CSS
const StyleUtils = {
  buildSizeStyles: (size) => {
    return TOGGLE_CONFIG.SIZES[size] || TOGGLE_CONFIG.SIZES.md;
  },

  buildColorStyles: (color, isChecked) => {
    const activeColor =
      TOGGLE_CONFIG.COLOR_VARIANTS[color] || TOGGLE_CONFIG.COLOR_VARIANTS.green;
    return isChecked ? activeColor : TOGGLE_CONFIG.COLORS.GRAY;
  },

  buildContainerClasses: (
    sizeConfig,
    colorClass,
    isDisabled,
    customClassName
  ) => {
    return [
      "relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
      sizeConfig.container,
      colorClass,
      isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      customClassName,
    ].join(" ");
  },

  buildCircleClasses: (sizeConfig, isChecked) => {
    return [
      "inline-block bg-white rounded-full shadow transform ring-0 transition ease-in-out duration-200",
      sizeConfig.circle,
      isChecked ? sizeConfig.translate : "translate-x-0",
    ].join(" ");
  },
};

// Componente de Label reutilizável
const ToggleLabel = ({ label, labelFor }) => {
  if (!label) return null;

  return (
    <label
      className="block text-sm font-medium mb-2"
      style={{ color: TOGGLE_CONFIG.COLORS.PRIMARY }}
      htmlFor={labelFor}
    >
      {label}
    </label>
  );
};

// Componente de Status Text reutilizável
const StatusText = ({ isChecked, onToggle, label }) => {
  if (!label) return null;

  return (
    <span
      className="ml-3 text-sm text-gray-700 cursor-pointer"
      onClick={onToggle}
    >
      {isChecked ? "Ativo" : "Inativo"}
    </span>
  );
};

const ToggleSwitch = ({
  name,
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
  size = "md",
  color = "green",
}) => {
  const handleToggle = () => {
    if (disabled || !onChange) return;

    const syntheticEvent = {
      target: { name, checked: !checked },
    };
    onChange(syntheticEvent);
  };

  // Configuração de estilos usando utilitários
  const sizeConfig = StyleUtils.buildSizeStyles(size);
  const colorClass = StyleUtils.buildColorStyles(color, checked);
  const containerClasses = StyleUtils.buildContainerClasses(
    sizeConfig,
    colorClass,
    disabled,
    className
  );
  const circleClasses = StyleUtils.buildCircleClasses(sizeConfig, checked);

  return (
    <div className="flex flex-col">
      <ToggleLabel label={label} labelFor={name} />
      <div className="flex items-center">
        <button
          id={name}
          type="button"
          className={containerClasses}
          onClick={handleToggle}
          disabled={disabled}
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${name}-label` : undefined}
        >
          <span className={circleClasses} />
        </button>
        <StatusText isChecked={checked} onToggle={handleToggle} label={label} />
      </div>
    </div>
  );
};

export default ToggleSwitch;
