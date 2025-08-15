import React from 'react';
import Icon from '../AppIcon';

const ModeIndicator = ({ 
  currentMode = 'production', 
  onModeToggle = () => {}, 
  disabled = false,
  className = '' 
}) => {
  const isScrapMode = currentMode === 'scrap';
  
  const handleToggle = () => {
    if (!disabled) {
      onModeToggle(isScrapMode ? 'production' : 'scrap');
    }
  };

  const getModeConfig = (mode) => {
    switch (mode) {
      case 'scrap':
        return {
          label: 'Режим браку',
          description: 'Реєстрація бракованої продукції',
          icon: 'AlertTriangle',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/30',
          textColor: 'text-error',
          iconColor: 'text-error',
          indicatorColor: 'bg-error'
        };
      case 'production':
      default:
        return {
          label: 'Виробництво',
          description: 'Відстеження виробничого процесу',
          icon: 'Factory',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          textColor: 'text-primary',
          iconColor: 'text-primary',
          indicatorColor: 'bg-primary'
        };
    }
  };

  const currentConfig = getModeConfig(currentMode);
  const alternateConfig = getModeConfig(isScrapMode ? 'production' : 'scrap');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Mode Display */}
      <div className={`flex items-center justify-between p-4 rounded-lg glass-morphism border ${currentConfig?.borderColor} ${currentConfig?.bgColor}`}>
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentConfig?.bgColor} border ${currentConfig?.borderColor}`}>
            <Icon name={currentConfig?.icon} size={20} className={currentConfig?.iconColor} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${currentConfig?.indicatorColor}`} />
              <h3 className={`text-sm font-semibold ${currentConfig?.textColor} font-sans`}>
                {currentConfig?.label}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground font-sans mt-0.5">
              {currentConfig?.description}
            </p>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={`
            flex items-center justify-center w-8 h-8 rounded-lg 
            glass-morphism border border-border
            hover:bg-white/10 transition-smooth
            focus:outline-none focus:ring-2 focus:ring-accent
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={`Переключити на ${alternateConfig?.label?.toLowerCase()}`}
        >
          <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
        </button>
      </div>
      {/* Mode Toggle Preview */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleToggle}
          disabled={disabled}
          className={`
            flex items-center space-x-3 px-4 py-2 rounded-lg
            glass-morphism border border-border
            hover:bg-white/5 transition-mode
            focus:outline-none focus:ring-2 focus:ring-accent
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Icon name="ArrowLeftRight" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-sans">
            Переключити на {alternateConfig?.label?.toLowerCase()}
          </span>
          <div className={`w-2 h-2 rounded-full ${alternateConfig?.indicatorColor} opacity-60`} />
        </button>
      </div>
      {/* Mode Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>Поточний режим</span>
        <span className={`font-medium ${currentConfig?.textColor}`}>
          {currentConfig?.label?.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default ModeIndicator;