import React from 'react';
import Icon from '../../../components/AppIcon';

const CompanyBranding = () => {
  return (
    <div className="text-center space-y-6">
      {/* Company Logo */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/30 shadow-glass-lg">
            <Icon name="Factory" size={40} className="text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success border-2 border-background flex items-center justify-center">
            <Icon name="Check" size={12} className="text-white" />
          </div>
        </div>
      </div>

      {/* Company Name */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground font-sans">
          Labor Card Management
        </h1>
        <p className="text-lg text-muted-foreground font-sans">
          Система управління трудовими картками
        </p>
      </div>

      {/* Version & Build Info */}
      <div className="glass-morphism border border-border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground font-sans mb-1">Версія</p>
            <p className="text-sm font-medium text-foreground font-mono">v2.1.4</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-sans mb-1">Збірка</p>
            <p className="text-sm font-medium text-foreground font-mono">2024.08.14</p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="glass-morphism border border-warning/30 bg-warning/10 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-sm font-medium text-warning font-sans mb-1">
              Безпечний доступ
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              Всі дії в системі логуються та контролюються. Використовуйте лише ваш особистий ID.
            </p>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-sans mb-2">
          Технічна підтримка
        </p>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-1">
            <Icon name="Phone" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">+380 44 123-45-67</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Mail" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">support@factory.ua</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranding;