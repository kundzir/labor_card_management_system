import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationForm from './components/AuthenticationForm';
import SystemStatus from './components/SystemStatus';
import CompanyBranding from './components/CompanyBranding';
import LoadingOverlay from '../../components/ui/LoadingOverlay';

const WorkerAuthentication = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [currentShift, setCurrentShift] = useState(1);

  // Mock worker data for authentication
  const mockWorkers = [
    {
      personalId: 'W001',
      name: 'Олександр Петренко',
      shift: 1,
      department: 'Виробництво',
      position: 'Оператор верстата'
    },
    {
      personalId: 'W002',
      name: 'Марія Іваненко',
      shift: 2,
      department: 'Контроль якості',
      position: 'Інспектор'
    },
    {
      personalId: 'W003',
      name: 'Сергій Коваленко',
      shift: 1,
      department: 'Виробництво',
      position: 'Старший оператор'
    },
    {
      personalId: 'ADMIN',
      name: 'Адміністратор системи',
      shift: 1,
      department: 'IT',
      position: 'Системний адміністратор'
    }
  ];

  // Calculate current shift based on time
  const calculateShift = () => {
    const now = new Date();
    const hours = now?.getHours();
    const minutes = now?.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Shift 1: 6:00-14:29 (360-869 minutes)
    // Shift 2: 14:30-22:59 (870-1379 minutes)
    // Shift 3: 23:00-5:59 (1380+ or 0-359 minutes)
    
    if (totalMinutes >= 360 && totalMinutes <= 869) {
      return 1;
    } else if (totalMinutes >= 870 && totalMinutes <= 1379) {
      return 2;
    } else {
      return 3;
    }
  };

  // Update current time and shift
  useEffect(() => {
    const updateTimeAndShift = () => {
      const now = new Date();
      const timeString = now?.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
      setCurrentShift(calculateShift());
    };

    // Update immediately
    updateTimeAndShift();

    // Update every second
    const interval = setInterval(updateTimeAndShift, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle worker authentication
  const handleAuthenticate = async (personalId) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Find worker by personal ID
      const worker = mockWorkers?.find(w => w?.personalId?.toLowerCase() === personalId?.toLowerCase());

      if (!worker) {
        setError('Невірний особистий ID. Перевірте правильність введених даних.');
        return;
      }

      // Store worker data in localStorage
      const workerSession = {
        ...worker,
        loginTime: new Date()?.toISOString(),
        shift: currentShift
      };

      localStorage.setItem('workerSession', JSON.stringify(workerSession));
      localStorage.setItem('isAuthenticated', 'true');

      // Navigate to production tracking dashboard
      navigate('/production-tracking-dashboard');

    } catch (error) {
      console.error('Authentication error:', error);
      setError('Помилка підключення до сервера. Спробуйте ще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/assets/images/Abg.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column - Company Branding */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="glass-morphism border border-border rounded-2xl p-6">
                <CompanyBranding />
              </div>
            </div>

            {/* Center Column - Authentication Form */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="glass-morphism-strong border border-border rounded-2xl p-8 shadow-glass-xl">
                <AuthenticationForm
                  onAuthenticate={handleAuthenticate}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>

            {/* Right Column - System Status */}
            <div className="lg:col-span-1 order-3">
              <div className="glass-morphism border border-border rounded-2xl p-6">
                <SystemStatus
                  currentShift={currentShift}
                  currentTime={currentTime}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        type="authentication"
        message="Перевірка особистого ID"
        subMessage="Підключення до бази даних працівників..."
      />

      {/* Mobile Responsive Adjustments */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
        
        @media (max-width: 640px) {
          .glass-morphism-strong {
            padding: 1.5rem;
          }
          
          .glass-morphism {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkerAuthentication;