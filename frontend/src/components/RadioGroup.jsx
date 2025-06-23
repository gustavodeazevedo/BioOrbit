import React from "react";

const RadioGroup = ({
  name,
  value,
  onChange,
  options,
  label,
  required = false,
  className = "",
  disabled = false,
  variant = "default", // 'default', 'inline', 'equipamento'
}) => {  // Mantém os estilos originais exatos do projeto
  if (variant === "equipamento") {
    return (
      <div
        className={`mb-4 p-3 rounded-md border border-gray-200 ${className}`}
      >
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "rgb(75, 85, 99)" }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex space-x-4">
          {options.map((option) => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
                className="form-radio h-5 w-5"
                style={{ color: "rgb(144, 199, 45)" }}
              />
              <span className="ml-2" style={{ color: "rgb(75, 85, 99)" }}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className={className}>
        {label && (
          <label
            className="block text-sm font-medium mb-1"
            style={{ color: "rgb(75, 85, 99)" }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="flex space-x-4">
          {options.map((option) => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
                className="form-radio h-5 w-5"
                style={{ color: "rgb(144, 199, 45)" }}
              />
              <span className="ml-2" style={{ color: "rgb(75, 85, 99)" }}>
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "canais") {
    return (
      <div className={className}>
        <div className="flex space-x-4">
          {options.map((option) => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                disabled={disabled}
                className="form-radio h-4 w-4"
                style={{ color: "rgb(144, 199, 45)" }}
              />
              <span
                className="ml-2 text-sm"
                style={{ color: "rgb(75, 85, 99)" }}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  // Estilo padrão mais moderno (mantido apenas para novos usos)
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
              ${
                value === option.value
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {option.icon && (
                  <option.icon
                    className={`h-5 w-5 ${
                      value === option.value
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  />
                )}
                <span className="font-medium">{option.label}</span>
              </div>
              {option.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
