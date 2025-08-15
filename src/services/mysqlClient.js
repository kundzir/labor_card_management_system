import axios from 'axios';

// MySQL API client configuration
const apiClient = axios?.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
apiClient?.interceptors?.request?.use(
  (config) => {
    console.log('Making API request:', config?.method?.toUpperCase(), config?.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient?.interceptors?.response?.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error?.response?.status === 401) {
      // Handle authentication errors
      window.location.href = '/worker-authentication';
    }
    return Promise.reject(error);
  }
);

// Database service functions
export const mysqlService = {
  // Worker authentication
  validateWorker: async (personalId) => {
    try {
      const response = await apiClient?.get(`/workers/validate/${personalId}`);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка підтвердження працівника');
    }
  },

  // Production areas
  getProductionAreas: async () => {
    try {
      const response = await apiClient?.get('/production-areas');
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження виробничих дільниць');
    }
  },

  // Work types and sub-types
  getWorkTypes: async (areaId) => {
    try {
      const response = await apiClient?.get(`/work-types/${areaId}`);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження типів робіт');
    }
  },

  getWorkSubTypes: async (workTypeId) => {
    try {
      const response = await apiClient?.get(`/work-subtypes/${workTypeId}`);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження підтипів робіт');
    }
  },

  // Order information
  getOrderInfo: async (orderNumber) => {
    try {
      const response = await apiClient?.get(`/orders/${orderNumber}`);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження інформації про замовлення');
    }
  },

  // Work card operations
  createWorkCard: async (workCardData) => {
    try {
      const response = await apiClient?.post('/work-cards', workCardData);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка створення робочої картки');
    }
  },

  updateWorkCard: async (cardId, updates) => {
    try {
      const response = await apiClient?.put(`/work-cards/${cardId}`, updates);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка оновлення робочої картки');
    }
  },

  finishWorkCard: async (cardId, finishData) => {
    try {
      const response = await apiClient?.patch(`/work-cards/${cardId}/finish`, finishData);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завершення робочої картки');
    }
  },

  // Scrap management
  getScrapTypes: async () => {
    try {
      const response = await apiClient?.get('/scrap-types');
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження типів браку');
    }
  },

  createScrapEntry: async (scrapData) => {
    try {
      const response = await apiClient?.post('/scrap-entries', scrapData);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка реєстрації браку');
    }
  },

  getScrapHistory: async (filters = {}) => {
    try {
      const response = await apiClient?.get('/scrap-entries', { params: filters });
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження історії браку');
    }
  },

  // Quality control
  createQualityRecord: async (qualityData) => {
    try {
      const response = await apiClient?.post('/quality-records', qualityData);
      return response?.data;
    } catch (error) {
      throw new Error('Помилка реєстрації контролю якості');
    }
  },

  // Statistics and reporting
  getProductionStats: async (dateRange = {}) => {
    try {
      const response = await apiClient?.get('/statistics/production', { params: dateRange });
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження статистики виробництва');
    }
  },

  getWorkerStats: async (workerId, dateRange = {}) => {
    try {
      const response = await apiClient?.get(`/statistics/worker/${workerId}`, { params: dateRange });
      return response?.data;
    } catch (error) {
      throw new Error('Помилка завантаження статистики працівника');
    }
  }
};

export default apiClient;