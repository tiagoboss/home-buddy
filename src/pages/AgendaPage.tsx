import { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Phone, Users, MapPin, Navigation } from 'lucide-react';
import { compromissos } from '@/data/mockData';
import { cn } from '@/lib/utils';

const views = ['Dia', 'Semana', 'Mês'];

const tipoConfig = {
  visita: { icon: Home, color: 'bg-success', label: 'Visita' },
  ligacao: { icon: Phone, color: 'bg-info', label: 'Ligação' },
  reuniao: { icon: Users, color: 'bg-warning', label: 'Reunião' },
};

export const AgendaPage = () => {
  const [activeView, setActiveView] = useState('Dia');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
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
      
      {/* Timeline */}
      <main className="px-4 py-4">
        <div className="space-y-3">
          {compromissos.map((compromisso, index) => {
            const config = tipoConfig[compromisso.tipo];
            const Icon = config.icon;
            
            return (
              <div 
                key={compromisso.id}
                className="ios-card p-4 animate-scale-press"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    config.color
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-semibold text-foreground">
                        {compromisso.hora}
                      </span>
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        compromisso.status === 'confirmado' 
                          ? "bg-success/10 text-success"
                          : "bg-warning/10 text-warning"
                      )}>
                        {compromisso.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                      </span>
                    </div>
                    
                    <p className="text-base font-medium text-foreground">
                      {config.label} - {compromisso.cliente}
                    </p>
                    
                    {compromisso.imovel && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {compromisso.imovel}
                      </p>
                    )}
                    
                    {compromisso.endereco && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground flex-1 min-w-0">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{compromisso.endereco}</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-info flex items-center justify-center animate-scale-press flex-shrink-0">
                          <Navigation className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
