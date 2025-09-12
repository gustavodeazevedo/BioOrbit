import React, { useState, useEffect, useRef } from "react";

// Componente isolado para o campo Número do Certificado
const NumeroCertificadoInput = React.memo(function NumeroCertificadoInput({
  value,
  onChange,
  label = "Número do Certificado",
  name = "numeroCertificado",
  placeholder = "Ex: 2024-0001",
  required = true,
}) {
  const [localValue, setLocalValue] = useState(value || "");
  const firstRender = useRef(true);

  // Atualiza o valor local se o prop mudar (ex: reset de formulário)
  useEffect(() => {
    if (!firstRender.current) {
      setLocalValue(value || "");
    } else {
      firstRender.current = false;
    }
  }, [value]);

  // Atualiza o valor local ao digitar
  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  // Só atualiza o global no blur
  const handleBlur = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="mb-4">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: "rgb(75, 85, 99)" }}
      >
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:border-green-500"
        style={{ borderColor: "#d1d5db", color: "rgb(75, 85, 99)" }}
        required={required}
        autoComplete="off"
      />
    </div>
  );
});

export default NumeroCertificadoInput;
