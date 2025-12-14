import { useState } from 'react';
import { Search, Filter, Loader2, RefreshCw } from 'lucide-react';
import { SwipeableLeadCard } from '@/components/leads/SwipeableLeadCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { useLeads, Lead } from '@/hooks/useLeads';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const filters = [
  { id: 'todos', label: 'Todos' },
  { id: 'novo', label: 'Novos' },
  { id: 'quente', label: 'Quentes' },
  { id: 'morno', label: 'Mornos' },
  { id: 'frio', label: 'Frios' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'fechado', label: 'Fechados' },
  { id: 'perdido', label: 'Perdidos' },
];

interface LeadsPageProps {
  onScheduleVisit?: (lead: Lead) => void;
  onBack?: () => void;
  onSelectLead?: (lead: Lead) => void;
}

export const LeadsPage = ({ onScheduleVisit, onBack, onSelectLead }: LeadsPageProps) => {
  const { leads, loading, fetchLeads, deleteLead } = useLeads();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchLeads();
    setIsRefreshing(false);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = activeFilter === 'todos' || lead.status === activeFilter;
    const matchesSearch = lead.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (lead.telefone?.includes(searchQuery) ?? false);
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (filterId: string) => {
    if (filterId === 'todos') return leads.length;
    return leads.filter(l => l.status === filterId).length;
  };
  
  return (
    <div className="min-h-screen bg-background content-safe">
      {/* Header */}
      <header className="sticky top-0 z-40 glassmorphism px-4 py-3">
        <PageHeader
          title="Meus Leads"
          onBack={onBack}
          rightContent={
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9 w-9"
            >
              <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
            </Button>
          }
        />
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou telefone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        {/* Filters with counts */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {filters.map((filter) => {
            const count = getFilterCount(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 animate-scale-press flex items-center gap-1.5",
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {filter.label}
                {count > 0 && (
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center",
                    activeFilter === filter.id
                      ? "bg-primary-foreground/20"
                      : "bg-muted"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>
      
      {/* Leads List */}
      <main className="px-4 py-4 animate-fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {filteredLeads.map((lead) => (
                <SwipeableLeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => onSelectLead?.(lead)}
                  onDelete={() => deleteLead(lead.id)}
                />
              ))}
            </div>
            
            {filteredLeads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Nenhum lead encontrado</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {leads.length === 0 
                    ? 'Adicione seu primeiro lead clicando no botão +' 
                    : 'Tente ajustar seus filtros'}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};
