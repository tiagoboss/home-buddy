import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from 'lucide-react';
import { useCompromissos, Compromisso } from '@/hooks/useCompromissos';
import { SwipeableCompromissoCard } from '@/components/agenda/SwipeableCompromissoCard';
import { CompromissoDetailSheet } from '@/components/agenda/CompromissoDetailSheet';
import { AgendaEmptyState } from '@/components/agenda/AgendaEmptyState';
import { AgendaWeekView } from '@/components/agenda/AgendaWeekView';
import { AgendaMonthView } from '@/components/agenda/AgendaMonthView';
import { RescheduleSheet } from '@/components/agenda/RescheduleSheet';
import { PageHeader } from '@/components/layout/PageHeader';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { cn } from '@/lib/utils';
import { format, isSameDay, parseISO, startOfWeek, addDays, isToday, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const views = ['Dia', 'Semana', 'Mês'];
const SWIPE_THRESHOLD = 50;

interface AgendaPageProps {
  onBack?: () => void;
}

export const AgendaPage = ({ onBack }: AgendaPageProps) => {
  const [activeView, setActiveView] = useState('Dia');
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
  
  // Generate week days starting from the week of selected date
  const weekDays = useMemo(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 }); // Sunday
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  // Count compromissos per day for the week
  const getCompromissosCountForDay = (date: Date) => {
    return compromissos.filter(c => isSameDay(parseISO(c.data), date)).length;
  };
  
  // Filter compromissos for selected date (sorted by time)
  const filteredCompromissos = useMemo(() => {
    return compromissos
      .filter(c => isSameDay(parseISO(c.data), selectedDate))
      .sort((a, b) => a.hora.localeCompare(b.hora));
  }, [compromissos, selectedDate]);
  
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

  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate(direction === 'next' ? addMonths(selectedDate, 1) : subMonths(selectedDate, 1));
  };

  const goToToday = () => {
    setSelectedDate(new Date());
    toast.success('Voltando para hoje');
  };

  // Swipe handlers for week navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isSwiping.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    setSwipeOffset(diff * 0.3); // Dampen the offset for visual feedback
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    
    if (swipeOffset > SWIPE_THRESHOLD) {
      activeView === 'Mês' ? navigateMonth('prev') : navigateWeek('prev');
    } else if (swipeOffset < -SWIPE_THRESHOLD) {
      activeView === 'Mês' ? navigateMonth('next') : navigateWeek('next');
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
      {/* Header */}
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
        
        {/* Week Mini Calendar with Swipe - Only for Day view */}
        {activeView === 'Dia' && (
          <div 
            className="flex items-center justify-between mb-3"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button 
              onClick={() => navigateWeek('prev')}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            
            <div 
              className="flex gap-1.5 flex-1 justify-center transition-transform duration-150"
              style={{ transform: `translateX(${swipeOffset}px)` }}
            >
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
        )}

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

        {/* Selected Date Info - Only for Day view */}
        {activeView === 'Dia' && (
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
          />
        ) : activeView === 'Mês' ? (
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
