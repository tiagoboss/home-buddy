import { DollarSign, TrendingUp, Target, Clock, X, Calendar, Users, Home } from 'lucide-react';
import { corretor, leads, compromissos, imoveis } from '@/data/mockData';

type KPIType = 'vendas' | 'conversao' | 'meta' | 'fechamento' | null;

interface KPIDetailSheetProps {
  type: KPIType;
  isOpen: boolean;
  onClose: () => void;
}

const kpiConfig = {
  vendas: {
    icon: DollarSign,
    title: 'Vendas',
    color: 'bg-success',
    description: 'Total de vendas realizadas este mês'
  },
  conversao: {
    icon: TrendingUp,
    title: 'Taxa de Conversão',
    color: 'bg-info',
    description: 'Percentual de leads convertidos em vendas'
  },
  meta: {
    icon: Target,
    title: 'Meta Mensal',
    color: 'bg-warning',
    description: 'Progresso em relação à meta estabelecida'
  },
  fechamento: {
    icon: Clock,
    title: 'Tempo de Fechamento',
    color: 'bg-primary',
    description: 'Tempo médio para concluir uma venda'
  }
};

export const KPIDetailSheet = ({ type, isOpen, onClose }: KPIDetailSheetProps) => {
  if (!type || !isOpen) return null;

  const config = kpiConfig[type];
  const Icon = config.icon;

  const renderContent = () => {
    switch (type) {
      case 'vendas':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="ios-card p-3">
                <p className="text-2xl font-bold text-foreground">{corretor.vendas}</p>
                <p className="text-xs text-muted-foreground">Vendas este mês</p>
              </div>
              <div className="ios-card p-3">
                <p className="text-2xl font-bold text-foreground">R$ {(corretor.comissoes / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Comissões</p>
              </div>
            </div>
            <div className="ios-card p-3">
              <h4 className="text-sm font-semibold mb-2">Últimas Vendas</h4>
              <div className="space-y-2">
                {[
                  { cliente: 'Maria Santos', valor: 450000, data: '10/12' },
                  { cliente: 'Carlos Lima', valor: 380000, data: '05/12' },
                  { cliente: 'Ana Paula', valor: 520000, data: '01/12' },
                ].map((venda, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{venda.cliente}</p>
                      <p className="text-xs text-muted-foreground">{venda.data}</p>
                    </div>
                    <p className="text-sm font-semibold text-success">R$ {(venda.valor / 1000).toFixed(0)}k</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'conversao':
        const totalLeads = leads.length;
        const convertidos = leads.filter(l => l.status === 'fechado').length;
        const emNegociacao = leads.filter(l => l.status === 'negociacao').length;
        const quentes = leads.filter(l => l.status === 'quente').length;
        
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="ios-card p-3 text-center">
                <p className="text-xl font-bold text-foreground">{totalLeads}</p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
              <div className="ios-card p-3 text-center">
                <p className="text-xl font-bold text-success">{convertidos}</p>
                <p className="text-[10px] text-muted-foreground">Fechados</p>
              </div>
              <div className="ios-card p-3 text-center">
                <p className="text-xl font-bold text-warning">{emNegociacao}</p>
                <p className="text-[10px] text-muted-foreground">Negociando</p>
              </div>
            </div>
            <div className="ios-card p-3">
              <h4 className="text-sm font-semibold mb-3">Funil de Conversão</h4>
              <div className="space-y-2">
                {[
                  { label: 'Novos', count: leads.filter(l => l.status === 'novo').length, color: 'bg-info' },
                  { label: 'Quentes', count: quentes, color: 'bg-warning' },
                  { label: 'Negociação', count: emNegociacao, color: 'bg-primary' },
                  { label: 'Fechados', count: convertidos, color: 'bg-success' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-sm flex-1">{item.label}</span>
                    <span className="text-sm font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'meta':
        const progresso = Math.round((corretor.vendas / corretor.meta) * 100);
        const faltam = corretor.meta - corretor.vendas;
        
        return (
          <div className="space-y-4">
            <div className="ios-card p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Progresso</span>
                <span className={`text-2xl font-bold ${progresso >= 100 ? 'text-success' : progresso >= 80 ? 'text-warning' : 'text-destructive'}`}>
                  {progresso}%
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${progresso >= 100 ? 'bg-success' : progresso >= 80 ? 'bg-warning' : 'bg-destructive'}`}
                  style={{ width: `${Math.min(progresso, 100)}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="ios-card p-3">
                <p className="text-2xl font-bold text-foreground">{corretor.vendas}</p>
                <p className="text-xs text-muted-foreground">Realizadas</p>
              </div>
              <div className="ios-card p-3">
                <p className="text-2xl font-bold text-foreground">{corretor.meta}</p>
                <p className="text-xs text-muted-foreground">Meta</p>
              </div>
            </div>
            {faltam > 0 && (
              <div className="ios-card p-3 border-warning/50 bg-warning/5">
                <p className="text-sm text-center">
                  Faltam <span className="font-bold text-warning">{faltam} vendas</span> para bater a meta!
                </p>
              </div>
            )}
          </div>
        );

      case 'fechamento':
        return (
          <div className="space-y-4">
            <div className="ios-card p-4 text-center">
              <p className="text-4xl font-bold text-foreground">{corretor.tempoMedioFechamento}</p>
              <p className="text-sm text-muted-foreground">dias em média</p>
            </div>
            <div className="ios-card p-3">
              <h4 className="text-sm font-semibold mb-3">Tempo por Etapa</h4>
              <div className="space-y-3">
                {[
                  { etapa: 'Primeiro contato → Visita', dias: 3 },
                  { etapa: 'Visita → Proposta', dias: 5 },
                  { etapa: 'Proposta → Fechamento', dias: 7 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.etapa}</span>
                    <span className="text-sm font-semibold">{item.dias}d</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="ios-card p-2 text-center">
                <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{compromissos.length} agendados</p>
              </div>
              <div className="ios-card p-2 text-center">
                <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{leads.length} leads</p>
              </div>
              <div className="ios-card p-2 text-center">
                <Home className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{imoveis.length} imóveis</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl animate-slide-up max-h-[85vh] overflow-hidden">
        <div className="w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto mt-3" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${config.color} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{config.title}</h3>
              <p className="text-xs text-muted-foreground">{config.description}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {renderContent()}
        </div>
      </div>
    </>
  );
};
