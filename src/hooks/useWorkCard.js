import { useState, useCallback } from 'react';
import { mysqlService } from '../services/mysqlClient';

export const useWorkCard = () => {
  const [currentWorkCard, setCurrentWorkCard] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const createWorkCard = useCallback(async (workCardData) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const workCard = await mysqlService?.createWorkCard({
        ...workCardData,
        start_time: new Date()?.toISOString(),
        status: 'active',
        shift: getCurrentShift()
      });
      
      setCurrentWorkCard(workCard);
      return workCard;
    } catch (err) {
      setError(err?.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateWorkCard = useCallback(async (updates) => {
    if (!currentWorkCard?.id) {
      throw new Error('Немає активної робочої картки');
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const updatedCard = await mysqlService?.updateWorkCard(currentWorkCard?.id, updates);
      setCurrentWorkCard(updatedCard);
      return updatedCard;
    } catch (err) {
      setError(err?.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentWorkCard]);

  const finishWorkCard = useCallback(async (finishData) => {
    if (!currentWorkCard?.id) {
      throw new Error('Немає активної робочої картки');
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const finishedCard = await mysqlService?.finishWorkCard(currentWorkCard?.id, {
        ...finishData,
        finish_time: new Date()?.toISOString(),
        status: 'completed'
      });
      
      setCurrentWorkCard(null); // Clear current work card
      return finishedCard;
    } catch (err) {
      setError(err?.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [currentWorkCard]);

  const getCurrentShift = useCallback(() => {
    const now = new Date();
    const hours = now?.getHours();
    const minutes = now?.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 360 && totalMinutes <= 869) return 1;
    if (totalMinutes >= 870 && totalMinutes <= 1379) return 2;
    return 3;
  }, []);

  const resetWorkCard = useCallback(() => {
    setCurrentWorkCard(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    currentWorkCard,
    isProcessing,
    error,
    createWorkCard,
    updateWorkCard,
    finishWorkCard,
    resetWorkCard,
    clearError: () => setError(null)
  };
};