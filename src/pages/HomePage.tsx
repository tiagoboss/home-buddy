import { useState } from 'react';
import { DollarSign, TrendingUp, Target, Clock, ChevronRight, FileText } from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CompromissoCard } from '@/components/home/CompromissoCard';
import { LeadCard } from '@/components/home/LeadCard';
import { ImovelCard } from '@/components/home/ImovelCard';
import { CompromissoDetailSheet } from '@/components/agenda/CompromissoDetailSheet';
import { LeadDetailSheet } from '@/components/leads/LeadDetailSheet';
import { ImovelDetailSheet } from '@/components/imoveis/ImovelDetailSheet';
import { corretor, compromissos, leads, imoveis } from '@/data/mockData';
import { Compromisso as MockCompromisso, Lead as MockLead, Imovel, TabType } from '@/types';
import { Compromisso as HookCompromisso } from '@/hooks/useCompromissos';
import { useFavoritos } from '@/hooks/useFavoritos';
import { usePropostas } from '@/hooks/usePropostas';

interface HomePageProps {
  onTabChange?: (tab: TabType) => void;
}

export const HomePage = ({ onTabChange }: HomePageProps) => {
  const { propostas } = usePropostas();
  const hotLeads = leads.filter(l => l.status === 'quente' || l.status === 'negociacao');
  const todayCompromissos = compromissos.slice(0, 3);
  
  // Selected items for detail sheets
  const [selectedCompromisso, setSelectedCompromisso] = useState<MockCompromisso | null>(null);
  const [selectedLead, setSelectedLead] = useState<MockLead | null>(null);
  const [selectedImovel, setSelectedImovel] = useState<Imovel | null>(null);
  
  // Convert mock compromisso to hook format
  const convertToHookCompromisso = (c: MockCompromisso): HookCompromisso => ({
    id: c.id,
    user_id: '',
    tipo: c.tipo,
    data: c.data,
    hora: c.hora,
    cliente: c.cliente,
    imovel: c.imovel || null,
    endereco: c.endereco || null,
    status: c.status,
    lead_id: null,
    lead: null,
    created_at: c.data,
    updated_at: c.data,
  });
  
  const { isFavorito, toggleFavorito } = useFavoritos();

  // Propostas stats
  const propostasPendentes = propostas.filter(p => p.status === 'pendente').length;
  const propostasAceitas = propostas.filter(p => p.status === 'aceita').length;
  
  return (
    <div className="bg-background">
      <main className="py-4 space-y-5 animate-fade-in">
        {/* KPIs */}
        <section className="px-4">
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar snap-x-mandatory scroll-pl-0 -mr-4 pr-4">
            <KPICard 
              icon={DollarSign} 
              value={corretor.vendas} 
              label="vendas"
              iconColor="bg-success"
            />
            <KPICard 
              icon={TrendingUp} 
              value={`${corretor.taxaConversao}%`} 
              label="conversão"
              iconColor="bg-info"
            />
            <KPICard 
              icon={Target} 
              value={`${Math.round((corretor.vendas / corretor.meta) * 100)}%`} 
              label="meta"
              iconColor="bg-warning"
            />
            <KPICard 
              icon={Clock} 
              value={`${corretor.tempoMedioFechamento}d`} 
              label="fechamento"
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
        
        {/* Propostas Card */}
        <section className="px-4">
          <button
            onClick={() => onTabChange?.('propostas')}
            className="w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-4 flex items-center gap-4 animate-scale-press"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-foreground">Minhas Propostas</p>
              <p className="text-sm text-muted-foreground">
                {propostasPendentes > 0 
                  ? `${propostasPendentes} pendente${propostasPendentes > 1 ? 's' : ''}`
                  : 'Nenhuma pendente'}
                {propostasAceitas > 0 && ` • ${propostasAceitas} aceita${propostasAceitas > 1 ? 's' : ''}`}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </section>
        
        {/* Próximos Compromissos */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Próximos Compromissos</h2>
            <button 
              onClick={() => onTabChange?.('agenda')}
              className="flex items-center gap-0.5 text-xs text-primary font-medium animate-scale-press"
            >
              Ver todos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="ios-section">
            {todayCompromissos.map((c) => (
              <CompromissoCard 
                key={c.id} 
                compromisso={c} 
                onClick={() => setSelectedCompromisso(c)}
              />
            ))}
          </div>
        </section>
        
        {/* Leads Quentes */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Leads Quentes</h2>
            <button 
              onClick={() => onTabChange?.('leads')}
              className="flex items-center gap-0.5 text-xs text-primary font-medium animate-scale-press"
            >
              Ver todos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar snap-x-mandatory scroll-pl-0 -mr-4 pr-4">
            {hotLeads.map((lead) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                compact 
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        </section>
        
        {/* Imóveis em Destaque */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Imóveis em Destaque</h2>
            <button 
              onClick={() => onTabChange?.('imoveis')}
              className="flex items-center gap-0.5 text-xs text-primary font-medium animate-scale-press"
            >
              Ver todos
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 hide-scrollbar snap-x-mandatory scroll-pl-0 -mr-4 pr-4">
            {imoveis.map((imovel) => (
              <ImovelCard 
                key={imovel.id} 
                imovel={imovel} 
                onClick={() => setSelectedImovel(imovel)}
              />
            ))}
          </div>
        </section>
      </main>
      
      {/* Detail Sheets */}
      <CompromissoDetailSheet
        compromisso={selectedCompromisso ? convertToHookCompromisso(selectedCompromisso) : null}
        isOpen={!!selectedCompromisso}
        onClose={() => setSelectedCompromisso(null)}
      />
      
      {selectedLead && (
        <LeadDetailSheet
          lead={{
            id: selectedLead.id,
            user_id: '',
            nome: selectedLead.nome,
            telefone: selectedLead.telefone,
            email: selectedLead.email || null,
            status: selectedLead.status as any,
            interesse: selectedLead.interesse,
            faixa_preco: null,
            bairros: null,
            ultimo_contato: selectedLead.ultimoContato,
            avatar: selectedLead.avatar,
            created_at: selectedLead.ultimoContato,
            updated_at: selectedLead.ultimoContato,
          }}
          isOpen={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
      
      {selectedImovel && (
        <ImovelDetailSheet
          imovel={{
            ...selectedImovel,
            favorito: isFavorito(selectedImovel.id),
          }}
          isOpen={!!selectedImovel}
          onClose={() => setSelectedImovel(null)}
          onFavorite={() => toggleFavorito(selectedImovel.id)}
        />
      )}
    </div>
  );
};
