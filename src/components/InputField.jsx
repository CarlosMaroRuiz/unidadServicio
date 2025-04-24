// BusinessUnitForm.jsx con sistema de validación profesional
import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import { useAlerts } from "../providers/AlertContainer";
import BusinessUnitService from "../services/businessUnitService";

// Animación CSS para el slideInDown
const slideInDownAnimation = `
@keyframes slideInDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
`;

// Función para validar RFC mexicano
const validateRFC = (rfc) => {
  // Expresión regular para RFC de persona física
  const rfcPersonaFisica = /^([A-ZÑ&]{4})\d{6}([A-Z0-9]{3})$/;
  // Expresión regular para RFC de persona moral
  const rfcPersonaMoral = /^([A-ZÑ&]{3})\d{6}([A-Z0-9]{3})$/;

  if (rfc.trim() === '') return false;
  
  // Convertir a mayúsculas
  const rfcUpperCase = rfc.toUpperCase();
  
  return rfcPersonaFisica.test(rfcUpperCase) || rfcPersonaMoral.test(rfcUpperCase);
};

const BusinessUnitForm = () => {
  // Estado para datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rfcEmitter: "",
    emitterName: "",
    defaultCurrency: "MXN",
    series: ""
  });
  
  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para campos tocados (para no mostrar errores antes de interactuar)
  const [touched, setTouched] = useState({});

  // Estado para el estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para saber si el formulario se ha intentado enviar
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Hook de alertas
  const { showSuccess, showError } = useAlerts();

  // Manejador de cambio de campo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validar cuando cambia el valor si ya fue tocado o si el formulario se intentó enviar
    if (touched[name] || formSubmitted) {
      validateField(name, value);
    }
  };

  // Manejador para cuando el campo pierde el foco
  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Marcar el campo como tocado
    setTouched({
      ...touched,
      [name]: true
    });
    
    // Validar el campo
    validateField(name, formData[name]);
  };

  // Validar un campo específico
  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'El nombre de la empresa es obligatorio';
        } else if (value.trim().length < 3) {
          newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'rfcEmitter':
        if (!value.trim()) {
          newErrors.rfcEmitter = 'El RFC del emisor es obligatorio';
        } else if (!validateRFC(value)) {
          newErrors.rfcEmitter = 'Ingrese un RFC válido';
        } else {
          delete newErrors.rfcEmitter;
        }
        break;
        
      case 'emitterName':
        if (!value.trim()) {
          newErrors.emitterName = 'El nombre legal del emisor es obligatorio';
        } else if (value.trim().length < 3) {
          newErrors.emitterName = 'El nombre legal debe tener al menos 3 caracteres';
        } else {
          delete newErrors.emitterName;
        }
        break;
        
      case 'series':
        if (!value.trim()) {
          newErrors.series = 'La serie de facturas es obligatoria';
        } else {
          delete newErrors.series;
        }
        break;
        
      case 'description':
        if (value.trim() && value.trim().length < 10) {
          newErrors.description = 'La descripción debe tener al menos 10 caracteres';
        } else {
          delete newErrors.description;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validar todo el formulario
  const validateForm = () => {
    let formIsValid = true;
    let newErrors = {};
    let allTouched = {};
    
    // Validar cada campo y marcarlos como tocados
    Object.keys(formData).forEach(name => {
      const isFieldValid = validateField(name, formData[name]);
      formIsValid = formIsValid && isFieldValid;
      allTouched[name] = true;
    });
    
    setTouched(allTouched);
    return formIsValid;
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validar el formulario completo antes de enviar
    const isValid = validateForm();
    
    if (!isValid) {
      showError('Por favor, corrija los errores en el formulario', {
        title: 'Validación',
        autoClose: true,
        autoCloseTime: 4000
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await BusinessUnitService.createBusinessUnit(formData);
      
      if (response.success === false) {
        throw new Error(response.error || 'Error al crear la unidad de negocio');
      }
      
      showSuccess('Unidad de negocio creada exitosamente', {
        title: 'Operación exitosa',
        autoCloseTime: 6000
      });
      
      // Resetear el formulario después del éxito
      setFormData({
        name: "",
        description: "",
        rfcEmitter: "",
        emitterName: "",
        defaultCurrency: "MXN",
        series: ""
      });
      
      // Resetear estados de validación
      setErrors({});
      setTouched({});
      setFormSubmitted(false);
      
    } catch (error) {
      showError(error.message || 'Ha ocurrido un error al procesar la solicitud', {
        title: 'Error',
        autoClose: false
      });
      console.error('Error en el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Opciones para el dropdown de moneda
  const currencyOptions = [
    { value: "MXN", label: "MXN - Peso Mexicano" },
    { value: "USD", label: "USD - Dólar Estadounidense" },
    { value: "EUR", label: "EUR - Euro" }
  ];

  // Calculamos si el formulario tiene errores (para mostrar mensaje general)
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      {/* Estilo para la animación */}
      <style>{slideInDownAnimation}</style>
      
      <div className="w-full mt-10 relative">
        {/* Indicador de carga durante el envío */}
        {isSubmitting && (
          <div className="absolute top-4 right-4 z-20">
            <div className="inline-block w-6 h-6 border-2 rounded-full border-[#F26400] border-t-transparent animate-spin"></div>
          </div>
        )}
        
        <div className="bg-white rounded-xl border border-gray-200 shadow-md p-8 transition-all hover:shadow-lg">
          <h2 className="text-xl font-bold mb-6">Información de la unidad de negocio</h2>
          
          {/* Mostrar mensaje de error general si hay errores después de intentar enviar */}
          {hasErrors && formSubmitted && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
              Por favor, corrija los errores en el formulario antes de continuar.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            {/* Primera fila - 3 inputs */}
            <InputField
              label="Nombre de la empresa"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingresa el nombre de la empresa"
              required={true}
              error={touched.name || formSubmitted ? errors.name : null}
              maxLength={100}
            />
            
            <InputField
              label="RFC del emisor"
              name="rfcEmitter"
              value={formData.rfcEmitter}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. XAXX010101000"
              required={true}
              error={touched.rfcEmitter || formSubmitted ? errors.rfcEmitter : null}
              hint="Formato: 4 letras + 6 dígitos + 3 caracteres para personas físicas, o 3 letras + 6 dígitos + 3 caracteres para morales"
              maxLength={13}
            />
            
            <InputField
              label="Nombre legal del emisor"
              name="emitterName"
              value={formData.emitterName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Nombre legal según registro fiscal"
              required={true}
              error={touched.emitterName || formSubmitted ? errors.emitterName : null}
              maxLength={150}
            />
            
            {/* Segunda fila - 3 inputs */}
            <InputField
              label="Moneda predeterminada"
              type="select"
              name="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={handleChange}
              onBlur={handleBlur}
              options={currencyOptions}
              required={true}
            />
            
            <InputField
              label="Serie de facturas"
              name="series"
              value={formData.series}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. A, B, C..."
              required={true}
              error={touched.series || formSubmitted ? errors.series : null}
              maxLength={5}
            />
            
            <InputField
              label="Descripción de la empresa"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describe brevemente la actividad de la empresa"
              error={touched.description || formSubmitted ? errors.description : null}
              hint="Opcional, mínimo 10 caracteres"
              maxLength={500}
            />
            
            <div className="md:col-span-3 mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  bg-[#F26400] text-white py-3 px-6 rounded-md font-medium 
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
    </>
  );
};

export default BusinessUnitForm;