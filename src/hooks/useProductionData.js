import { useState, useEffect, useCallback } from 'react';
import { mysqlService } from '../services/mysqlClient';

export const useProductionData = () => {
  const [productionAreas, setProductionAreas] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [workSubTypes, setWorkSubTypes] = useState([]);
  const [scrapTypes, setScrapTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load production areas on component mount
  useEffect(() => {
    loadProductionAreas();
    loadScrapTypes();
  }, []);

  const loadProductionAreas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const areas = await mysqlService?.getProductionAreas();
      setProductionAreas(areas || []);
    } catch (err) {
      setError(err?.message);
      setProductionAreas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWorkTypes = useCallback(async (areaId) => {
    if (!areaId) {
      setWorkTypes([]);
      setWorkSubTypes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const types = await mysqlService?.getWorkTypes(areaId);
      setWorkTypes(types || []);
      setWorkSubTypes([]); // Reset subtypes when area changes
    } catch (err) {
      setError(err?.message);
      setWorkTypes([]);
      setWorkSubTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWorkSubTypes = useCallback(async (workTypeId) => {
    if (!workTypeId) {
      setWorkSubTypes([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const subTypes = await mysqlService?.getWorkSubTypes(workTypeId);
      setWorkSubTypes(subTypes || []);
    } catch (err) {
      setError(err?.message);
      setWorkSubTypes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadScrapTypes = useCallback(async () => {
    try {
      const types = await mysqlService?.getScrapTypes();
      setScrapTypes(types || []);
    } catch (err) {
      console.error('Помилка завантаження типів браку:', err);
      setScrapTypes([]);
    }
  }, []);

  const validateOrderNumber = useCallback(async (orderNumber) => {
    if (!orderNumber?.trim()) {
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const orderInfo = await mysqlService?.getOrderInfo(orderNumber?.trim());
      return orderInfo;
    } catch (err) {
      setError(err?.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate current shift based on time
  const getCurrentShift = useCallback(() => {
    const now = new Date();
    const hours = now?.getHours();
    const minutes = now?.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Shift 1: 06:00-14:29 (360-869 minutes)
    if (totalMinutes >= 360 && totalMinutes <= 869) return 1;
    // Shift 2: 14:30-22:59 (870-1379 minutes)
    if (totalMinutes >= 870 && totalMinutes <= 1379) return 2;
    // Shift 3: 23:00-05:59 (1380+ or 0-359 minutes)
    return 3;
  }, []);

  // Format timestamp for database operations
  const formatTimestamp = useCallback(() => {
    return new Date()?.toISOString();
  }, []);

  return {
    // Data
    productionAreas,
    workTypes,
    workSubTypes,
    scrapTypes,
    loading,
    error,
    
    // Functions
    loadProductionAreas,
    loadWorkTypes,
    loadWorkSubTypes,
    loadScrapTypes,
    validateOrderNumber,
    getCurrentShift,
    formatTimestamp,
    
    // Utility functions
    clearError: () => setError(null),
    resetData: () => {
      setWorkTypes([]);
      setWorkSubTypes([]);
      setError(null);
    }
  };
};