import { Compromisso } from '@/hooks/useCompromissos';
import { Home, Phone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaWeekViewProps {
  compromissos: Compromisso[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectCompromisso: (compromisso: Compromisso) => void;
}

const tipoConfig: Record<string, { icon: typeof Home; color: string; bgColor: string }> = {
  visita: { icon: Home, color: 'text-success', bgColor: 'bg-success' },
  ligacao: { icon: Phone, color: 'text-info', bgColor: 'bg-info' },
  reuniao: { icon: Users, color: 'text-warning', bgColor: 'bg-warning' },
};

const statusColors: Record<string, string> = {
  pendente: 'border-l-warning',
  confirmado: 'border-l-success',
  cancelado: 'border-l-destructive',
  realizado: 'border-l-muted-foreground',
};

export const AgendaWeekView = ({ 
  compromissos, 
  selectedDate, 
  onSelectDate, 
  onSelectCompromisso 
}: AgendaWeekViewProps) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getCompromissosForDay = (date: Date) => {
    return compromissos
      .filter(c => isSameDay(parseISO(c.data), date))
      .sort((a, b) => a.hora.localeCompare(b.hora));
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
      {weekDays.map((day) => {
        const dayCompromissos = getCompromissosForDay(day);
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex-shrink-0 w-[140px] rounded-xl p-3 transition-all duration-200",
              isSelected ? "bg-primary/10 ring-2 ring-primary" : "bg-secondary",
              isToday && !isSelected && "ring-1 ring-primary/50"
            )}
            onClick={() => onSelectDate(day)}
          >
            {/* Day Header */}
            <div className="text-center mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase">
                {format(day, 'EEE', { locale: ptBR })}
              </p>
              <p className={cn(
                "text-lg font-bold",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {format(day, 'd')}
              </p>
            </div>

            {/* Compromissos */}
            <div className="space-y-2 min-h-[120px]">
              {dayCompromissos.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Sem compromissos
                </p>
              ) : (
                dayCompromissos.slice(0, 3).map((compromisso) => {
                  const config = tipoConfig[compromisso.tipo] || tipoConfig.visita;
                  const Icon = config.icon;
                  const statusColor = statusColors[compromisso.status || 'pendente'];

                  return (
                    <button
                      key={compromisso.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCompromisso(compromisso);
                      }}
                      className={cn(
                        "w-full p-2 rounded-lg bg-card border-l-4 text-left animate-scale-press",
                        statusColor
                      )}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className={cn("w-3 h-3", config.color)} />
                        <span className="text-xs font-medium text-foreground">
                          {compromisso.hora}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {compromisso.cliente}
                      </p>
                    </button>
                  );
                })
              )}
              {dayCompromissos.length > 3 && (
                <p className="text-xs text-primary text-center font-medium">
                  +{dayCompromissos.length - 3} mais
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
