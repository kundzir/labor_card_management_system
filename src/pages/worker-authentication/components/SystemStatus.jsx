import React from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = ({ currentShift, currentTime }) => {
  const getShiftInfo = (shift) => {
    switch (shift) {
      case 1:
        return {
          name: 'Перша зміна',
          time: '06:00 - 14:29',
          color: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30'
        };
      case 2:
        return {
          name: 'Друга зміна',
          time: '14:30 - 22:59',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30'
        };
      case 3:
        return {
          name: 'Третя зміна',
          time: '23:00 - 05:59',
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30'
        };
      default:
        return {
          name: 'Невідома зміна',
          time: '--:-- - --:--',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/10',
          borderColor: 'border-muted/30'
        };
    }
  };

  const shiftInfo = getShiftInfo(currentShift);

  return (
    <div className="space-y-4">
      {/* System Status Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
          Статус системи
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-success font-sans">
            Система активна
          </span>
        </div>
      </div>
      {/* Current Time */}
      <div className="glass-morphism border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 border border-accent/30">
              <Icon name="Clock" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground font-sans">
                Поточний час
              </p>
              <p className="text-lg font-bold text-accent font-mono">
                {currentTime}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Current Shift */}
      <div className={`glass-morphism border ${shiftInfo?.borderColor} ${shiftInfo?.bgColor} rounded-lg p-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${shiftInfo?.bgColor} border ${shiftInfo?.borderColor}`}>
              <Icon name="Users" size={20} className={shiftInfo?.color} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground font-sans">
                Активна зміна
              </p>
              <p className={`text-lg font-bold ${shiftInfo?.color} font-sans`}>
                {shiftInfo?.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {shiftInfo?.time}
              </p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${shiftInfo?.color?.replace('text-', 'bg-')}`} />
        </div>
      </div>
      {/* System Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-morphism border border-border rounded-lg p-3">
          <div className="text-center">
            <Icon name="Database" size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground font-sans">База даних</p>
            <p className="text-sm font-medium text-success font-sans">Підключено</p>
          </div>
        </div>
        <div className="glass-morphism border border-border rounded-lg p-3">
          <div className="text-center">
            <Icon name="Wifi" size={16} className="text-primary mx-auto mb-1" />
            <p className="text-xs text-muted-foreground font-sans">Мережа</p>
            <p className="text-sm font-medium text-success font-sans">Стабільна</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;