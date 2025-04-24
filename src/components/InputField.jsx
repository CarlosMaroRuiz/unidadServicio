// InputField.jsx simplificado (sin validación)
import React from "react";

const InputField = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  name, 
  options = [],
  maxLength
}) => {
  // Clases comunes para los inputs
  const inputClasses = "w-full px-4 py-3 rounded-md focus:outline-none transition-colors border border-gray-200 bg-white text-gray-700 focus:border-[#F26400]";
  
  // Renderiza un dropdown si el tipo es "select"
  if (type === "select") {
    return (
      <div className="flex flex-col mb-4">
        <label className="text-sm font-medium mb-2">{label}</label>
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={inputClasses}
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // Input estándar para otros tipos
  return (
    <div className="flex flex-col mb-4">
      <label className="text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClasses}
        maxLength={maxLength}
      />
    </div>
  );
};

export default InputField;