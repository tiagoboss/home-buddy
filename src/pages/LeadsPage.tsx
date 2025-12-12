import { useState } from 'react';
import { Search, Filter, MessageCircle, Phone } from 'lucide-react';
import { LeadCard } from '@/components/home/LeadCard';
import { leads } from '@/data/mockData';
import { Lead } from '@/types';
import { cn } from '@/lib/utils';

const filters = [
  { id: 'todos', label: 'Todos' },
  { id: 'novo', label: 'Novos' },
  { id: 'quente', label: 'Quentes' },
  { id: 'negociacao', label: 'Em Negociação' },
];

export const LeadsPage = () => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [swipedLead, setSwipedLead] = useState<string | null>(null);
  
  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = activeFilter === 'todos' || lead.status === activeFilter;
    const matchesSearch = lead.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.telefone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });
  
  return (
    <div className="min-h-screen bg-background content-safe">
      {/* Header */}
      <header className="sticky top-0 z-40 glassmorphism px-4 py-3">
        <h1 className="text-2xl font-bold text-foreground tracking-tight mb-3">Meus Leads</h1>
        
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
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-4 px-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 animate-scale-press",
                activeFilter === filter.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>
      
      {/* Leads List */}
      <main className="px-4 py-4">
        <div className="ios-section">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="relative overflow-hidden"
              onTouchStart={() => setSwipedLead(null)}
            >
              {/* Swipe Actions (Visual only for now) */}
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button className="h-full px-4 bg-success flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </button>
                <button className="h-full px-4 bg-info flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="relative bg-card">
                <LeadCard lead={lead} />
              </div>
            </div>
          ))}
        </div>
        
        {filteredLeads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium">Nenhum lead encontrado</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tente ajustar seus filtros
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
