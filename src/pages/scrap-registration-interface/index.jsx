import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionHeader from '../../components/ui/SessionHeader';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import ScrapModeHeader from './components/ScrapModeHeader';
import ScrapRegistrationForm from './components/ScrapRegistrationForm';
import ScrapSummaryCard from './components/ScrapSummaryCard';
import RecentScrapEntries from './components/RecentScrapEntries';

const ScrapRegistrationInterface = () => {
  const navigate = useNavigate();
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [worker, setWorker] = useState(null);
  const [currentArea, setCurrentArea] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [scrapEntries, setScrapEntries] = useState([]);
  const [summaryData, setSummaryData] = useState({
    todayScrapCount: 0,
    todayWasteAmount: 0,
    currentShiftScrap: 0,
    wastePercentage: 0
  });

  // Mock worker data
  const mockWorker = {
    id: 1,
    personalId: 'WRK001',
    name: 'Олександр Петренко',
    shift: 1,
    loginTime: new Date(Date.now() - 3600000) // 1 hour ago
  };

  // Mock production context
  const mockArea = {
    id: 2,
    name: 'Дільниця механічної обробки'
  };

  const mockOperation = {
    id: 26,
    name: 'Токарна обробка',
    requiresStrips: true
  };

  // Mock summary data
  const mockSummaryData = {
    todayScrapCount: 45,
    todayWasteAmount: 12.8,
    currentShiftScrap: 18,
    wastePercentage: 3.2
  };

  useEffect(() => {
    // Initialize component with mock data
    setIsLoading(true);
    
    setTimeout(() => {
      setWorker(mockWorker);
      setCurrentArea(mockArea);
      setCurrentOperation(mockOperation);
      setSummaryData(mockSummaryData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleScrapSubmit = async (scrapData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add new entry to the list
      const newEntry = {
        id: Date.now(),
        timestamp: new Date(),
        scrapType: getScrapTypeName(scrapData.scrapTypeId),
        quantity: parseInt(scrapData.scrapQuantity),
        orderNumber: scrapData.orderNumber,
        itemNumber: scrapData.itemNumber || `ITM-${Math.random().toString().substr(2, 6)}`,
        materialWaste: parseFloat(scrapData.materialWaste) || 0,
        notes: scrapData.notes
      };
      
      setScrapEntries(prev => [newEntry, ...prev]);
      
      // Update summary data
      setSummaryData(prev => ({
        ...prev,
        todayScrapCount: prev.todayScrapCount + newEntry.quantity,
        todayWasteAmount: prev.todayWasteAmount + newEntry.materialWaste,
        currentShiftScrap: prev.currentShiftScrap + newEntry.quantity,
        wastePercentage: ((prev.todayWasteAmount + newEntry.materialWaste) / (prev.todayScrapCount + newEntry.quantity)) * 100
      }));
      
      // Show success message (you could add a toast notification here)
      console.log('Scrap registered successfully:', newEntry);
      
    } catch (error) {
      console.error('Error registering scrap:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScrapTypeName = (scrapTypeId) => {
    const scrapTypes = {
      '1': 'Дефект поверхні',
      '2': 'Неправильні розміри',
      '3': 'Брак матеріалу',
      '4': 'Технологічний брак',
      '5': 'Механічні пошкодження',
      '6': 'Невідповідність якості',
      '7': 'Брак збірки',
      '8': 'Інше'
    };
    return scrapTypes[scrapTypeId] || 'Невідомий тип';
  };

  const handleFormClear = () => {
    console.log('Form cleared');
  };

  const handleReturnToProduction = () => {
    navigate('/production-tracking-dashboard');
  };

  const handleLogout = () => {
    navigate('/worker-authentication');
  };

  const handleDeleteEntry = (entryId) => {
    setScrapEntries(prev => prev.filter(entry => entry.id !== entryId));
    console.log('Entry deleted:', entryId);
  };

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
        currentMode="scrap"
      />

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Scrap Mode Header */}
            <ScrapModeHeader
              worker={worker}
              currentArea={currentArea}
              currentOperation={currentOperation}
              onReturnToProduction={handleReturnToProduction}
            />

            {/* Summary Cards */}
            <ScrapSummaryCard
              todayScrapCount={summaryData.todayScrapCount}
              todayWasteAmount={summaryData.todayWasteAmount}
              currentShiftScrap={summaryData.currentShiftScrap}
              wastePercentage={summaryData.wastePercentage}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Scrap Registration Form */}
              <div className="glass-morphism border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-error/20 border border-error/30">
                    <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground font-sans">
                      Реєстрація браку
                    </h2>
                    <p className="text-sm text-muted-foreground font-sans">
                      Заповніть форму для реєстрації бракованої продукції
                    </p>
                  </div>
                </div>

                <ScrapRegistrationForm
                  currentOperation={currentOperation}
                  onSubmit={handleScrapSubmit}
                  onClear={handleFormClear}
                  isLoading={isSubmitting}
                />
              </div>

              {/* Recent Scrap Entries */}
              <div className="glass-morphism border border-border rounded-lg p-6">
                <RecentScrapEntries
                  entries={scrapEntries}
                  onDeleteEntry={handleDeleteEntry}
                />
              </div>
            </div>

            {/* Footer Info */}
            <div className="glass-morphism border border-border rounded-lg p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground font-sans">
                <div className="flex items-center space-x-4">
                  <span>Система управління трудовими картками</span>
                  <span>•</span>
                  <span>Режим реєстрації браку</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span className="font-mono">SCRAP MODE ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        message="Завантаження інтерфейсу браку..."
        subMessage="Підготовка форми реєстрації"
        type="processing"
      />
    </div>
  );
};

export default ScrapRegistrationInterface;