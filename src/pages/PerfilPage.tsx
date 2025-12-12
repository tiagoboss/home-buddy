import { 
  ChevronRight, 
  Bell, 
  MessageSquare, 
  Palette, 
  Info, 
  LogOut,
  TrendingUp,
  DollarSign,
  Target,
  Trophy,
  Users
} from 'lucide-react';
import { corretor, getRankingBadge, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Vendas este mês', value: `${corretor.vendas} / ${corretor.meta}`, sub: '80%' },
  { label: 'Comissões', value: formatCurrency(corretor.comissoes), sub: '' },
  { label: 'Taxa de conversão', value: `${corretor.taxaConversao}%`, sub: '' },
  { label: 'Ranking', value: `#${corretor.ranking}`, sub: 'de 12' },
  { label: 'Leads ativos', value: '23', sub: '' },
];

const settingsGroups = [
  {
    items: [
      { icon: Bell, label: 'Notificações', value: 'Ativadas' },
      { icon: MessageSquare, label: 'Preferências de contato', value: '' },
    ],
  },
  {
    items: [
      { icon: Palette, label: 'Tema', value: 'Sistema' },
      { icon: Info, label: 'Sobre o app', value: 'v1.0.0' },
    ],
  },
  {
    items: [
      { icon: LogOut, label: 'Sair', value: '', destructive: true },
    ],
  },
];

export const PerfilPage = () => {
  return (
    <div className="min-h-screen bg-background content-safe">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <div className="flex flex-col items-center">
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
          {stats.map((stat, index) => (
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
      
      {/* Mini Chart Placeholder */}
      <section className="px-4 mb-6">
        <div className="ios-card p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Evolução - Últimos 6 meses</h3>
          <div className="flex items-end gap-2 h-20">
            {[40, 65, 55, 80, 70, 90].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full bg-primary/20 rounded-t-sm transition-all duration-500"
                  style={{ 
                    height: `${height}%`,
                    animationDelay: `${i * 100}ms`
                  }}
                >
                  <div 
                    className="w-full bg-primary rounded-t-sm transition-all duration-700"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Settings */}
      <section className="px-4 space-y-4">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="ios-section">
            {group.items.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "w-full ios-list-item animate-scale-press",
                  item.destructive && "text-destructive"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn(
                    "w-5 h-5",
                    item.destructive ? "text-destructive" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    item.destructive ? "text-destructive" : "text-foreground"
                  )}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value && (
                    <span className="text-sm text-muted-foreground">{item.value}</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};
