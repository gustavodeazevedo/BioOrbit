import React from "react";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  error = null,
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "rgb(75, 85, 99)" }}
      >
        {label}
      </label>{" "}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border transition-colors ${
          error ? "border-red-500" : "border-gray-300 focus:border-green-500"
        } rounded-md focus:outline-none ${className}`}
        style={{
          borderColor: error ? "#ef4444" : "#d1d5db",
          color: "rgb(75, 85, 99)",
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = "rgb(144, 199, 45)";
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.target.style.borderColor = "#d1d5db";
          }
        }}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
