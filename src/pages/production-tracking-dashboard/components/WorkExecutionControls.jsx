import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ModeIndicator from '../../../components/ui/ModeIndicator';

const WorkExecutionControls = ({ 
  isWorkStarted,
  onStartWork,
  onFinishWork,
  onClearForm,
  currentMode,
  onModeToggle,
  canStartWork = false,
  canFinishWork = false,
  isProcessing = false,
  className = '' 
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');

  const handleConfirmAction = (action) => {
    setConfirmationType(action);
    setShowConfirmation(true);
  };

  const executeAction = () => {
    switch (confirmationType) {
      case 'start':
        onStartWork();
        break;
      case 'finish':
        onFinishWork();
        break;
      case 'clear':
        onClearForm();
        break;
    }
    setShowConfirmation(false);
    setConfirmationType('');
  };

  const getConfirmationMessage = () => {
    switch (confirmationType) {
      case 'start':
        return {
          title: 'Розпочати роботу?',
          message: 'Ви впевнені, що хочете розпочати виконання робочої операції?',
          icon: 'Play',
          color: 'primary'
        };
      case 'finish':
        return {
          title: 'Завершити роботу?',
          message: 'Ви впевнені, що хочете завершити виконання робочої операції? Всі дані будуть збережені.',
          icon: 'Square',
          color: 'success'
        };
      case 'clear':
        return {
          title: 'Очистити форму?',
          message: 'Ви впевнені, що хочете очистити всі введені дані? Ця дія незворотна.',
          icon: 'Trash2',
          color: 'error'
        };
      default:
        return { title: '', message: '', icon: 'AlertCircle', color: 'muted' };
    }
  };

  const confirmation = getConfirmationMessage();

  return (
    <div className={`glass-morphism border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 border border-accent/30">
          <Icon name="PlayCircle" size={20} className="text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground font-sans">
            Управління виконанням
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            Контроль процесу виконання робочої операції
          </p>
        </div>
      </div>
      {/* Mode Toggle */}
      <div className="mb-6">
        <ModeIndicator
          currentMode={currentMode}
          onModeToggle={onModeToggle}
          disabled={isWorkStarted || isProcessing}
        />
      </div>
      {/* Work Status Display */}
      <div className={`p-4 rounded-lg border mb-6 ${
        isWorkStarted 
          ? 'bg-success/10 border-success/30' :'bg-muted/10 border-muted/30'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isWorkStarted ? 'bg-success animate-pulse' : 'bg-muted-foreground'
          }`} />
          <span className={`text-sm font-medium font-sans ${
            isWorkStarted ? 'text-success' : 'text-muted-foreground'
          }`}>
            {isWorkStarted ? 'Робота виконується' : 'Робота не розпочата'}
          </span>
        </div>
        {isWorkStarted && (
          <p className="text-xs text-muted-foreground font-sans mt-2">
            Розпочато: {new Date()?.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Start Work Button */}
        {!isWorkStarted && (
          <Button
            variant="default"
            size="lg"
            onClick={() => handleConfirmAction('start')}
            disabled={!canStartWork || isProcessing}
            loading={isProcessing && confirmationType === 'start'}
            iconName="Play"
            iconPosition="left"
            fullWidth
          >
            Розпочати роботу
          </Button>
        )}

        {/* Finish Work Button */}
        {isWorkStarted && (
          <Button
            variant="success"
            size="lg"
            onClick={() => handleConfirmAction('finish')}
            disabled={!canFinishWork || isProcessing}
            loading={isProcessing && confirmationType === 'finish'}
            iconName="Square"
            iconPosition="left"
            fullWidth
          >
            Завершити роботу
          </Button>
        )}

        {/* Clear Form Button */}
        <Button
          variant="outline"
          size="default"
          onClick={() => handleConfirmAction('clear')}
          disabled={isProcessing}
          iconName="Trash2"
          iconPosition="left"
          fullWidth
        >
          Очистити форму
        </Button>
      </div>
      {/* Requirements Display */}
      <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="CheckCircle2" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground font-sans">
            Вимоги для початку роботи
          </span>
        </div>
        
        <ul className="text-xs text-muted-foreground font-sans space-y-1">
          <li className="flex items-center space-x-2">
            <Icon 
              name={canStartWork ? "Check" : "X"} 
              size={12} 
              className={canStartWork ? "text-success" : "text-error"} 
            />
            <span>Всі обов'язкові поля заповнені</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon 
              name={!isWorkStarted ? "Check" : "X"} 
              size={12} 
              className={!isWorkStarted ? "text-success" : "text-error"} 
            />
            <span>Робота не розпочата</span>
          </li>
        </ul>
      </div>
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 glass-morphism-strong border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${confirmation?.color}/20 border border-${confirmation?.color}/30`}>
                <Icon name={confirmation?.icon} size={24} className={`text-${confirmation?.color}`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground font-sans">
                  {confirmation?.title}
                </h3>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground font-sans mb-6">
              {confirmation?.message}
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                fullWidth
              >
                Скасувати
              </Button>
              <Button
                variant={confirmation?.color === 'error' ? 'destructive' : 'default'}
                onClick={executeAction}
                loading={isProcessing}
                fullWidth
              >
                Підтвердити
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkExecutionControls;