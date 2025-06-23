import React from "react";

const VolumeInputPoint = ({
  label,
  volumeValue,
  unitValue,
  onVolumeChange,
  onUnitChange,
  placeholder = "Volume nominal",
  required = false,
  className = "",
  disabled = false,
  volumeProps = {},
  unitProps = {},
}) => {
  return (
    <div>
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: "rgb(75, 85, 99)" }}
      >
        {label}
      </label>
      <div className="flex">
        {" "}
        <input
          type="text"
          value={volumeValue}
          onChange={onVolumeChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-3 py-2 border border-gray-300 rounded-l-md transition-colors focus:border-green-500 focus:outline-none ${className}`}
          style={{
            borderColor: "#d1d5db",
            color: "rgb(75, 85, 99)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgb(144, 199, 45)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
          }}
          {...volumeProps}
        />
        <select
          value={unitValue}
          onChange={onUnitChange}
          disabled={disabled}
          className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md transition-colors focus:border-green-500 focus:outline-none"
          style={{
            borderColor: "#d1d5db",
            color: "rgb(75, 85, 99)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgb(144, 199, 45)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#d1d5db";
          }}
          {...unitProps}
        >
          <option value="µL">µL</option>
          <option value="mL">mL</option>
        </select>
      </div>
    </div>
  );
};

export default VolumeInputPoint;
