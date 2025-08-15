import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const ProductionQuantityTracker = ({ 
  goodParts, 
  onGoodPartsChange,
  materialUsage,
  onMaterialUsageChange,
  scrapParts,
  onScrapPartsChange,
  stripsRolls,
  onStripsRollsChange,
  showStripsRolls = false,
  isScrapMode = false,
  disabled = false,
  className = '' 
}) => {
  const [errors, setErrors] = useState({});

  const validateNumericInput = (value, fieldName, min = 0, max = 99999) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < min || numValue > max) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Значення має бути числом від ${min} до ${max}`
      }));
      return false;
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors?.[fieldName];
        return newErrors;
      });
      return true;
    }
  };

  const handleNumericChange = (value, onChange, fieldName) => {
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/?.test(value)) {
      onChange(value);
      if (value !== '') {
        validateNumericInput(value, fieldName);
      } else {
        // Clear error when field is empty
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors?.[fieldName];
          return newErrors;
        });
      }
    }
  };

  return (
    <div className={`glass-morphism border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center space-x-4 mb-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
          isScrapMode 
            ? 'bg-error/20 border-error/30' :'bg-success/20 border-success/30'
        }`}>
          <Icon 
            name={isScrapMode ? "AlertTriangle" : "Package"} 
            size={20} 
            className={isScrapMode ? "text-error" : "text-success"} 
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground font-sans">
            {isScrapMode ? 'Облік браку' : 'Облік продукції'}
          </h3>
          <p className="text-sm text-muted-foreground font-sans">
            {isScrapMode 
              ? 'Введіть кількість бракованої продукції' :'Введіть кількість виготовленої продукції'
            }
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Good Parts - Hidden in scrap mode */}
        {!isScrapMode && (
          <Input
            label="Кількість якісних деталей"
            type="text"
            placeholder="0"
            value={goodParts}
            onChange={(e) => handleNumericChange(e?.target?.value, onGoodPartsChange, 'goodParts')}
            error={errors?.goodParts}
            disabled={disabled}
            required
            description="Кількість виготовлених якісних деталей"
          />
        )}

        {/* Material Usage - Always visible */}
        <Input
          label="Витрата матеріалу (кг)"
          type="text"
          placeholder="0.0"
          value={materialUsage}
          onChange={(e) => handleNumericChange(e?.target?.value, onMaterialUsageChange, 'materialUsage')}
          error={errors?.materialUsage}
          disabled={disabled}
          required
          description="Кількість використаного матеріалу в кілограмах"
        />

        {/* Scrap Parts - Always visible but emphasized in scrap mode */}
        <Input
          label="Кількість браку"
          type="text"
          placeholder="0"
          value={scrapParts}
          onChange={(e) => handleNumericChange(e?.target?.value, onScrapPartsChange, 'scrapParts')}
          error={errors?.scrapParts}
          disabled={disabled}
          required={isScrapMode}
          description={isScrapMode ? "Кількість бракованих деталей (обов'язково)" : "Кількість бракованих деталей"}
          className={isScrapMode ? "border-error/30" : ""}
        />

        {/* Strips/Rolls - Conditional visibility */}
        {showStripsRolls && (
          <Input
            label="Кількість стрічок/рулонів"
            type="text"
            placeholder="0"
            value={stripsRolls}
            onChange={(e) => handleNumericChange(e?.target?.value, onStripsRollsChange, 'stripsRolls')}
            error={errors?.stripsRolls}
            disabled={disabled}
            required
            description="Кількість використаних стрічок або рулонів"
          />
        )}
      </div>
      {/* Summary Display */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="BarChart3" size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground font-sans">
            Підсумок введених даних
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {!isScrapMode && (
            <div className="text-center">
              <p className="text-muted-foreground font-sans">Якісні деталі</p>
              <p className="text-lg font-bold text-success font-mono">
                {goodParts || '0'}
              </p>
            </div>
          )}
          
          <div className="text-center">
            <p className="text-muted-foreground font-sans">Матеріал (кг)</p>
            <p className="text-lg font-bold text-primary font-mono">
              {materialUsage || '0'}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground font-sans">Брак</p>
            <p className={`text-lg font-bold font-mono ${
              isScrapMode ? 'text-error' : 'text-warning'
            }`}>
              {scrapParts || '0'}
            </p>
          </div>
          
          {showStripsRolls && (
            <div className="text-center">
              <p className="text-muted-foreground font-sans">Стрічки/Рулони</p>
              <p className="text-lg font-bold text-accent font-mono">
                {stripsRolls || '0'}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Validation Status */}
      {Object.keys(errors)?.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-error/10 border border-error/30">
          <div className="flex items-center space-x-2">
            <Icon name="AlertCircle" size={16} className="text-error" />
            <span className="text-sm font-medium text-error font-sans">
              Помилки валідації
            </span>
          </div>
          <ul className="mt-2 text-xs text-error font-sans space-y-1">
            {Object.values(errors)?.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductionQuantityTracker;