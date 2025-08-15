import React from 'react';
import Icon from '../AppIcon';

const LoadingOverlay = ({ 
  isVisible = false, 
  message = 'Завантаження...', 
  subMessage = '', 
  type = 'default',
  className = '' 
}) => {
  if (!isVisible) return null;

  const getLoadingConfig = (type) => {
    switch (type) {
      case 'authentication':
        return {
          icon: 'UserCheck',
          primaryColor: 'text-primary',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30'
        };
      case 'saving':
        return {
          icon: 'Save',
          primaryColor: 'text-success',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/30'
        };
      case 'processing':
        return {
          icon: 'Cog',
          primaryColor: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/30'
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          primaryColor: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error/30'
        };
      default:
        return {
          icon: 'Loader2',
          primaryColor: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent/30'
        };
    }
  };

  const config = getLoadingConfig(type);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center ${className}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8">
        {/* Loading Container */}
        <div className={`
          flex flex-col items-center space-y-6 p-8 rounded-2xl
          glass-morphism-strong border ${config?.borderColor} ${config?.bgColor}
          shadow-glass-xl max-w-sm w-full mx-4
        `}>
          {/* Loading Icon */}
          <div className="relative">
            <div className={`
              flex items-center justify-center w-16 h-16 rounded-full
              ${config?.bgColor} border-2 ${config?.borderColor}
            `}>
              <Icon 
                name={config?.icon} 
                size={32} 
                className={`${config?.primaryColor} ${type === 'default' || type === 'processing' ? 'animate-spin' : ''}`} 
              />
            </div>
            
            {/* Pulse Ring */}
            <div className={`
              absolute inset-0 rounded-full border-2 ${config?.borderColor}
              animate-ping opacity-20
            `} />
          </div>

          {/* Loading Text */}
          <div className="text-center space-y-2">
            <h3 className={`text-lg font-semibold ${config?.primaryColor} font-sans`}>
              {message}
            </h3>
            {subMessage && (
              <p className="text-sm text-muted-foreground font-sans">
                {subMessage}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="w-full">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div className={`
                h-full ${config?.bgColor} rounded-full
                animate-pulse
              `} style={{ width: '60%' }} />
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex space-x-1">
            {[0, 1, 2]?.map((index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full ${config?.primaryColor?.replace('text-', 'bg-')}
                  animate-pulse opacity-60
                `}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-sans">
            Будь ласка, зачекайте...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;