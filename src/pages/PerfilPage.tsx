import { 
  ChevronRight, 
  Bell, 
  MessageSquare, 
  Info, 
  LogOut,
  TrendingUp,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { corretor, getRankingBadge, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

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

export const PerfilPage = () => {
  const { theme, setTheme } = useTheme();

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
      
      {/* Settings */}
      <section className="px-4 space-y-4">
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
