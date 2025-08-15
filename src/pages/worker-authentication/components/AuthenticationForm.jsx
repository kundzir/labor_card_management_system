import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AuthenticationForm = ({ onAuthenticate, isLoading, error }) => {
  const [personalId, setPersonalId] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    // Clear previous validation errors
    setValidationError('');
    
    // Validate personal ID
    if (!personalId?.trim()) {
      setValidationError('Особистий ID є обов\'язковим');
      return;
    }
    
    if (personalId?.trim()?.length < 3) {
      setValidationError('Особистий ID повинен містити мінімум 3 символи');
      return;
    }
    
    // Call authentication handler
    onAuthenticate(personalId?.trim());
  };

  const handlePersonalIdChange = (e) => {
    const value = e?.target?.value;
    setPersonalId(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-primary/20 border border-primary/30 mb-4">
          <Icon name="UserCheck" size={32} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground font-sans">
          Автентифікація працівника
        </h2>
        <p className="text-sm text-muted-foreground font-sans">
          Введіть ваш особистий ID для доступу до системи
        </p>
      </div>
      {/* Personal ID Input */}
      <div className="space-y-4">
        <Input
          label="Особистий ID"
          type="text"
          placeholder="Введіть ваш особистий ID"
          value={personalId}
          onChange={handlePersonalIdChange}
          error={validationError || error}
          required
          disabled={isLoading}
          className="text-center"
        />
      </div>
      {/* Login Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={!personalId?.trim() || isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        {isLoading ? 'Перевірка...' : 'Увійти в систему'}
      </Button>
      {/* Additional Info */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-sans">
          Зверніться до супервайзера, якщо у вас немає доступу
        </p>
      </div>
    </form>
  );
};

export default AuthenticationForm;