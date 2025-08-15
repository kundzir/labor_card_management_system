import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionHeader from '../../components/ui/SessionHeader';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import WorkerValidationCard from './components/WorkerValidationCard';
import ProductionAreaSelector from './components/ProductionAreaSelector';
import OperationTypeSelector from './components/OperationTypeSelector';
import OrderManagementCard from './components/OrderManagementCard';
import ProductionQuantityTracker from './components/ProductionQuantityTracker';
import ShiftStatusIndicator from './components/ShiftStatusIndicator';
import WorkExecutionControls from './components/WorkExecutionControls';
import { useProductionData } from '../../hooks/useProductionData';
import { useWorkCard } from '../../hooks/useWorkCard';
import { mysqlService } from '../../services/mysqlClient';

const ProductionTrackingDashboard = () => {
  const navigate = useNavigate();
  
  // Custom hooks
  const {
    productionAreas,
    workTypes,
    workSubTypes,
    loading: dataLoading,
    error: dataError,
    loadWorkTypes,
    loadWorkSubTypes,
    validateOrderNumber,
    getCurrentShift,
    clearError: clearDataError
  } = useProductionData();

  const {
    currentWorkCard,
    isProcessing: workCardProcessing,
    error: workCardError,
    createWorkCard,
    finishWorkCard,
    resetWorkCard,
    clearError: clearWorkCardError
  } = useWorkCard();
  
  // Authentication state
  const [worker, setWorker] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  
  // Production form state
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [selectedSubOperation, setSelectedSubOperation] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [itemNumber, setItemNumber] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);
  
  // Quantity tracking state
  const [goodParts, setGoodParts] = useState('');
  const [materialUsage, setMaterialUsage] = useState('');
  const [scrapParts, setScrapParts] = useState('');
  const [stripsRolls, setStripsRolls] = useState('');
  
  // Work execution state
  const [isWorkStarted, setIsWorkStarted] = useState(false);
  const [currentMode, setCurrentMode] = useState('production');
  const [loadingMessage, setLoadingMessage] = useState('');

  // Calculate current shift
  const [currentShift] = useState(getCurrentShift());

  // Check if strips/rolls field should be shown (for operations 26 and 29)
  const showStripsRolls = selectedOperation === '26' || selectedOperation === '29';

  // Handle area selection change
  useEffect(() => {
    if (selectedArea && selectedArea !== '') {
      loadWorkTypes(selectedArea);
      setSelectedOperation('');
      setSelectedSubOperation('');
    }
  }, [selectedArea, loadWorkTypes]);

  // Handle operation selection change
  useEffect(() => {
    if (selectedOperation && selectedOperation !== '') {
      loadWorkSubTypes(selectedOperation);
      setSelectedSubOperation('');
    }
  }, [selectedOperation, loadWorkSubTypes]);

  // Validate order number when it changes
  useEffect(() => {
    const validateOrder = async () => {
      if (orderNumber?.trim() && orderNumber?.length >= 3) {
        try {
          const info = await validateOrderNumber(orderNumber?.trim());
          setOrderInfo(info);
          if (info?.item_number) {
            setItemNumber(info?.item_number);
          }
        } catch (error) {
          console.error('Помилка перевірки замовлення:', error);
          setOrderInfo(null);
          setItemNumber('');
        }
      } else {
        setOrderInfo(null);
        setItemNumber('');
      }
    };

    const timeoutId = setTimeout(validateOrder, 500);
    return () => clearTimeout(timeoutId);
  }, [orderNumber, validateOrderNumber]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearDataError();
      clearWorkCardError();
    };
  }, [clearDataError, clearWorkCardError]);

  // Validation functions
  const validateRequiredFields = () => {
    const required = [
      selectedArea,
      selectedOperation,
      selectedSubOperation,
      orderNumber,
      itemNumber,
      materialUsage
    ];

    if (currentMode === 'production') {
      required?.push(goodParts);
    } else {
      required?.push(scrapParts);
    }

    if (showStripsRolls) {
      required?.push(stripsRolls);
    }

    return required?.every(field => field && field?.toString()?.trim() !== '');
  };

  const canStartWork = validateRequiredFields() && !isWorkStarted && worker;
  const canFinishWork = isWorkStarted && validateRequiredFields() && currentWorkCard;

  // Event handlers
  const handleWorkerValidated = async (personalId) => {
    setIsValidating(true);
    setLoadingMessage('Підтвердження працівника...');
    
    try {
      const validatedWorker = await mysqlService?.validateWorker(personalId);
      setWorker(validatedWorker);
    } catch (error) {
      console.error('Помилка підтвердження працівника:', error);
      alert('Помилка підтвердження працівника. Перевірте особистий номер.');
    } finally {
      setIsValidating(false);
      setLoadingMessage('');
    }
  };

  const handleLogout = () => {
    setWorker(null);
    resetWorkCard();
    clearForm();
    navigate('/worker-authentication');
  };

  const handleStartWork = async () => {
    if (!canStartWork) return;

    setLoadingMessage('Розпочинаємо роботу...');
    
    try {
      const workCardData = {
        worker_id: worker?.id,
        production_area_id: parseInt(selectedArea),
        wp_type_id: parseInt(selectedOperation),
        wp_sub_type_id: parseInt(selectedSubOperation),
        order_number: orderNumber?.trim(),
        item_number: itemNumber?.trim(),
        shift: currentShift,
        good_parts: currentMode === 'production' ? parseInt(goodParts) || 0 : 0,
        scrap_parts: currentMode === 'scrap' ? parseInt(scrapParts) || 0 : 0,
        material_usage: parseFloat(materialUsage) || 0,
        strips_rolls: showStripsRolls ? parseInt(stripsRolls) || 0 : 0
      };

      await createWorkCard(workCardData);
      setIsWorkStarted(true);
      
    } catch (error) {
      console.error('Помилка початку роботи:', error);
      alert('Помилка початку роботи: ' + error?.message);
    } finally {
      setLoadingMessage('');
    }
  };

  const handleFinishWork = async () => {
    if (!canFinishWork) return;

    setLoadingMessage('Завершуємо роботу та зберігаємо дані...');
    
    try {
      const finishData = {
        good_parts: currentMode === 'production' ? parseInt(goodParts) || 0 : 0,
        scrap_parts: currentMode === 'scrap' ? parseInt(scrapParts) || 0 : 0,
        material_usage: parseFloat(materialUsage) || 0,
        strips_rolls: showStripsRolls ? parseInt(stripsRolls) || 0 : 0
      };

      await finishWorkCard(finishData);
      setIsWorkStarted(false);
      
      // Show success message
      alert('Робота успішно завершена та збережена!');
      
    } catch (error) {
      console.error('Помилка завершення роботи:', error);
      alert('Помилка завершення роботи: ' + error?.message);
    } finally {
      setLoadingMessage('');
    }
  };

  const clearForm = () => {
    setSelectedArea('');
    setSelectedOperation('');
    setSelectedSubOperation('');
    setOrderNumber('');
    setItemNumber('');
    setOrderInfo(null);
    setGoodParts('');
    setMaterialUsage('');
    setScrapParts('');
    setStripsRolls('');
    setIsWorkStarted(false);
    setCurrentMode('production');
    resetWorkCard();
  };

  const handleModeToggle = (newMode) => {
    if (!isWorkStarted) {
      setCurrentMode(newMode);
      // Clear quantity fields when switching modes
      setGoodParts('');
      setScrapParts('');
    }
  };

  // Navigation handlers
  const handleNavigateToScrapInterface = () => {
    navigate('/scrap-registration-interface');
  };

  // Show any errors
  const currentError = dataError || workCardError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat" />
      </div>
      {/* Session Header */}
      <SessionHeader
        worker={worker}
        isAuthenticated={!!worker}
        onLogout={handleLogout}
        currentMode={currentMode}
      />
      {/* Error Display */}
      {currentError && (
        <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto">
          <div className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm">{currentError}</span>
              <button
                onClick={() => {
                  clearDataError();
                  clearWorkCardError();
                }}
                className="text-white/70 hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {!worker ? (
            /* Worker Authentication Section */
            (<div className="max-w-md mx-auto">
              <WorkerValidationCard
                worker={worker}
                onWorkerValidated={handleWorkerValidated}
                isValidating={isValidating}
              />
            </div>)
          ) : (
            /* Main Dashboard Content */
            (<div className="space-y-6">
              {/* Page Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground font-sans mb-2">
                  Панель відстеження виробництва
                </h1>
                <p className="text-muted-foreground font-sans">
                  Реєстрація та контроль виконання робочих операцій
                </p>
              </div>
              {/* Top Row - Shift Status */}
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <ShiftStatusIndicator currentShift={currentShift} />
              </div>
              {/* Second Row - Production Setup */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProductionAreaSelector
                  selectedArea={selectedArea}
                  onAreaChange={setSelectedArea}
                  productionAreas={productionAreas}
                  disabled={isWorkStarted}
                />
                
                <OperationTypeSelector
                  selectedArea={selectedArea}
                  selectedOperation={selectedOperation}
                  onOperationChange={setSelectedOperation}
                  selectedSubOperation={selectedSubOperation}
                  onSubOperationChange={setSelectedSubOperation}
                  workTypes={workTypes}
                  workSubTypes={workSubTypes}
                  disabled={isWorkStarted}
                />
              </div>
              {/* Third Row - Order Management */}
              <div className="grid grid-cols-1 gap-6">
                <OrderManagementCard
                  orderNumber={orderNumber}
                  onOrderChange={setOrderNumber}
                  itemNumber={itemNumber}
                  onItemNumberChange={setItemNumber}
                  orderInfo={orderInfo}
                  disabled={isWorkStarted}
                />
              </div>
              {/* Fourth Row - Production Tracking */}
              <div className="grid grid-cols-1 gap-6">
                <ProductionQuantityTracker
                  goodParts={goodParts}
                  onGoodPartsChange={setGoodParts}
                  materialUsage={materialUsage}
                  onMaterialUsageChange={setMaterialUsage}
                  scrapParts={scrapParts}
                  onScrapPartsChange={setScrapParts}
                  stripsRolls={stripsRolls}
                  onStripsRollsChange={setStripsRolls}
                  showStripsRolls={showStripsRolls}
                  isScrapMode={currentMode === 'scrap'}
                />
              </div>
              {/* Bottom Row - Work Controls */}
              <div className="grid grid-cols-1 gap-6">
                <WorkExecutionControls
                  isWorkStarted={isWorkStarted}
                  onStartWork={handleStartWork}
                  onFinishWork={handleFinishWork}
                  onClearForm={clearForm}
                  currentMode={currentMode}
                  onModeToggle={handleModeToggle}
                  canStartWork={canStartWork}
                  canFinishWork={canFinishWork}
                  isProcessing={workCardProcessing}
                />
              </div>
              {/* Quick Navigation */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleNavigateToScrapInterface}
                  className="glass-morphism border border-border rounded-lg px-6 py-3 hover:bg-white/5 transition-smooth focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <span className="text-sm text-muted-foreground font-sans">
                    Перейти до інтерфейсу реєстрації браку →
                  </span>
                </button>
              </div>
            </div>)
          )}
        </div>
      </div>
      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isValidating || workCardProcessing || dataLoading}
        message={loadingMessage || 'Завантаження...'}
        type={isValidating ? 'authentication' : 'processing'}
      />
    </div>
  );
};

export default ProductionTrackingDashboard;