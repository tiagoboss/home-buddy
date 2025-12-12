import { Lead } from '@/types';
import { getStatusColor, getStatusLabel, getTimeSinceContact } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface LeadCardProps {
  lead: Lead;
  compact?: boolean;
}

export const LeadCard = ({ lead, compact = false }: LeadCardProps) => {
  if (compact) {
    return (
      <div className="flex-shrink-0 w-[140px] ios-card p-3 animate-scale-press snap-start">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-semibold text-primary">
            {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className={cn(
            "w-2 h-2 rounded-full",
            getStatusColor(lead.status)
          )} />
        </div>
        <p className="text-sm font-medium text-foreground truncate">{lead.nome.split(' ')[0]}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {getTimeSinceContact(lead.ultimoContato)}
        </p>
      </div>
    );
  }
  
  return (
    <div className="ios-list-item animate-scale-press">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
          {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-base font-medium text-foreground truncate">
              {lead.nome}
            </p>
            <span className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full text-white",
              getStatusColor(lead.status)
            )}>
              {getStatusLabel(lead.status)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lead.interesse}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {lead.telefone} • {getTimeSinceContact(lead.ultimoContato)}
          </p>
        </div>
      </div>
    </div>
  );
};
