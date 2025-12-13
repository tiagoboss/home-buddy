import { Bell, UserPlus, Calendar, FileText, Target, Settings, Check, Trash2, X } from 'lucide-react';
import { Notificacao } from '@/types';
import { cn } from '@/lib/utils';
import { useState, useRef, useCallback } from 'react';

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

const DRAG_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;

export const NotificationsSheet = ({
  open,
  onOpenChange,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationsSheetProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const isDragging = useRef(false);

  const unreadCount = notifications.filter(n => !n.lida).length;

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      setDragOffset(0);
      setIsClosing(false);
    }, 200);
  }, [onOpenChange]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY.current;
    
    if (diff > 0) {
      setDragOffset(diff);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const elapsed = Date.now() - dragStartTime.current;
    const velocity = dragOffset / elapsed;

    if (dragOffset > DRAG_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      handleClose();
    } else {
      setDragOffset(0);
    }
  }, [dragOffset, handleClose]);

  if (!open) return null;

  const overlayOpacity = Math.max(0, 0.6 - (dragOffset / 500));

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black z-50 animate-fade-in transition-opacity duration-200"
        style={{ opacity: overlayOpacity }}
        onClick={handleClose}
      />
      
      {/* Bottom Sheet */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl",
          "max-h-[85%] flex flex-col touch-none",
          !isClosing && dragOffset === 0 && "animate-slide-up-sheet",
          isClosing && "transition-transform duration-200 ease-out"
        )}
        style={{ 
          transform: isClosing 
            ? 'translateY(100%)' 
            : `translateY(${dragOffset}px)`,
          transition: dragOffset === 0 && !isClosing ? 'transform 0.2s ease-out' : undefined
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing">
          <div className={cn(
            "w-10 h-1 rounded-full bg-muted-foreground/30 transition-all",
            dragOffset > 0 && "w-12 bg-muted-foreground/50"
          )} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Notificações</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-primary hover:underline"
              >
                Marcar todas
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
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
                      
                      <div className="flex items-center gap-3 mt-2">
                        {!notification.lida && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Check className="w-3 h-3" />
                            Lida
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
        </div>

        {/* Safe area padding */}
        <div className="h-6 flex-shrink-0" />
      </div>
    </>
  );
};
