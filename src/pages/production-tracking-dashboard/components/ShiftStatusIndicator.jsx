import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ShiftStatusIndicator = ({ 
  currentShift,
  className = '' 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Calculate shift based on current time
  const calculateShift = (time) => {
    const hours = time?.getHours();
    const minutes = time?.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Shift 1: 6:00-14:29 (360-869 minutes)
    // Shift 2: 14:30-22:59 (870-1379 minutes)
    // Shift 3: 23:00-5:59 (1380+ minutes or 0-359 minutes)
    
    if (totalMinutes >= 360 && totalMinutes <= 869) {
      return {
        number: 1,
        name: 'Перша зміна',
        timeRange: '6:00 - 14:29',
        color: 'primary',
        icon: 'Sun'
      };
    } else if (totalMinutes >= 870 && totalMinutes <= 1379) {
      return {
        number: 2,
        name: 'Друга зміна',
        timeRange: '14:30 - 22:59',
        color: 'warning',
        icon: 'Sunset'
      };
    } else {
      return {
        number: 3,
        name: 'Третя зміна',
        timeRange: '23:00 - 5:59',
        color: 'secondary',
        icon: 'Moon'
      };
    }
  };

  const shift = calculateShift(currentTime);
  const timeString = currentTime?.toLocaleTimeString('uk-UA', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  const dateString = currentTime?.toLocaleDateString('uk-UA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          text: 'text-primary',
          icon: 'text-primary'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          text: 'text-warning',
          icon: 'text-warning'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          border: 'border-secondary/30',
          text: 'text-secondary',
          icon: 'text-secondary'
        };
      default:
        return {
          bg: 'bg-muted/10',
          border: 'border-muted/30',
          text: 'text-muted-foreground',
          icon: 'text-muted-foreground'
        };
    }
  };

  const colors = getColorClasses(shift?.color);

  return (
    <div className={`glass-morphism border border-border rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${colors?.bg} border ${colors?.border}`}>
            <Icon name={shift?.icon} size={24} className={colors?.icon} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground font-sans">
              Поточна зміна
            </h3>
            <p className="text-sm text-muted-foreground font-sans">
              Автоматичний розрахунок за часом
            </p>
          </div>
        </div>
        
        {/* Current Time Display */}
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground font-mono">
            {timeString}
          </div>
          <div className="text-xs text-muted-foreground font-sans">
            {dateString}
          </div>
        </div>
      </div>
      {/* Shift Information */}
      <div className={`p-4 rounded-lg ${colors?.bg} border ${colors?.border}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full bg-${shift?.color}`} />
            <span className={`text-lg font-semibold ${colors?.text} font-sans`}>
              {shift?.name}
            </span>
          </div>
          <span className={`text-sm font-medium ${colors?.text} font-mono`}>
            Зміна {shift?.number}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={16} className={colors?.icon} />
          <span className="text-sm text-muted-foreground font-sans">
            Робочий час: {shift?.timeRange}
          </span>
        </div>
      </div>
      {/* All Shifts Overview */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-foreground font-sans">
          Розклад змін
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          {[
            { num: 1, name: 'Перша', time: '6:00 - 14:29', color: 'primary' },
            { num: 2, name: 'Друга', time: '14:30 - 22:59', color: 'warning' },
            { num: 3, name: 'Третя', time: '23:00 - 5:59', color: 'secondary' }
          ]?.map((s) => {
            const isActive = s?.num === shift?.number;
            const sColors = getColorClasses(s?.color);
            
            return (
              <div 
                key={s?.num}
                className={`p-2 rounded border ${
                  isActive 
                    ? `${sColors?.bg} ${sColors?.border}` 
                    : 'bg-muted/30 border-muted/20'
                }`}
              >
                <div className={`font-medium ${
                  isActive ? sColors?.text : 'text-muted-foreground'
                } font-sans`}>
                  {s?.name} зміна
                </div>
                <div className="text-muted-foreground font-mono">
                  {s?.time}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ShiftStatusIndicator;