import React, { useState, useEffect, useRef } from "react";

const UNIT_OPTIONS = [
  { value: "µL", label: "µL" },
  { value: "mL", label: "mL" },
];

const COLORS = {
  TEXT: "rgb(75, 85, 99)",
  BORDER_DEFAULT: "#d1d5db",
  BORDER_FOCUS: "rgb(144, 199, 45)",
};

const BASE_STYLES = {
  borderColor: COLORS.BORDER_DEFAULT,
  color: COLORS.TEXT,
};

const BASE_CLASSES = {
  INPUT:
    "w-full px-3 py-2 border border-gray-300 rounded-l-md transition-colors focus:border-green-500 focus:outline-none",
  SELECT:
    "px-3 py-2 border border-l-0 border-gray-300 rounded-r-md transition-colors focus:border-green-500 focus:outline-none",
  LABEL: "block text-sm font-medium mb-1",
};

const VolumeInputIsolado = React.memo(function VolumeInputIsolado({
  label,
  volumeName,
  unitName,
  volumeValue,
  unitValue,
  onChange,
  placeholder = "Volume",
  required = false,
  className = "",
  disabled = false,
}) {
  const [localVolume, setLocalVolume] = useState(volumeValue || "");
  const [localUnit, setLocalUnit] = useState(unitValue || "µL");
  const firstRender = useRef(true);

  // Atualiza o valor local se o prop mudar (ex: reset de formulário)
  useEffect(() => {
    if (!firstRender.current) {
      setLocalVolume(volumeValue || "");
      setLocalUnit(unitValue || "µL");
    } else {
      firstRender.current = false;
    }
  }, [volumeValue, unitValue]);

  // Handler para focus/blur
  const handleFocusChange = (event, isFocused) => {
    event.target.style.borderColor = isFocused
      ? COLORS.BORDER_FOCUS
      : COLORS.BORDER_DEFAULT;
  };

  // Atualiza localmente ao digitar
  const handleVolumeChange = (e) => {
    setLocalVolume(e.target.value);
  };
  const handleUnitChange = (e) => {
    setLocalUnit(e.target.value);
  };

  // Só atualiza o global no blur
  const handleBlur = () => {
    if (onChange) {
      onChange({
        [volumeName]: localVolume,
        [unitName]: localUnit,
      });
    }
  };

  return (
    <div>
      <label className={BASE_CLASSES.LABEL} style={{ color: COLORS.TEXT }}>
        {label}
      </label>
      <div className="flex">
        <input
          type="text"
          name={volumeName}
          value={localVolume}
          onChange={handleVolumeChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`${BASE_CLASSES.INPUT} ${className}`}
          style={BASE_STYLES}
          onFocus={(e) => handleFocusChange(e, true)}
        />
        <select
          name={unitName}
          value={localUnit}
          onChange={handleUnitChange}
          onBlur={handleBlur}
          disabled={disabled}
          className={BASE_CLASSES.SELECT}
          style={BASE_STYLES}
          onFocus={(e) => handleFocusChange(e, true)}
        >
          {UNIT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

export default VolumeInputIsolado;
