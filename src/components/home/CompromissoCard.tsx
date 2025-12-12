import { Home, Phone, Users, MapPin, ChevronRight } from 'lucide-react';
import { Compromisso } from '@/types';
import { cn } from '@/lib/utils';

interface CompromissoCardProps {
  compromisso: Compromisso;
}

const tipoIcons = {
  visita: Home,
  ligacao: Phone,
  reuniao: Users,
};

const tipoLabels = {
  visita: 'Visita',
  ligacao: 'Ligação',
  reuniao: 'Reunião',
};

export const CompromissoCard = ({ compromisso }: CompromissoCardProps) => {
  const Icon = tipoIcons[compromisso.tipo];
  
  return (
    <div className="ios-list-item animate-scale-press group">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
          compromisso.status === 'confirmado' ? 'bg-success/10' : 'bg-warning/10'
        )}>
          <Icon className={cn(
            "w-5 h-5",
            compromisso.status === 'confirmado' ? 'text-success' : 'text-warning'
          )} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {compromisso.hora}
            </span>
            <span className="text-xs text-muted-foreground px-2 py-0.5 bg-secondary rounded-full">
              {tipoLabels[compromisso.tipo]}
            </span>
          </div>
          <p className="text-sm text-foreground mt-0.5 truncate">
            {compromisso.cliente}
          </p>
          {compromisso.endereco && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground truncate">
                {compromisso.endereco}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
    </div>
  );
};
