import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from 'lucide-react';
import { useCompromissos, Compromisso } from '@/hooks/useCompromissos';
import { SwipeableCompromissoCard } from '@/components/agenda/SwipeableCompromissoCard';
import { CompromissoDetailSheet } from '@/components/agenda/CompromissoDetailSheet';
import { AgendaWeekView } from '@/components/agenda/AgendaWeekView';
import { AgendaMonthView } from '@/components/agenda/AgendaMonthView';
import { RescheduleSheet } from '@/components/agenda/RescheduleSheet';
import { PageHeader } from '@/components/layout/PageHeader';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const views = ['Semana', 'Mês'];
const SWIPE_THRESHOLD = 50;

interface AgendaPageProps {
  onBack?: () => void;
}

export const AgendaPage = ({ onBack }: AgendaPageProps) => {
  const [activeView, setActiveView] = useState('Semana');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCompromisso, setSelectedCompromisso] = useState<Compromisso | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isVisitaFormOpen, setIsVisitaFormOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  
  // Touch handling refs
  const touchStartX = useRef(0);
  const isSwiping = useRef(false);
  
  const { compromissos, loading, updateCompromisso } = useCompromissos();
  
  // Filter compromissos for selected date (sorted by time)
  const filteredCompromissos = useMemo(() => {
    return compromissos
      .filter(c => isSameDay(parseISO(c.data), selectedDate))
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [compromissos, selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(direction === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    toast.success('Voltando para hoje');
  };

  // Swipe handlers for month navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    setSwipeOffset(diff * 0.3);
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    
    if (swipeOffset > SWIPE_THRESHOLD) {
      navigateMonth('prev');
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      navigateMonth('next');
    }
    
    setSwipeOffset(0);
    isSwiping.current = false;
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

  const handleReschedule = async (id: string, newDate: string, newTime: string) => {
    const { error } = await updateCompromisso(id, { data: newDate, hora: newTime });
    if (error) {
      toast.error('Erro ao reagendar compromisso');
    } else {
      toast.success('Compromisso reagendado!');
      handleCloseDetail();
    }
  };

  const openRescheduleSheet = () => {
    setIsRescheduleOpen(true);
  };

  const isTodaySelected = isToday(selectedDate);
  
  return (
    <div className="min-h-screen bg-background content-safe">
      {/* Header - Simplified */}
      <header className="sticky top-0 z-40 glassmorphism px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <PageHeader title="Agenda" onBack={onBack} />
          
          {/* Today Button */}
          {!isTodaySelected && (
            <button
              onClick={goToToday}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium animate-scale-press"
            >
              <CalendarDays className="w-4 h-4" />
              Hoje
            </button>
          )}
        </div>

        {/* Month Navigation - Only for Month view */}
        {activeView === 'Mês' && (
          <div 
            className="flex items-center justify-between mb-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button 
              onClick={() => navigateMonth('prev')}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            
            <div 
              className="transition-transform duration-150"
              style={{ transform: `translateX(${swipeOffset}px)` }}
            >
              <p className="text-lg font-bold text-foreground capitalize">
                {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
              </p>
            </div>
            
            <button 
              onClick={() => navigateMonth('next')}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </div>
        )}
        
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
        ) : activeView === 'Semana' ? (
          <AgendaWeekView
            compromissos={compromissos}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectCompromisso={handleCardClick}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <AgendaMonthView
              compromissos={compromissos}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            {/* Show day's compromissos below calendar */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {format(selectedDate, "d 'de' MMMM", { locale: ptBR })} - {filteredCompromissos.length} {filteredCompromissos.length === 1 ? 'compromisso' : 'compromissos'}
              </h3>
              {filteredCompromissos.length === 0 ? (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-sm text-muted-foreground">Nenhum compromisso neste dia</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredCompromissos.map((compromisso) => (
                    <SwipeableCompromissoCard
                      key={compromisso.id}
                      compromisso={compromisso}
                      onClick={() => handleCardClick(compromisso)}
                      onConfirm={() => handleConfirm(compromisso)}
                      onCancel={() => handleCancel(compromisso)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
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
        onReschedule={openRescheduleSheet}
      />

      {/* Reschedule Sheet */}
      <RescheduleSheet
        compromisso={selectedCompromisso}
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onReschedule={handleReschedule}
      />

      {/* Visita Form */}
      <VisitaForm 
        isOpen={isVisitaFormOpen} 
        onClose={() => setIsVisitaFormOpen(false)} 
      />
    </div>
  );
};
