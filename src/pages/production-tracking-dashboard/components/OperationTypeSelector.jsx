import React from 'react';
import Select from '../../../components/ui/Select';

const OperationTypeSelector = ({
  selectedArea,
  selectedOperation,
  onOperationChange,
  selectedSubOperation,
  onSubOperationChange,
  workTypes = [],
  workSubTypes = [],
  disabled = false
}) => {
  const operationOptions = workTypes?.map(type => ({
    value: type?.id?.toString(),
    label: `${type?.code} - ${type?.name}`,
    disabled: !type?.is_active
  })) || [];

  const subOperationOptions = workSubTypes?.map(subType => ({
    value: subType?.id?.toString(),
    label: `${subType?.code} - ${subType?.name}`,
    disabled: !subType?.is_active
  })) || [];

  return (
    <div className="glass-morphism border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Тип операції</h3>
          <p className="text-sm text-muted-foreground">Оберіть тип та підтип операції</p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Основний тип
          </label>
          <Select
            value={selectedOperation}
            onChange={onOperationChange}
            options={operationOptions}
            placeholder={selectedArea ? "Оберіть тип операції..." : "Спочатку оберіть дільницю"}
            disabled={disabled || !selectedArea || operationOptions?.length === 0}
            loading={selectedArea && operationOptions?.length === 0}
          />
        </div>

        {selectedOperation && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Підтип операції
            </label>
            <Select
              value={selectedSubOperation}
              onChange={onSubOperationChange}
              options={subOperationOptions}
              placeholder="Оберіть підтип операції..."
              disabled={disabled || !selectedOperation || subOperationOptions?.length === 0}
              loading={selectedOperation && subOperationOptions?.length === 0}
            />
          </div>
        )}

        {selectedSubOperation && (
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium">Операцію налаштовано</span>
            </div>
            {workSubTypes?.find(subType => subType?.id?.toString() === selectedSubOperation)?.description && (
              <p className="text-sm text-green-300/70 mt-1">
                {workSubTypes?.find(subType => subType?.id?.toString() === selectedSubOperation)?.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationTypeSelector;