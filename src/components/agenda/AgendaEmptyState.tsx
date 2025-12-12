import { Calendar, Plus } from 'lucide-react';

interface AgendaEmptyStateProps {
  onScheduleVisit: () => void;
}

export const AgendaEmptyState = ({ onScheduleVisit }: AgendaEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
        <Calendar className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Nenhum compromisso
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Você não tem compromissos agendados para este dia
      </p>
      
      <button 
        onClick={onScheduleVisit}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium animate-scale-press"
      >
        <Plus className="w-5 h-5" />
        Agendar Visita
      </button>
    </div>
  );
};
