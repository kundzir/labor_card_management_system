import React from 'react';
import Input from '../../../components/ui/Input';

const OrderManagementCard = ({
  orderNumber,
  onOrderChange,
  itemNumber,
  onItemNumberChange,
  orderInfo = null,
  disabled = false
}) => {
  return (
    <div className="glass-morphism border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Управління замовленнями</h3>
          <p className="text-sm text-muted-foreground">Введіть номер замовлення для автоматичного пошуку</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Номер замовлення
          </label>
          <Input
            type="text"
            value={orderNumber}
            onChange={(e) => onOrderChange(e?.target?.value)}
            placeholder="Введіть номер замовлення..."
            disabled={disabled}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Номер деталі
          </label>
          <Input
            type="text"
            value={itemNumber}
            onChange={(e) => onItemNumberChange(e?.target?.value)}
            placeholder="Автоматично заповниться..."
            disabled={disabled}
            className="w-full"
            readOnly={!!orderInfo?.item_number}
          />
        </div>
      </div>
      {orderInfo && (
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg space-y-2">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Інформація про замовлення</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Опис деталі:</span>
              <p className="text-foreground font-medium">{orderInfo?.item_description || 'Не вказано'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Планована кількість:</span>
              <p className="text-foreground font-medium">{orderInfo?.quantity_planned || 0} шт.</p>
            </div>
            <div>
              <span className="text-muted-foreground">Виконано:</span>
              <p className="text-foreground font-medium">{orderInfo?.quantity_completed || 0} шт.</p>
            </div>
            <div>
              <span className="text-muted-foreground">Статус:</span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                orderInfo?.status === 'active' ?'bg-green-500/20 text-green-400 border border-green-500/20' 
                  : orderInfo?.status === 'completed' ?'bg-blue-500/20 text-blue-400 border border-blue-500/20' :'bg-red-500/20 text-red-400 border border-red-500/20'
              }`}>
                {orderInfo?.status === 'active' ? 'Активне' : 
                 orderInfo?.status === 'completed' ? 'Завершене' : 'Скасоване'}
              </span>
            </div>
          </div>
        </div>
      )}
      {orderNumber?.length > 0 && !orderInfo && (
        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">
              {orderNumber?.length < 3 ? 'Введіть мінімум 3 символи для пошуку' : 'Замовлення не знайдено'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementCard;