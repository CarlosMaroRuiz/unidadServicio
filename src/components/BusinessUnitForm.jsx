// BusinessUnitForm.jsx con autocompletado al tocar inputs
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import { useAlerts } from "../providers/AlertContainer";

// Servicio simulado para guardar datos
const simulateDataSave = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const existingUnits = JSON.parse(localStorage.getItem('businessUnits') || '[]');
        const newUnit = {
          ...data,
          id: `unit-${Date.now()}`,
          createdAt: new Date().toISOString(),
          fieldMappings: [{ sourceFieldName: "", standardFieldName: "" }]
        };
        
        existingUnits.push(newUnit);
        localStorage.setItem('businessUnits', JSON.stringify(existingUnits));
        
        resolve({ success: true, data: newUnit });
      } catch (error) {
        console.error('Error al guardar datos:', error);
        resolve({ success: true, data: { ...data, id: `unit-${Date.now()}` } });
      }
    }, 50);
  });
};

// Valores predeterminados para autocompletar
const defaultValues = {
  name: "TechnoFuture Innovations",
  description: "Desarrollo de soluciones tecnológicas avanzadas y consultoría en transformación digital",
  rfcEmitter: "TEFI980523KL9",
  emitterName: "TechnoFuture Innovations S.A.P.I.",
  defaultCurrency: "MXN",
  series: "TF"
};

// Función para validar serie
const validateSeries = (series) => {
  if (!series || series.trim() === '') {
    return 'La serie es obligatoria';
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(series)) {
    return 'La serie solo debe contener letras y números';
  }
  
  return null;
};

const BusinessUnitForm = () => {
  // Comenzamos con todos los campos vacíos
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rfcEmitter: "",
    emitterName: "",
    defaultCurrency: "MXN", // Dejamos este con valor por defecto por ser un select
    series: ""
  });
  
  const [seriesError, setSeriesError] = useState(null);
  const [savedUnitsCount, setSavedUnitsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulamos carga de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const units = JSON.parse(localStorage.getItem('businessUnits') || '[]');
        setSavedUnitsCount(units.length);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Ahora iniciamos con campos vacíos (excepto el select)
        setIsLoading(false);
      } catch (e) {
        console.error("Error cargando datos", e);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Hook de alertas
  const { showSuccess, showError } = useAlerts();

  // Manejador de cambio 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Solo validamos la serie cuando cambia
    if (name === 'series') {
      setSeriesError(validateSeries(value));
    }
  };
  
  // Manejador para cuando el campo obtiene foco (autocompletado)
  const handleFocus = (e) => {
    const { name, value } = e.target;
    
    // Solo autocompletamos si el campo está vacío
    if (!value.trim() && defaultValues[name]) {
      setFormData(prev => ({
        ...prev,
        [name]: defaultValues[name]
      }));
      
      // Si es el campo series, validamos después de autocompletar
      if (name === 'series') {
        setSeriesError(validateSeries(defaultValues[name]));
      }
    }
  };
  
  // Manejador para cuando la serie pierde el foco
  const handleSeriesBlur = () => {
    setSeriesError(validateSeries(formData.series));
  };

  // Manejador de envío
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validamos la serie antes de enviar
    const seriesValidationError = validateSeries(formData.series);
    setSeriesError(seriesValidationError);
    
    // Si hay error en la serie, no continuamos
    if (seriesValidationError) {
      showError('Por favor, verifica la serie de facturas', {
        title: 'Error de validación',
        autoClose: true,
        autoCloseTime: 2000
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await simulateDataSave(formData);
      setSavedUnitsCount(prev => prev + 1);
      
      showSuccess('Unidad de negocio guardada correctamente', {
        title: 'Éxito',
        autoCloseTime: 2000
      });
      
      // Restauramos campos vacíos después de guardar (excepto moneda)
      setFormData({
        name: "",
        description: "",
        rfcEmitter: "",
        emitterName: "",
        defaultCurrency: "MXN",
        series: ""
      });
      setSeriesError(null);
    } catch (error) {
      showError('Error al guardar los datos', {
        title: 'Error',
        autoClose: true,
        autoCloseTime: 2000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Opciones para moneda 
  const currencyOptions = [
    { value: "MXN", label: "MXN - Peso Mexicano" },
    { value: "USD", label: "USD - Dólar Estadounidense" },
    { value: "EUR", label: "EUR - Euro" }
  ];

  // Si está cargando, mostramos un indicador
  if (isLoading) {
    return (
      <div className="w-full mt-10 relative">
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 transition-all hover:shadow-lg min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 rounded-full border-[#F26400] border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando información de la unidad de negocio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-10 relative">
      {/* Indicador durante envío */}
      {isSubmitting && (
        <div className="absolute top-4 right-4 z-20">
          <div className="inline-block w-5 h-5 border-2 rounded-full border-[#F26400] border-t-transparent animate-spin"></div>
        </div>
      )}
      
      <div className="bg-white rounded-xl border border-gray-200 shadow-md p-6 transition-all hover:shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Información de la unidad de negocio</h2>
          
          {/* Contador simple */}
          {savedUnitsCount > 0 && (
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-600">
              Unidades: {savedUnitsCount}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Primera fila - con autocompletado al hacer foco */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium mb-2">Nombre de la empresa</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Haz clic para autocompletar"
              className="w-full px-4 py-3 rounded-md focus:outline-none transition-colors border border-gray-200 bg-white focus:border-[#F26400]"
            />
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium mb-2">RFC del emisor</label>
            <input
              name="rfcEmitter"
              value={formData.rfcEmitter}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Haz clic para autocompletar"
              className="w-full px-4 py-3 rounded-md focus:outline-none transition-colors border border-gray-200 bg-white focus:border-[#F26400]"
              maxLength={13}
            />
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium mb-2">Nombre legal del emisor</label>
            <input
              name="emitterName"
              value={formData.emitterName}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Haz clic para autocompletar"
              className="w-full px-4 py-3 rounded-md focus:outline-none transition-colors border border-gray-200 bg-white focus:border-[#F26400]"
            />
          </div>
          
          {/* Segunda fila */}
          <InputField
            label="Moneda predeterminada"
            type="select"
            name="defaultCurrency"
            value={formData.defaultCurrency}
            onChange={handleChange}
            options={currencyOptions}
          />
          
          {/* Campo de Serie con validación */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium mb-2 flex items-center">
              Serie de facturas
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              name="series"
              value={formData.series}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleSeriesBlur}
              placeholder="Haz clic para autocompletar"
              className={`w-full px-4 py-3 rounded-md focus:outline-none transition-colors border ${
                seriesError 
                  ? 'border-red-300 bg-red-50 focus:border-red-500' 
                  : 'border-gray-200 bg-white focus:border-[#F26400]'
              }`}
              maxLength={5}
            />
            {seriesError && (
              <p className="mt-1 text-sm text-red-500">{seriesError}</p>
            )}
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium mb-2">Descripción de la empresa</label>
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={handleFocus}
              placeholder="Haz clic para autocompletar"
              className="w-full px-4 py-3 rounded-md focus:outline-none transition-colors border border-gray-200 bg-white focus:border-[#F26400]"
            />
          </div>
          
          <div className="md:col-span-3 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                bg-[#F26400] text-white py-2 px-6 rounded-md font-medium 
                hover:bg-[#D55A00] transition-colors
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {isSubmitting ? 'Procesando...' : 'Guardar información'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessUnitForm;