import { Compromisso } from '@/hooks/useCompromissos';
import { Home, Phone, Users, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface AgendaWeekViewProps {
  compromissos: Compromisso[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSelectCompromisso: (compromisso: Compromisso) => void;
}

const tipoConfig: Record<string, { icon: typeof Home; color: string; bgColor: string; label: string }> = {
  visita: { icon: Home, color: 'text-success', bgColor: 'bg-success/15', label: 'Visita' },
  ligacao: { icon: Phone, color: 'text-info', bgColor: 'bg-info/15', label: 'Ligação' },
  reuniao: { icon: Users, color: 'text-warning', bgColor: 'bg-warning/15', label: 'Reunião' },
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pendente: { label: 'Pendente', variant: 'secondary' },
  confirmado: { label: 'Confirmado', variant: 'default' },
  cancelado: { label: 'Cancelado', variant: 'destructive' },
  realizado: { label: 'Realizado', variant: 'outline' },
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
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
      {weekDays.map((day) => {
        const dayCompromissos = getCompromissosForDay(day);
        const isSelected = isSameDay(day, selectedDate);
        const isToday = isSameDay(day, new Date());

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "flex-shrink-0 w-[160px] rounded-2xl p-3 transition-all duration-200 cursor-pointer",
              isSelected ? "bg-primary/10 ring-2 ring-primary" : "bg-secondary/50",
              isToday && !isSelected && "ring-1 ring-primary/50"
            )}
            onClick={() => onSelectDate(day)}
          >
            {/* Day Header */}
            <div className="text-center mb-3 pb-2 border-b border-border/50">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {format(day, 'EEEE', { locale: ptBR })}
              </p>
              <p className={cn(
                "text-2xl font-bold mt-0.5",
                isToday ? "text-primary" : isSelected ? "text-primary" : "text-foreground"
              )}>
                {format(day, 'd')}
              </p>
              {dayCompromissos.length > 0 && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  {dayCompromissos.length} compromisso{dayCompromissos.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Compromissos */}
            <div className="space-y-2 min-h-[140px]">
              {dayCompromissos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground/50">
                  <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center mb-2">
                    <Home className="w-4 h-4" />
                  </div>
                  <p className="text-[10px]">Sem compromissos</p>
                </div>
              ) : (
                dayCompromissos.slice(0, 3).map((compromisso) => {
                  const config = tipoConfig[compromisso.tipo] || tipoConfig.visita;
                  const status = statusConfig[compromisso.status || 'pendente'];
                  const Icon = config.icon;

                  return (
                    <button
                      key={compromisso.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCompromisso(compromisso);
                      }}
                      className={cn(
                        "w-full p-2.5 rounded-xl bg-card/80 backdrop-blur-sm text-left transition-all duration-200",
                        "hover:bg-card hover:shadow-md active:scale-[0.98]",
                        "border border-border/50"
                      )}
                    >
                      {/* Header with icon and time */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={cn(
                          "w-6 h-6 rounded-lg flex items-center justify-center",
                          config.bgColor
                        )}>
                          <Icon className={cn("w-3.5 h-3.5", config.color)} />
                        </div>
                        <span className="text-sm font-bold text-foreground">
                          {compromisso.hora}
                        </span>
                      </div>
                      
                      {/* Client name */}
                      <p className="text-xs font-medium text-foreground truncate mb-1">
                        {compromisso.cliente}
                      </p>
                      
                      {/* Location if available */}
                      {compromisso.endereco && (
                        <div className="flex items-center gap-1 mb-1.5">
                          <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
                          <p className="text-[10px] text-muted-foreground truncate">
                            {compromisso.endereco.split(',')[0]}
                          </p>
                        </div>
                      )}
                      
                      {/* Status badge */}
                      <Badge 
                        variant={status.variant} 
                        className="text-[9px] px-1.5 py-0 h-4"
                      >
                        {status.label}
                      </Badge>
                    </button>
                  );
                })
              )}
              {dayCompromissos.length > 3 && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectDate(day);
                  }}
                  className="w-full text-xs text-primary text-center font-semibold py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                >
                  +{dayCompromissos.length - 3} mais
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
