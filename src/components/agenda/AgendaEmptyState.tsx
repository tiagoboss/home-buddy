import { Calendar, Plus } from 'lucide-react';

interface AgendaEmptyStateProps {
  onScheduleVisit: () => void;
}

export const AgendaEmptyState = ({ onScheduleVisit }: AgendaEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 animate-pulse">
        <Calendar className="w-10 h-10 text-primary/60" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Dia livre!
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-[200px]">
        Que tal aproveitar para agendar uma visita?
      </p>
      
      <button 
        onClick={onScheduleVisit}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium animate-scale-press shadow-lg shadow-primary/20"
      >
        <Plus className="w-5 h-5" />
        Agendar Visita
      </button>
    </div>
  );
};
