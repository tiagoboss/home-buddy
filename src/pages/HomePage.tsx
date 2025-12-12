import { useState } from 'react';
import { DollarSign, TrendingUp, Target, Clock, ChevronRight } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CompromissoCard } from '@/components/home/CompromissoCard';
import { LeadCard } from '@/components/home/LeadCard';
import { ImovelCard } from '@/components/home/ImovelCard';
import { KPIDetailSheet } from '@/components/home/KPIDetailSheet';
import { corretor, compromissos, leads, imoveis } from '@/data/mockData';

type KPIType = 'vendas' | 'conversao' | 'meta' | 'fechamento' | null;

export const HomePage = () => {
  const [activeKPI, setActiveKPI] = useState<KPIType>(null);
  
  const hotLeads = leads.filter(l => l.status === 'quente' || l.status === 'negociacao');
  const todayCompromissos = compromissos.slice(0, 3);
  
  return (
    <div className="bg-background">
      <main className="py-4 space-y-5">
        {/* KPIs */}
        <section className="px-4">
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar snap-x-mandatory scroll-pl-0 -mr-4 pr-4">
            <KPICard 
              icon={DollarSign} 
              value={corretor.vendas} 
              label="vendas"
              iconColor="bg-success"
              onClick={() => setActiveKPI('vendas')}
            />
            <KPICard 
              icon={TrendingUp} 
              value={`${corretor.taxaConversao}%`} 
              label="conversão"
              iconColor="bg-info"
              onClick={() => setActiveKPI('conversao')}
            />
            <KPICard 
              icon={Target} 
              value={`${Math.round((corretor.vendas / corretor.meta) * 100)}%`} 
              label="meta"
              iconColor="bg-warning"
              onClick={() => setActiveKPI('meta')}
            />
            <KPICard 
              icon={Clock} 
              value={`${corretor.tempoMedioFechamento}d`} 
              label="fechamento"
              onClick={() => setActiveKPI('fechamento')}
            />
          </div>
        </section>
        
        {/* Progress */}
        <section className="px-4">
          <ProgressBar 
            current={corretor.vendas} 
            total={corretor.meta}
            label="Meta Mensal"
          />
        </section>
        
        {/* Próximos Compromissos */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Próximos Compromissos</h2>
            <button className="flex items-center gap-0.5 text-xs text-primary font-medium animate-scale-press">
              Ver todos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="ios-section">
            {todayCompromissos.map((c) => (
              <CompromissoCard key={c.id} compromisso={c} />
            ))}
          </div>
        </section>
        
        {/* Leads Quentes */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Leads Quentes</h2>
            <button className="flex items-center gap-0.5 text-xs text-primary font-medium animate-scale-press">
              Ver todos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar snap-x-mandatory scroll-pl-0 -mr-4 pr-4">
            {hotLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} compact />
            ))}
          </div>
        </section>
        
        {/* Imóveis em Destaque */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Imóveis em Destaque</h2>
            <button className="flex items-center gap-0.5 text-xs text-primary font-medium animate-scale-press">
              Ver todos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar snap-x-mandatory scroll-pl-0 -mr-4 pr-4">
            {imoveis.map((imovel) => (
              <ImovelCard key={imovel.id} imovel={imovel} />
            ))}
          </div>
        </section>
      </main>
      
      {/* KPI Detail Sheet */}
      <KPIDetailSheet 
        type={activeKPI}
        isOpen={activeKPI !== null}
        onClose={() => setActiveKPI(null)}
      />
    </div>
  );
};
