import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const WorkerValidationCard = ({ 
  worker, 
  onWorkerValidated, 
  isValidating = false,
  className = '' 
}) => {
  const [personalId, setPersonalId] = useState('');
  const [error, setError] = useState('');

  // Mock worker data for validation
  const mockWorkers = [
    {
      id: 1,
      personalId: '12345',
      name: 'Олександр Петренко',
      shift: 1,
      loginTime: new Date(),
      isActive: true
    },
    {
      id: 2,
      personalId: '67890',
      name: 'Марія Коваленко',
      shift: 2,
      loginTime: new Date(),
      isActive: true
    },
    {
      id: 3,
      personalId: '11111',
      name: 'Іван Сидоренко',
      shift: 1,
      loginTime: new Date(),
      isActive: true
    }
  ];

  const handleValidation = () => {
    if (!personalId?.trim()) {
      setError('Введіть особистий ID');
      return;
    }

    const foundWorker = mockWorkers?.find(w => w?.personalId === personalId);
    if (foundWorker) {
      setError('');
      onWorkerValidated(foundWorker);
    } else {
      setError('Працівника з таким ID не знайдено. Спробуйте: 12345, 67890, або 11111');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleValidation();
    }
  };

  if (worker) {
    return (
      <div className={`glass-morphism border border-success/30 bg-success/10 rounded-lg p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/20 border border-success/30">
              <Icon name="UserCheck" size={24} className="text-success" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-success font-sans">
                Працівник підтверджений
              </h3>
              <p className="text-sm text-foreground font-sans">
                {worker?.name} (ID: {worker?.personalId})
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                Зміна: {worker?.shift} • Вхід: {worker?.loginTime?.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={() => {
              setPersonalId('');
              setError('');
              onWorkerValidated(null);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            Змінити
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-morphism border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border border-primary/30">
          <Icon name="User" size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground font-sans">
            Підтвердження працівника
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            Введіть особистий ID для початку роботи
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Input
          label="Особистий ID працівника"
          type="text"
          placeholder="Введіть ваш особистий ID"
          value={personalId}
          onChange={(e) => {
            setPersonalId(e?.target?.value);
            if (error) setError('');
          }}
          onKeyPress={handleKeyPress}
          error={error}
          required
          disabled={isValidating}
        />

        <Button
          variant="default"
          onClick={handleValidation}
          loading={isValidating}
          disabled={!personalId?.trim() || isValidating}
          iconName="UserCheck"
          iconPosition="left"
          className="w-full"
        >
          Підтвердити працівника
        </Button>

        {/* Demo credentials info */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground font-sans">
            <Icon name="Info" size={14} className="inline mr-1" />
            Демо ID: 12345, 67890, 11111
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkerValidationCard;