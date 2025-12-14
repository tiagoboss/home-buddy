import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCompromissos, Compromisso } from '@/hooks/useCompromissos';
import { SwipeableCompromissoCard } from '@/components/agenda/SwipeableCompromissoCard';
import { CompromissoDetailSheet } from '@/components/agenda/CompromissoDetailSheet';
import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, startOfWeek, addDays, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const views = ['Dia', 'Semana', 'Mês'];

interface AgendaPageProps {
  onBack?: () => void;
}

export const AgendaPage = ({ onBack }: AgendaPageProps) => {
  const [activeView, setActiveView] = useState('Dia');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompromisso, setSelectedCompromisso] = useState<Compromisso | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isVisitaFormOpen, setIsVisitaFormOpen] = useState(false);
  
  const { compromissos, loading, updateCompromisso } = useCompromissos();
  
  // Generate week days starting from the week of selected date
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  // Count compromissos per day for the week
  const getCompromissosCountForDay = (date: Date) => {
    return compromissos.filter(c => isSameDay(parseISO(c.data), date)).length;
  };
  
  // Filter compromissos for selected date
  const filteredCompromissos = compromissos.filter(c => {
    const compromissoDate = parseISO(c.data);
    return isSameDay(compromissoDate, selectedDate);
  });
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedDate(newDate);
  };

  const handleCardClick = (compromisso: Compromisso) => {
    setSelectedCompromisso(compromisso);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedCompromisso(null), 200);
  };

  const handleConfirm = async (compromisso: Compromisso) => {
    const { error } = await updateCompromisso(compromisso.id, { status: 'confirmado' });
    if (error) {
      toast.error('Erro ao confirmar compromisso');
    } else {
      toast.success('Compromisso confirmado!');
      if (isDetailOpen) handleCloseDetail();
    }
  };

  const handleCancel = async (compromisso: Compromisso) => {
    const { error } = await updateCompromisso(compromisso.id, { status: 'cancelado' });
    if (error) {
      toast.error('Erro ao cancelar compromisso');
    } else {
      toast.success('Compromisso cancelado');
      if (isDetailOpen) handleCloseDetail();
    }
  };

  const handleComplete = async (compromisso: Compromisso) => {
    const { error } = await updateCompromisso(compromisso.id, { status: 'realizado' });
    if (error) {
      toast.error('Erro ao marcar como realizado');
    } else {
      toast.success('Compromisso realizado!');
      if (isDetailOpen) handleCloseDetail();
    }
  };
  
  return (
    <div className="min-h-screen bg-background content-safe">
      {/* Header */}
      <header className="sticky top-0 z-40 glassmorphism px-4 py-3">
        <PageHeader title="Agenda" onBack={onBack} />
        
        {/* Week Mini Calendar */}
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigateWeek('prev')}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          
          <div className="flex gap-1.5 flex-1 justify-center">
            {weekDays.map((day) => {
              const count = getCompromissosCountForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "flex flex-col items-center py-2 px-2.5 rounded-xl transition-all duration-200 animate-scale-press min-w-[40px]",
                    isSelected 
                      ? "bg-primary text-primary-foreground" 
                      : isTodayDate 
                        ? "bg-primary/20" 
                        : "bg-secondary"
                  )}
                >
                  <span className={cn(
                    "text-[10px] font-medium uppercase",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )}>
                    {format(day, 'EEE', { locale: ptBR }).slice(0, 3)}
                  </span>
                  <span className={cn(
                    "text-sm font-semibold",
                    isSelected ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {format(day, 'd')}
                  </span>
                  {/* Indicator dots */}
                  <div className="flex gap-0.5 mt-1 h-1.5">
                    {count > 0 && (
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground" : "bg-primary"
                      )} />
                    )}
                    {count > 2 && (
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground/60" : "bg-primary/60"
                      )} />
                    )}
                    {count > 4 && (
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected ? "bg-primary-foreground/40" : "bg-primary/40"
                      )} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => navigateWeek('next')}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Selected Date Info */}
        <div className="flex items-center justify-center mb-3">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-foreground capitalize">
              {formatDate(selectedDate)}
            </p>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full mt-1",
              filteredCompromissos.length > 0 
                ? "bg-primary/20 text-primary" 
                : "bg-muted text-muted-foreground"
            )}>
              {filteredCompromissos.length} {filteredCompromissos.length === 1 ? 'compromisso' : 'compromissos'}
            </span>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex bg-secondary rounded-xl p-1">
          {views.map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                activeView === view
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              )}
            >
              {view}
            </button>
          ))}
        </div>
      </header>
      
      {/* Content */}
      <main className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredCompromissos.length === 0 ? (
          <AgendaEmptyState onScheduleVisit={() => setIsVisitaFormOpen(true)} />
        ) : (
          <div className="space-y-3">
            {filteredCompromissos.map((compromisso, index) => (
              <div 
                key={compromisso.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-fade-in"
              >
                <SwipeableCompromissoCard
                  compromisso={compromisso}
                  onClick={() => handleCardClick(compromisso)}
                  onConfirm={() => handleConfirm(compromisso)}
                  onCancel={() => handleCancel(compromisso)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Sheet */}
      <CompromissoDetailSheet
        compromisso={selectedCompromisso}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        onConfirm={selectedCompromisso ? () => handleConfirm(selectedCompromisso) : undefined}
        onCancel={selectedCompromisso ? () => handleCancel(selectedCompromisso) : undefined}
        onComplete={selectedCompromisso ? () => handleComplete(selectedCompromisso) : undefined}
      />

      {/* Visita Form */}
      <VisitaForm 
        isOpen={isVisitaFormOpen} 
        onClose={() => setIsVisitaFormOpen(false)} 
      />
    </div>
  );
};
