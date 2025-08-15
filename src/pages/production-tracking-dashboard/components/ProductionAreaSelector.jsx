import React from 'react';
import Select from '../../../components/ui/Select';

const ProductionAreaSelector = ({
  selectedArea,
  onAreaChange,
  productionAreas = [],
  disabled = false
}) => {
  const areaOptions = productionAreas?.map(area => ({
    value: area?.id?.toString(),
    label: `${area?.code} - ${area?.name}`,
    disabled: !area?.is_active
  })) || [];

  return (
    <div className="glass-morphism border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Виробнича дільниця</h3>
          <p className="text-sm text-muted-foreground">Оберіть дільницю для роботи</p>
        </div>
      </div>
      <div className="space-y-4">
        <Select
          value={selectedArea}
          onChange={onAreaChange}
          options={areaOptions}
          placeholder="Оберіть дільницю..."
          disabled={disabled}
          loading={productionAreas?.length === 0}
        />

        {selectedArea && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Дільницю обрано</span>
            </div>
            {productionAreas?.find(area => area?.id?.toString() === selectedArea)?.description && (
              <p className="text-sm text-green-300/70 mt-1">
                {productionAreas?.find(area => area?.id?.toString() === selectedArea)?.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionAreaSelector;