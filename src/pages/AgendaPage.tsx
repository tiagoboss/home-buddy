import { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useCompromissos, Compromisso } from '@/hooks/useCompromissos';
import { SwipeableCompromissoCard } from '@/components/agenda/SwipeableCompromissoCard';
import { CompromissoDetailSheet } from '@/components/agenda/CompromissoDetailSheet';
import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const views = ['Dia', 'Semana', 'Mês'];

export const AgendaPage = () => {
  const [activeView, setActiveView] = useState('Dia');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompromisso, setSelectedCompromisso] = useState<Compromisso | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isVisitaFormOpen, setIsVisitaFormOpen] = useState(false);
  
  const { compromissos, loading, updateCompromisso } = useCompromissos();
  
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
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
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
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-3">Agenda</h1>
        
        {/* Date Navigator */}
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={() => navigateDate('prev')}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <p className="text-sm font-medium text-foreground capitalize">
            {formatDate(selectedDate)}
          </p>
          
          <button 
            onClick={() => navigateDate('next')}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
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
