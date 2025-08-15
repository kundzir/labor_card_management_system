import React from 'react';
import Icon from '../../../components/AppIcon';

const ScrapSummaryCard = ({ 
  todayScrapCount = 0,
  todayWasteAmount = 0,
  currentShiftScrap = 0,
  wastePercentage = 0,
  className = '' 
}) => {
  const summaryData = [
    {
      id: 'today-scrap',
      label: 'Брак за сьогодні',
      value: todayScrapCount,
      unit: 'шт',
      icon: 'AlertTriangle',
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/30'
    },
    {
      id: 'today-waste',
      label: 'Відходи за сьогодні',
      value: todayWasteAmount?.toFixed(2),
      unit: 'кг',
      icon: 'Trash2',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30'
    },
    {
      id: 'shift-scrap',
      label: 'Брак за зміну',
      value: currentShiftScrap,
      unit: 'шт',
      icon: 'Clock',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/30'
    },
    {
      id: 'waste-percentage',
      label: 'Відсоток відходів',
      value: wastePercentage?.toFixed(1),
      unit: '%',
      icon: 'TrendingUp',
      color: wastePercentage > 5 ? 'text-error' : 'text-success',
      bgColor: wastePercentage > 5 ? 'bg-error/10' : 'bg-success/10',
      borderColor: wastePercentage > 5 ? 'border-error/30' : 'border-success/30'
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {summaryData?.map((item) => (
        <div
          key={item?.id}
          className={`glass-morphism border ${item?.borderColor} ${item?.bgColor} rounded-lg p-4`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${item?.bgColor} border ${item?.borderColor}`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            
            {item?.id === 'waste-percentage' && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                wastePercentage > 5 
                  ? 'bg-error/20 text-error border border-error/30' :'bg-success/20 text-success border border-success/30'
              }`}>
                {wastePercentage > 5 ? 'Високий' : 'Нормальний'}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-sans">
              {item?.label}
            </p>
            <div className="flex items-baseline space-x-1">
              <span className={`text-2xl font-bold ${item?.color} font-mono`}>
                {item?.value}
              </span>
              <span className="text-sm text-muted-foreground font-sans">
                {item?.unit}
              </span>
            </div>
          </div>

          {/* Progress indicator for waste percentage */}
          {item?.id === 'waste-percentage' && (
            <div className="mt-3">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    wastePercentage > 5 ? 'bg-error' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(wastePercentage * 10, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScrapSummaryCard;