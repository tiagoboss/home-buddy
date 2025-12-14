import { Compromisso } from '@/hooks/useCompromissos';
import { cn } from '@/lib/utils';
import { 
  format, 
  isSameDay, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth,
  isToday
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AgendaMonthViewProps {
  compromissos: Compromisso[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const AgendaMonthView = ({ 
  compromissos, 
  selectedDate, 
  onSelectDate 
}: AgendaMonthViewProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Generate all days for the calendar
  const calendarDays: Date[] = [];
  let currentDay = calendarStart;
  while (currentDay <= calendarEnd) {
    calendarDays.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  const getCompromissosCountForDay = (date: Date) => {
    return compromissos.filter(c => isSameDay(parseISO(c.data), date)).length;
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-secondary rounded-2xl p-4">
      {/* Month Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-foreground capitalize">
          {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
        </h3>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center">
            <span className="text-xs font-medium text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day) => {
          const count = getCompromissosCountForDay(day);
          const isSelected = isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 animate-scale-press p-1",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : isTodayDate 
                    ? "bg-primary/20 text-foreground" 
                    : isCurrentMonth
                      ? "bg-card hover:bg-card/80"
                      : "bg-transparent text-muted-foreground/50"
              )}
            >
              <span className={cn(
                "text-sm font-medium",
                !isCurrentMonth && "opacity-40"
              )}>
                {format(day, 'd')}
              </span>
              
              {/* Indicator dots */}
              {count > 0 && isCurrentMonth && (
                <div className="flex gap-0.5 mt-0.5">
                  <div className={cn(
                    "w-1 h-1 rounded-full",
                    isSelected ? "bg-primary-foreground" : "bg-primary"
                  )} />
                  {count > 2 && (
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      isSelected ? "bg-primary-foreground/60" : "bg-primary/60"
                    )} />
                  )}
                  {count > 4 && (
                    <div className={cn(
                      "w-1 h-1 rounded-full",
                      isSelected ? "bg-primary-foreground/40" : "bg-primary/40"
                    )} />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
