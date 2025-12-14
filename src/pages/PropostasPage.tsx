import { useState } from 'react';
import { Search, Filter, Loader2, RefreshCw, FileText } from 'lucide-react';
import { SwipeablePropostaCard } from '@/components/propostas/SwipeablePropostaCard';
import { PropostaDetailSheet } from '@/components/propostas/PropostaDetailSheet';
import { PageHeader } from '@/components/layout/PageHeader';
import { usePropostas, Proposta } from '@/hooks/usePropostas';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const filters = [
  { id: 'todos', label: 'Todas' },
  { id: 'pendente', label: 'Pendentes' },
  { id: 'aceita', label: 'Aceitas' },
  { id: 'recusada', label: 'Recusadas' },
  { id: 'contra_proposta', label: 'Contra-proposta' },
  { id: 'expirada', label: 'Expiradas' },
];

export const PropostasPage = () => {
  const { propostas, loading, fetchPropostas, updateProposta } = usePropostas();
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposta, setSelectedProposta] = useState<Proposta | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPropostas();
    setIsRefreshing(false);
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    const { error } = await updateProposta(id, { status: status as Proposta['status'] });
    
    if (error) {
      toast.error('Erro ao atualizar proposta');
      return;
    }

    const statusLabels: Record<string, string> = {
      aceita: 'Proposta aceita!',
      recusada: 'Proposta recusada',
      contra_proposta: 'Marcada como contra-proposta',
    };

    toast.success(statusLabels[status] || 'Proposta atualizada');
    setSelectedProposta(null);
  };

  const filteredPropostas = propostas.filter((proposta) => {
    const matchesFilter = activeFilter === 'todos' || proposta.status === activeFilter;
    const matchesSearch = 
      proposta.lead?.nome?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proposta.imovel?.titulo?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getFilterCount = (filterId: string) => {
    if (filterId === 'todos') return propostas.length;
    return propostas.filter(p => p.status === filterId).length;
  };

  // Calcular totais
  const totalPendentes = propostas.filter(p => p.status === 'pendente').length;
  const totalAceitas = propostas.filter(p => p.status === 'aceita').length;
  const valorTotal = propostas
    .filter(p => p.status === 'aceita')
    .reduce((acc, p) => acc + p.valor_proposta, 0);

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };
  
  return (
    <div className="min-h-screen bg-background content-safe">
      {/* Header */}
      <header className="sticky top-0 z-40 glassmorphism px-4 py-3">
        <PageHeader
          title="Propostas"
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

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-warning/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-warning">{totalPendentes}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </div>
          <div className="bg-success/10 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success">{totalAceitas}</p>
            <p className="text-xs text-muted-foreground">Aceitas</p>
          </div>
          <div className="bg-primary/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-primary">{formatCurrency(valorTotal)}</p>
            <p className="text-xs text-muted-foreground">Total Aceitas</p>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por lead ou imóvel..."
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
      
      {/* Propostas List */}
      <main className="px-4 py-4 transition-all duration-300 ease-out animate-fade-in">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {filteredPropostas.map((proposta) => (
                <SwipeablePropostaCard
                  key={proposta.id}
                  proposta={proposta}
                  onClick={() => setSelectedProposta(proposta)}
                  onAccept={() => handleUpdateStatus(proposta.id, 'aceita')}
                  onReject={() => handleUpdateStatus(proposta.id, 'recusada')}
                />
              ))}
            </div>
            
            {filteredPropostas.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium">Nenhuma proposta encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {propostas.length === 0 
                    ? 'Crie sua primeira proposta clicando no botão +' 
                    : 'Tente ajustar seus filtros'}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Proposta Detail Sheet */}
      <PropostaDetailSheet
        proposta={selectedProposta}
        isOpen={!!selectedProposta}
        onClose={() => setSelectedProposta(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
