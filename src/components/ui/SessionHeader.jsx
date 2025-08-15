import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionHeader = ({ 
  worker = null, 
  isAuthenticated = false, 
  onLogout = () => {}, 
  currentMode = 'production',
  className = '' 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    onLogout();
  };

  const formatShiftTime = (loginTime) => {
    if (!loginTime) return '';
    const time = new Date(loginTime);
    return time?.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'scrap':
        return 'text-error';
      case 'production':
      default:
        return 'text-primary';
    }
  };

  if (!isAuthenticated || !worker) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-border ${className}`}>
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 border border-primary/30">
            <Icon name="Factory" size={24} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground font-sans">
              Labor Card Management
            </h1>
            <span className="text-xs text-muted-foreground font-sans">
              Система управління трудовими картками
            </span>
          </div>
        </div>

        {/* Worker Session Info */}
        <div className="flex items-center space-x-6">
          {/* Mode Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg glass-morphism border border-border">
            <div className={`w-2 h-2 rounded-full ${currentMode === 'scrap' ? 'bg-error' : 'bg-primary'}`} />
            <span className={`text-sm font-medium ${getModeColor(currentMode)}`}>
              {currentMode === 'scrap' ? 'Режим браку' : 'Виробництво'}
            </span>
          </div>

          {/* Worker Info & Logout */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 px-4 py-2 rounded-lg glass-morphism border border-border hover:bg-white/10 transition-smooth focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/30">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-medium text-foreground font-sans">
                  {worker?.name}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  ID: {worker?.personalId} • {formatShiftTime(worker?.loginTime)}
                </span>
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 glass-morphism-strong border border-border rounded-lg shadow-glass-lg z-60">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/30">
                      <Icon name="User" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground font-sans">
                        {worker?.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Особистий ID: {worker?.personalId}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Зміна: {worker?.shift} • Вхід: {formatShiftTime(worker?.loginTime)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    iconName="LogOut"
                    iconPosition="left"
                    className="w-full justify-start text-error hover:bg-error/10 hover:text-error"
                  >
                    Вийти з системи
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Mode Indicator */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center justify-center space-x-2 py-1">
          <div className={`w-2 h-2 rounded-full ${currentMode === 'scrap' ? 'bg-error' : 'bg-primary'}`} />
          <span className={`text-xs font-medium ${getModeColor(currentMode)}`}>
            {currentMode === 'scrap' ? 'Режим браку' : 'Виробництво'}
          </span>
        </div>
      </div>
      {/* Click outside handler */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default SessionHeader;