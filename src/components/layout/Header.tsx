import { Bell } from 'lucide-react';
import { corretor, getGreeting, getRankingBadge } from '@/data/mockData';
import { toast } from 'sonner';

export const Header = () => {
  const greeting = getGreeting();
  const rankBadge = getRankingBadge(corretor.ranking);

  const handleNotifications = () => {
    toast.info('Central de notificações em breve!');
  };
  
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b border-border/30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-semibold text-primary">
              {corretor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="absolute -bottom-1 -right-1 text-sm">
              {rankBadge}
            </span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{greeting},</p>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              {corretor.nome.split(' ')[0]}!
            </h1>
          </div>
        </div>
        
        <button 
          onClick={handleNotifications}
          className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
        >
          <Bell className="w-5 h-5 text-foreground" />
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-destructive-foreground animate-pulse-badge">
            3
          </span>
        </button>
      </div>
    </header>
  );
};
