
import React from "react";

const Loader = ({ size = "medium", fullScreen = false }) => {
  // Tamaños disponibles para el loader
  const sizes = {
    small: "w-5 h-5 border-2",
    medium: "w-8 h-8 border-3",
    large: "w-12 h-12 border-4"
  };

  // Estilos base para el loader
  const loaderClasses = `
    inline-block rounded-full 
    border-[#F26400] border-solid
    border-t-transparent
    animate-spin
    ${sizes[size] || sizes.medium}
  `;


  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className={loaderClasses}></div>
      </div>
    );
  }


  return <div className={loaderClasses}></div>;
};

export default Loader;