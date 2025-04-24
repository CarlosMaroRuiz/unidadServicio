
import axios from 'axios';

// URL base - reemplaza con tu URL real
const API_BASE_URL = 'https://tu-api.com/api';

/**
 * Servicio para gestionar las operaciones relacionadas con unidades de negocio
 */
const BusinessUnitService = {
  /**
   * Crea una nueva unidad de negocio
   * @param {Object} businessUnitData - Datos de la unidad de negocio
   * @returns {Promise} Promesa con la respuesta del servidor
   */
  createBusinessUnit: async (businessUnitData) => {
    try {
      // Preparamos los datos con la estructura requerida
      const payload = {
        name: businessUnitData.name,
        description: businessUnitData.description,
        rfcEmitter: businessUnitData.rfcEmitter,
        emitterName: businessUnitData.emitterName,
        defaultCurrency: businessUnitData.defaultCurrency,
        series: businessUnitData.series,
        fieldMappings: [
          {
            sourceFieldName: "",
            standardFieldName: ""
          }
        ]
      };

      
      const response = await axios.post(
        `${API_BASE_URL}/business-units`, 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // Incluye aquí headers adicionales si son necesarios
            // 'Authorization': `Bearer ${token}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al crear la unidad de negocio:', error);
      
      // Retornamos un objeto de error estructurado
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Obtiene una unidad de negocio por su ID
   * @param {string} id - ID de la unidad de negocio
   * @returns {Promise} Promesa con la respuesta del servidor
   */
  getBusinessUnitById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/business-units/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la unidad de negocio:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  /**
   * Actualiza una unidad de negocio existente
   * @param {string} id - ID de la unidad de negocio a actualizar
   * @param {Object} businessUnitData - Datos actualizados de la unidad de negocio
   * @returns {Promise} Promesa con la respuesta del servidor
   */
  updateBusinessUnit: async (id, businessUnitData) => {
    try {
      // Preparamos los datos con la estructura requerida
      const payload = {
        name: businessUnitData.name,
        description: businessUnitData.description,
        rfcEmitter: businessUnitData.rfcEmitter,
        emitterName: businessUnitData.emitterName,
        defaultCurrency: businessUnitData.defaultCurrency,
        series: businessUnitData.series,
        fieldMappings: businessUnitData.fieldMappings || [
          {
            sourceFieldName: "",
            standardFieldName: ""
          }
        ]
      };

      const response = await axios.put(
        `${API_BASE_URL}/business-units/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            // Incluye aquí headers adicionales si son necesarios
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al actualizar la unidad de negocio:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }
};

export default BusinessUnitService;