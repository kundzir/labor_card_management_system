import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const ScrapRegistrationForm = ({ 
  currentOperation = null,
  onSubmit = () => {},
  onClear = () => {},
  isLoading = false,
  className = '' 
}) => {
  const [formData, setFormData] = useState({
    scrapQuantity: '',
    scrapTypeId: '',
    materialWaste: '',
    orderNumber: '',
    itemNumber: '',
    notes: ''
  });

  const [scrapTypes, setScrapTypes] = useState([]);
  const [errors, setErrors] = useState({});

  // Mock scrap types data
  const mockScrapTypes = [
    { value: '1', label: 'Дефект поверхні', description: 'Подряпини, вм\'ятини, плями' },
    { value: '2', label: 'Неправильні розміри', description: 'Відхилення від технічних вимог' },
    { value: '3', label: 'Брак матеріалу', description: 'Дефекти сировини' },
    { value: '4', label: 'Технологічний брак', description: 'Порушення технологічного процесу' },
    { value: '5', label: 'Механічні пошкодження', description: 'Тріщини, поломки' },
    { value: '6', label: 'Невідповідність якості', description: 'Не відповідає стандартам' },
    { value: '7', label: 'Брак збірки', description: 'Помилки при складанні' },
    { value: '8', label: 'Інше', description: 'Інші види браку' }
  ];

  useEffect(() => {
    // Filter scrap types based on current operation
    if (currentOperation) {
      const filteredTypes = mockScrapTypes?.filter(type => {
        // Mock filtering logic based on operation type
        if (currentOperation?.id === 26 || currentOperation?.id === 29) {
          return ['1', '2', '3', '5']?.includes(type?.value);
        }
        return true;
      });
      setScrapTypes(filteredTypes);
    } else {
      setScrapTypes(mockScrapTypes);
    }
  }, [currentOperation]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.scrapQuantity || formData?.scrapQuantity <= 0) {
      newErrors.scrapQuantity = 'Введіть кількість бракованих деталей';
    }

    if (!formData?.scrapTypeId) {
      newErrors.scrapTypeId = 'Оберіть тип браку';
    }

    if (!formData?.orderNumber) {
      newErrors.orderNumber = 'Введіть номер замовлення';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      const wastePercentage = formData?.materialWaste && formData?.scrapQuantity 
        ? ((parseFloat(formData?.materialWaste) / parseFloat(formData?.scrapQuantity)) * 100)?.toFixed(2)
        : 0;

      onSubmit({
        ...formData,
        wastePercentage,
        timestamp: new Date()?.toISOString(),
        operationId: currentOperation?.id
      });
    }
  };

  const handleClear = () => {
    setFormData({
      scrapQuantity: '',
      scrapTypeId: '',
      materialWaste: '',
      orderNumber: '',
      itemNumber: '',
      notes: ''
    });
    setErrors({});
    onClear();
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Scrap Quantity and Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Кількість бракованих деталей"
          type="number"
          placeholder="Введіть кількість"
          value={formData?.scrapQuantity}
          onChange={(e) => handleInputChange('scrapQuantity', e?.target?.value)}
          error={errors?.scrapQuantity}
          required
          min="1"
          className="w-full"
        />

        <Select
          label="Тип браку"
          placeholder="Оберіть тип браку"
          options={scrapTypes}
          value={formData?.scrapTypeId}
          onChange={(value) => handleInputChange('scrapTypeId', value)}
          error={errors?.scrapTypeId}
          required
          searchable
          className="w-full"
        />
      </div>
      {/* Order and Item Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Номер замовлення"
          type="text"
          placeholder="Введіть номер замовлення"
          value={formData?.orderNumber}
          onChange={(e) => handleInputChange('orderNumber', e?.target?.value)}
          error={errors?.orderNumber}
          required
          className="w-full"
        />

        <Input
          label="Номер деталі"
          type="text"
          placeholder="Автоматично заповнюється"
          value={formData?.itemNumber}
          onChange={(e) => handleInputChange('itemNumber', e?.target?.value)}
          disabled
          description="Заповнюється автоматично на основі замовлення"
          className="w-full"
        />
      </div>
      {/* Material Waste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Кількість відходів матеріалу (кг)"
          type="number"
          placeholder="Введіть вагу відходів"
          value={formData?.materialWaste}
          onChange={(e) => handleInputChange('materialWaste', e?.target?.value)}
          min="0"
          step="0.01"
          className="w-full"
        />

        {formData?.materialWaste && formData?.scrapQuantity && (
          <div className="flex items-end">
            <div className="glass-morphism border border-border rounded-lg p-3 w-full">
              <p className="text-xs text-muted-foreground font-sans mb-1">
                Відсоток відходів
              </p>
              <p className="text-lg font-semibold text-warning font-mono">
                {((parseFloat(formData?.materialWaste) / parseFloat(formData?.scrapQuantity)) * 100)?.toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Notes */}
      <div>
        <Input
          label="Додаткові примітки"
          type="text"
          placeholder="Опишіть причину браку або додаткову інформацію"
          value={formData?.notes}
          onChange={(e) => handleInputChange('notes', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          variant="destructive"
          loading={isLoading}
          iconName="AlertTriangle"
          iconPosition="left"
          className="flex-1"
        >
          Зареєструвати брак
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          iconName="RotateCcw"
          iconPosition="left"
          className="flex-1 sm:flex-none"
        >
          Очистити форму
        </Button>
      </div>
      {/* Form Status */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-2 border-t border-border">
        <span>Режим реєстрації браку активний</span>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-error animate-pulse" />
          <span>SCRAP MODE</span>
        </div>
      </div>
    </form>
  );
};

export default ScrapRegistrationForm;