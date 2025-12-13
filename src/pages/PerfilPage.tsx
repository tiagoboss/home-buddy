import { 
  ChevronRight, 
  Bell, 
  MessageSquare, 
  Info, 
  LogOut,
  TrendingUp,
  Sun,
  Moon,
  Monitor,
  Star,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { corretor, getRankingBadge, formatCurrency } from '@/data/mockData';
import { PageHeader } from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

interface PerfilPageProps {
  onBack?: () => void;
}

const avaliacoes = [
  {
    id: 1,
    cliente: 'Maria Silva',
    avatar: null,
    nota: 5,
    comentario: 'Excelente atendimento! Muito atencioso e profissional. Encontrou o imóvel perfeito para nossa família.',
    data: 'Há 3 dias',
    tipo: 'Compra'
  },
  {
    id: 2,
    cliente: 'João Santos',
    avatar: null,
    nota: 4,
    comentario: 'Ótimo corretor, ajudou muito na negociação e foi sempre disponível.',
    data: 'Há 1 semana',
    tipo: 'Venda'
  },
  {
    id: 3,
    cliente: 'Ana Oliveira',
    avatar: null,
    nota: 5,
    comentario: 'Super recomendo! Profissional dedicado e conhece muito bem a região.',
    data: 'Há 2 semanas',
    tipo: 'Visita'
  },
  {
    id: 4,
    cliente: 'Carlos Mendes',
    avatar: null,
    nota: 5,
    comentario: 'Atendimento impecável do início ao fim. Muito satisfeito!',
    data: 'Há 3 semanas',
    tipo: 'Compra'
  },
];

const ratingDistribution = [
  { stars: 5, count: 24, percentage: 75 },
  { stars: 4, count: 5, percentage: 16 },
  { stars: 3, count: 2, percentage: 6 },
  { stars: 2, count: 1, percentage: 3 },
  { stars: 1, count: 0, percentage: 0 },
];

const stats = [
  { label: 'Vendas este mês', value: `${corretor.vendas} / ${corretor.meta}`, sub: '80%' },
  { label: 'Comissões', value: formatCurrency(corretor.comissoes), sub: '' },
  { label: 'Taxa de conversão', value: `${corretor.taxaConversao}%`, sub: '' },
  { label: 'Ranking', value: `#${corretor.ranking}`, sub: 'de 12' },
  { label: 'Leads ativos', value: '23', sub: '' },
];

const themeOptions = [
  { value: 'light', icon: Sun, label: 'Claro' },
  { value: 'dark', icon: Moon, label: 'Escuro' },
  { value: 'system', icon: Monitor, label: 'Sistema' },
];

export const PerfilPage = ({ onBack }: PerfilPageProps) => {
  const { theme, setTheme } = useTheme();
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const displayedReviews = showAllReviews ? avaliacoes : avaliacoes.slice(0, 3);
  const averageRating = 4.8;
  const totalReviews = 32;

  return (
    <div className="bg-background pb-4">
      {/* Header */}
      <header className="px-4 pt-4 pb-4">
        <PageHeader title="Meu Perfil" onBack={onBack} />
        <div className="flex flex-col items-center mt-2">
          <div className="relative mb-3">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl font-bold text-primary">
              {corretor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="absolute -bottom-1 right-0 text-2xl">
              {getRankingBadge(corretor.ranking)}
            </span>
          </div>
          
          <h1 className="text-xl font-bold text-foreground">{corretor.nome}</h1>
          <p className="text-sm text-muted-foreground">{corretor.cargo}</p>
          <p className="text-xs text-muted-foreground mt-1">Corretor desde 2020</p>
        </div>
      </header>
      
      {/* Performance */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Minha Performance
        </h2>
        
        <div className="ios-section">
          {stats.map((stat) => (
            <div key={stat.label} className="ios-list-item">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                {stat.sub && (
                  <span className="text-xs text-muted-foreground">({stat.sub})</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Evolution Chart - Last 6 months */}
      <section className="px-4 mb-6">
        <div className="ios-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Evolução - Últimos 6 meses</h3>
          
          {/* Chart */}
          <div className="flex items-end gap-2 h-24 mb-4">
            {[
              { month: 'Jul', vendas: 3, meta: 5 },
              { month: 'Ago', vendas: 4, meta: 5 },
              { month: 'Set', vendas: 3, meta: 5 },
              { month: 'Out', vendas: 5, meta: 5 },
              { month: 'Nov', vendas: 4, meta: 5 },
              { month: 'Dez', vendas: 4, meta: 5 },
            ].map((data, i) => {
              const percentage = (data.vendas / data.meta) * 100;
              const isCurrentMonth = i === 5;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-foreground">{data.vendas}</span>
                  <div className="w-full h-16 bg-muted/50 rounded-lg relative overflow-hidden">
                    <div 
                      className={cn(
                        "absolute bottom-0 w-full rounded-lg transition-all duration-700",
                        percentage >= 100 ? "bg-success" : percentage >= 80 ? "bg-warning" : "bg-primary"
                      )}
                      style={{ 
                        height: `${Math.min(percentage, 100)}%`,
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                    {isCurrentMonth && (
                      <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px]",
                    isCurrentMonth ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}>
                    {data.month}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">23</p>
              <p className="text-[10px] text-muted-foreground">Vendas totais</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-success">R$ 184k</p>
              <p className="text-[10px] text-muted-foreground">Comissões</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">78</p>
              <p className="text-[10px] text-muted-foreground">Leads atendidos</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Client Reviews */}
      <section className="px-4 mb-6">
        <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-warning fill-warning" />
          Avaliações de Clientes
        </h2>
        
        <div className="ios-card p-4 space-y-4">
          {/* Rating Summary */}
          <div className="flex gap-4">
            {/* Average Score */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{averageRating}</span>
              <div className="flex gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-3 h-3",
                      star <= Math.round(averageRating)
                        ? "text-warning fill-warning"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{totalReviews} avaliações</span>
            </div>
            
            {/* Distribution Bars */}
            <div className="flex-1 space-y-1.5">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-4">{rating.stars}</span>
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-warning rounded-full transition-all duration-500"
                      style={{ width: `${rating.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">{rating.count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Divider */}
          <div className="border-t border-border" />
          
          {/* Reviews List */}
          <div className="space-y-3">
            {displayedReviews.map((avaliacao, index) => (
              <div
                key={avaliacao.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                    {avaliacao.cliente.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground truncate">
                        {avaliacao.cliente}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {avaliacao.data}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={cn(
                              "w-3 h-3",
                              star <= avaliacao.nota
                                ? "text-warning fill-warning"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {avaliacao.tipo}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {avaliacao.comentario}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Show More Button */}
          {avaliacoes.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="w-full flex items-center justify-center gap-1 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {showAllReviews ? 'Ver menos' : `Ver todas (${totalReviews})`}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  showAllReviews && "rotate-180"
                )}
              />
            </button>
          )}
        </div>
      </section>
      
      {/* Settings */}
      <section className="px-4 pb-4 space-y-4">
        {/* Notifications */}
        <div className="ios-section">
          <button className="w-full ios-list-item animate-scale-press">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Notificações</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ativadas</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
          <button className="w-full ios-list-item animate-scale-press">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Preferências de contato</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Theme Toggle */}
        <div className="ios-section">
          <div className="ios-list-item flex-col !items-start gap-3">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Tema</span>
            </div>
            <div className="flex gap-2 w-full">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-200",
                    theme === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="ios-section">
          <button className="w-full ios-list-item animate-scale-press">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Sobre o app</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">v1.0.0</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Logout */}
        <div className="ios-section">
          <button className="w-full ios-list-item animate-scale-press text-destructive">
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">Sair</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </section>
    </div>
  );
};
