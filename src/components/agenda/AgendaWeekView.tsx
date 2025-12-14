import { Compromisso } from '@/hooks/useCompromissos';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, addDays, isToday, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SwipeableCompromissoCard } from './SwipeableCompromissoCard';
import { useRef, useEffect } from 'react';

interface AgendaWeekViewProps {
  compromissos: Compromisso[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectCompromisso: (compromisso: Compromisso) => void;
  onConfirm?: (compromisso: Compromisso) => void;
  onCancel?: (compromisso: Compromisso) => void;
}

export const AgendaWeekView = ({ 
  compromissos, 
  selectedDate, 
  onSelectDate, 
  onSelectCompromisso,
  onConfirm,
  onCancel
}: AgendaWeekViewProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLButtonElement>(null);
  
  const today = startOfDay(new Date());
  // Show 3 days before today + today + 10 days after = 14 days total
  const daysToShow = Array.from({ length: 14 }, (_, i) => addDays(today, i - 3));

  // Auto-scroll to today on mount
  useEffect(() => {
    if (todayRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const todayButton = todayRef.current;
      // Scroll to position today at the start of the visible area
      container.scrollLeft = todayButton.offsetLeft - 16;
    }
  }, []);

  const getCompromissosForDay = (date: Date) => {
    return compromissos
      .filter(c => isSameDay(parseISO(c.data), date))
      .sort((a, b) => a.hora.localeCompare(b.hora));
  };

  const selectedDayCompromissos = getCompromissosForDay(selectedDate);

  return (
    <div className="space-y-4">
      {/* Compact Day Selector */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-1.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
      >
        {daysToShow.map((day) => {
          const dayCompromissos = getCompromissosForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toISOString()}
              ref={isTodayDate ? todayRef : undefined}
              onClick={() => onSelectDate(day)}
              className={cn(
                "flex-shrink-0 flex flex-col items-center justify-center w-11 h-14 rounded-xl transition-all duration-200",
                isSelected 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : isTodayDate
                    ? "bg-primary/20"
                    : "bg-secondary/50 hover:bg-secondary"
              )}
            >
              <span className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
              )}>
                {format(day, 'EEE', { locale: ptBR }).slice(0, 3)}
              </span>
              <span className={cn(
                "text-base font-bold",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}>
                {format(day, 'd')}
              </span>
              {/* Discreet dots indicator */}
              {dayCompromissos.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayCompromissos.slice(0, 3).map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-1 h-1 rounded-full",
                        isSelected ? "bg-primary-foreground/60" : "bg-primary/60"
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Appointments List */}
      <div className="space-y-2">
        {selectedDayCompromissos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
              <span className="text-xl">📅</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nenhum compromisso
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Toque em + para agendar
            </p>
          </div>
        ) : (
          selectedDayCompromissos.map((compromisso) => (
            <SwipeableCompromissoCard
              key={compromisso.id}
              compromisso={compromisso}
              onClick={() => onSelectCompromisso(compromisso)}
              onConfirm={onConfirm ? () => onConfirm(compromisso) : undefined}
              onCancel={onCancel ? () => onCancel(compromisso) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
