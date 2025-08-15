import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentScrapEntries = ({ 
  entries = [],
  onDeleteEntry = () => {},
  className = '' 
}) => {
  // Mock recent scrap entries
  const mockEntries = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      scrapType: 'Дефект поверхні',
      quantity: 12,
      orderNumber: 'ORD-2024-001',
      itemNumber: 'ITM-456789',
      materialWaste: 2.5,
      notes: 'Подряпини на поверхні після обробки'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      scrapType: 'Неправильні розміри',
      quantity: 8,
      orderNumber: 'ORD-2024-002',
      itemNumber: 'ITM-123456',
      materialWaste: 1.8,
      notes: 'Відхилення від номінальних розмірів'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      scrapType: 'Технологічний брак',
      quantity: 5,
      orderNumber: 'ORD-2024-003',
      itemNumber: 'ITM-789012',
      materialWaste: 0.9,
      notes: 'Порушення температурного режиму'
    }
  ];

  const displayEntries = entries?.length > 0 ? entries : mockEntries;

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScrapTypeIcon = (scrapType) => {
    if (scrapType?.includes('поверхні')) return 'Eye';
    if (scrapType?.includes('розміри')) return 'Ruler';
    if (scrapType?.includes('матеріалу')) return 'Package';
    if (scrapType?.includes('технологічний')) return 'Settings';
    if (scrapType?.includes('механічні')) return 'Wrench';
    return 'AlertTriangle';
  };

  if (displayEntries?.length === 0) {
    return (
      <div className={`glass-morphism border border-border rounded-lg p-8 text-center ${className}`}>
        <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground font-sans mb-2">
          Немає записів про брак
        </h3>
        <p className="text-sm text-muted-foreground font-sans">
          Записи про зареєстрований брак з'являться тут
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground font-sans">
          Останні записи про брак
        </h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground font-sans">
          <Icon name="Clock" size={16} />
          <span>Оновлено щойно</span>
        </div>
      </div>
      <div className="space-y-3">
        {displayEntries?.map((entry) => (
          <div
            key={entry?.id}
            className="glass-morphism border border-error/20 bg-error/5 rounded-lg p-4 hover:bg-error/10 transition-smooth"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-error/20 border border-error/30 flex-shrink-0">
                  <Icon name={getScrapTypeIcon(entry?.scrapType)} size={20} className="text-error" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground font-sans">
                      {entry?.scrapType}
                    </h4>
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTime(entry?.timestamp)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Package" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-sans">
                        Кількість: <span className="font-semibold text-error">{entry?.quantity} шт</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="FileText" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-mono">
                        {entry?.orderNumber}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Icon name="Trash2" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-sans">
                        {entry?.materialWaste} кг
                      </span>
                    </div>
                  </div>

                  {entry?.notes && (
                    <p className="text-xs text-muted-foreground font-sans bg-muted/50 rounded p-2">
                      {entry?.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteEntry(entry?.id)}
                className="flex items-center justify-center w-8 h-8 rounded-lg glass-morphism border border-border hover:bg-error/20 hover:border-error/30 transition-smooth focus:outline-none focus:ring-2 focus:ring-error ml-3"
                title="Видалити запис"
              >
                <Icon name="Trash2" size={14} className="text-muted-foreground hover:text-error" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {displayEntries?.length > 3 && (
        <div className="text-center pt-2">
          <button className="text-sm text-accent hover:text-accent/80 font-sans transition-smooth">
            Показати всі записи ({displayEntries?.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentScrapEntries;