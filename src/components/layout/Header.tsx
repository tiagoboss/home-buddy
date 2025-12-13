import { Bell } from 'lucide-react';
import { corretor, getGreeting, getRankingBadge, notificacoes as initialNotificacoes } from '@/data/mockData';
import { useState } from 'react';
import { NotificationsSheet } from '@/components/notifications/NotificationsSheet';
import { Notificacao } from '@/types';

export const Header = () => {
  const greeting = getGreeting();
  const rankBadge = getRankingBadge(corretor.ranking);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notificacao[]>(initialNotificacoes);

  const unreadCount = notifications.filter(n => !n.lida).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lida: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <>
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
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-10 h-10 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-destructive-foreground animate-pulse-badge">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <NotificationsSheet
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDelete={handleDelete}
      />
    </>
  );
};
