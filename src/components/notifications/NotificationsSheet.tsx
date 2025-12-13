import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, UserPlus, Calendar, FileText, Target, Settings, Check, Trash2 } from 'lucide-react';
import { Notificacao } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NotificationsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notificacao[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (tipo: Notificacao['tipo']) => {
  const icons = {
    lead: UserPlus,
    visita: Calendar,
    proposta: FileText,
    meta: Target,
    sistema: Settings,
  };
  return icons[tipo] || Bell;
};

const getNotificationColor = (tipo: Notificacao['tipo']) => {
  const colors = {
    lead: 'bg-info/20 text-info',
    visita: 'bg-primary/20 text-primary',
    proposta: 'bg-success/20 text-success',
    meta: 'bg-warning/20 text-warning',
    sistema: 'bg-muted text-muted-foreground',
  };
  return colors[tipo] || 'bg-muted text-muted-foreground';
};

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora';
  if (diffMins < 60) return `${diffMins}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
};

export const NotificationsSheet = ({
  open,
  onOpenChange,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsSheetProps) => {
  const unreadCount = notifications.filter(n => !n.lida).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificações
              {unreadCount > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-center">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.tipo);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 p-4 transition-colors",
                      !notification.lida && "bg-primary/5"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
                      getNotificationColor(notification.tipo)
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm",
                          !notification.lida && "font-semibold"
                        )}>
                          {notification.titulo}
                        </p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTimeAgo(notification.data)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.mensagem}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        {!notification.lida && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Check className="w-3 h-3" />
                            Marcar como lida
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(notification.id)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
