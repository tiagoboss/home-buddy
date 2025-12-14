import { Compromisso } from '@/hooks/useCompromissos';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaWeekViewProps {
  compromissos: Compromisso[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectCompromisso: (compromisso: Compromisso) => void;
}

const tipoColors: Record<string, string> = {
  visita: 'bg-success',
  ligacao: 'bg-info',
  reuniao: 'bg-warning',
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
    <div className="flex gap-1.5 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
      {weekDays.map((day) => {
        const dayCompromissos = getCompromissosForDay(day);
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex-shrink-0 w-[100px] rounded-xl p-2 transition-all duration-200 cursor-pointer",
              isSelected ? "bg-primary/10 ring-2 ring-primary" : "bg-secondary/50",
              isToday && !isSelected && "ring-1 ring-primary/50"
            )}
            onClick={() => onSelectDate(day)}
          >
            {/* Day Header - Compact */}
            <div className="text-center mb-2 pb-1.5 border-b border-border/30">
              <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                {format(day, 'EEE', { locale: ptBR })}
              </p>
              <p className={cn(
                "text-xl font-bold",
                isToday ? "text-primary" : isSelected ? "text-primary" : "text-foreground"
              )}>
                {format(day, 'd')}
              </p>
              {dayCompromissos.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-1">
                  {dayCompromissos.slice(0, 4).map((c, i) => (
                    <div 
                      key={i} 
                      className={cn("w-1.5 h-1.5 rounded-full", tipoColors[c.tipo] || 'bg-muted')}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Compromissos - Ultra Compact */}
            <div className="space-y-1">
              {dayCompromissos.length === 0 ? (
                <p className="text-[9px] text-muted-foreground/50 text-center py-2">—</p>
              ) : (
                dayCompromissos.slice(0, 5).map((compromisso) => (
                  <button
                    key={compromisso.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCompromisso(compromisso);
                    }}
                    className="w-full flex items-center gap-1.5 p-1.5 rounded-lg bg-card/60 hover:bg-card transition-colors text-left"
                  >
                    {/* Color indicator */}
                    <div className={cn(
                      "w-1 h-6 rounded-full flex-shrink-0",
                      tipoColors[compromisso.tipo] || 'bg-muted'
                    )} />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-foreground">
                        {compromisso.hora}
                      </p>
                      <p className="text-[9px] text-muted-foreground truncate">
                        {compromisso.cliente.split(' ')[0]}
                      </p>
                    </div>
                  </button>
                ))
              )}
              {dayCompromissos.length > 5 && (
                <p className="text-[9px] text-primary text-center font-medium">
                  +{dayCompromissos.length - 5}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
