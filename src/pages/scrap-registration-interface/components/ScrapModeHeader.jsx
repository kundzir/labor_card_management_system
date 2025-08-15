import React from 'react';
import Icon from '../../../components/AppIcon';

const ScrapModeHeader = ({ 
  worker = null, 
  currentArea = null, 
  currentOperation = null,
  onReturnToProduction = () => {},
  className = '' 
}) => {
  return (
    <div className={`glass-morphism border border-error/30 bg-error/10 rounded-lg p-4 ${className}`}>
      {/* Mode Indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-error/20 border border-error/30">
            <Icon name="AlertTriangle" size={24} className="text-error" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-error font-sans">
              Режим реєстрації браку
            </h2>
            <p className="text-sm text-muted-foreground font-sans">
              Реєстрація бракованої продукції та відходів
            </p>
          </div>
        </div>
        
        <button
          onClick={onReturnToProduction}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-morphism border border-border hover:bg-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <Icon name="ArrowLeft" size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-sans">
            Повернутися до виробництва
          </span>
        </button>
      </div>
      {/* Current Context */}
      {worker && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-sans">Працівник</p>
              <p className="text-sm font-medium text-foreground font-sans">{worker?.name}</p>
            </div>
          </div>
          
          {currentArea && (
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-sans">Дільниця</p>
                <p className="text-sm font-medium text-foreground font-sans">{currentArea?.name}</p>
              </div>
            </div>
          )}
          
          {currentOperation && (
            <div className="flex items-center space-x-2">
              <Icon name="Settings" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-sans">Операція</p>
                <p className="text-sm font-medium text-foreground font-sans">{currentOperation?.name}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScrapModeHeader;