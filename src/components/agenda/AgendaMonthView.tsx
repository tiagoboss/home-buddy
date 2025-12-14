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

  const calendarDays: Date[] = [];
  let currentDay = calendarStart;
  while (currentDay <= calendarEnd) {
    calendarDays.push(currentDay);
    currentDay = addDays(currentDay, 1);
  }

  const getCompromissosCountForDay = (date: Date) => {
    return compromissos.filter(c => isSameDay(parseISO(c.data), date)).length;
  };

  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <div className="bg-secondary rounded-2xl p-3">
      {/* Weekday Headers - Compact */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center">
            <span className="text-[10px] font-medium text-muted-foreground">
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
                "aspect-square flex flex-col items-center justify-center rounded-lg transition-all duration-200 animate-scale-press",
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
                "text-xs font-medium",
                !isCurrentMonth && "opacity-40"
              )}>
                {format(day, 'd')}
              </span>
              
              {/* Single dot indicator */}
              {count > 0 && isCurrentMonth && (
                <div className={cn(
                  "w-1 h-1 rounded-full mt-0.5",
                  isSelected ? "bg-primary-foreground" : "bg-primary"
                )} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
