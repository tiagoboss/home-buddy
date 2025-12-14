import { useState, useRef, TouchEvent } from 'react';
import { Compromisso } from '@/hooks/useCompromissos';
import { Home, Phone, Users, MapPin, Check, X, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwipeableCompromissoCardProps {
  compromisso: Compromisso;
  onClick: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const tipoConfig: Record<string, { icon: typeof Home; color: string; bgColor: string; label: string }> = {
  visita: { icon: Home, color: 'text-success', bgColor: 'bg-success', label: 'Visita' },
  ligacao: { icon: Phone, color: 'text-info', bgColor: 'bg-info', label: 'Ligação' },
  reuniao: { icon: Users, color: 'text-warning', bgColor: 'bg-warning', label: 'Reunião' },
};

const statusConfig: Record<string, { label: string; badgeColor: string }> = {
  pendente: { label: 'Pendente', badgeColor: 'bg-warning/10 text-warning' },
  confirmado: { label: 'Confirmado', badgeColor: 'bg-success/10 text-success' },
  cancelado: { label: 'Cancelado', badgeColor: 'bg-destructive/10 text-destructive' },
  realizado: { label: 'Realizado', badgeColor: 'bg-muted text-muted-foreground' },
};

export const SwipeableCompromissoCard = ({ 
  compromisso, 
  onClick, 
  onConfirm, 
  onCancel 
}: SwipeableCompromissoCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const diff = e.touches[0].clientX - startX.current;
    // Limit swipe distance
    const limitedDiff = Math.max(-120, Math.min(120, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (translateX > 80 && onConfirm) {
      // Swipe right - Confirm/Complete
      onConfirm();
    } else if (translateX < -80 && onCancel) {
      // Swipe left - Cancel
      onCancel();
    }
    setTranslateX(0);
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (compromisso.endereco) {
      const encodedAddress = encodeURIComponent(compromisso.endereco);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const config = tipoConfig[compromisso.tipo] || tipoConfig.visita;
  const status = statusConfig[compromisso.status || 'pendente'];
  const Icon = config.icon;
  
  const isCompleted = compromisso.status === 'realizado';
  const isCancelled = compromisso.status === 'cancelado';

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Actions - Only visible when swiping */}
      <div className={cn(
        "absolute inset-0 flex transition-opacity duration-150",
        translateX === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        {/* Left action (swipe right to confirm) */}
        <div className={cn(
          "flex-1 flex items-center justify-start pl-6 bg-success transition-opacity duration-200",
          translateX > 0 ? "opacity-100" : "opacity-0"
        )}>
          <Check className="w-6 h-6 text-white" />
        </div>
        {/* Right action (swipe left to cancel) */}
        <div className={cn(
          "flex-1 flex items-center justify-end pr-6 bg-destructive transition-opacity duration-200",
          translateX < 0 ? "opacity-100" : "opacity-0"
        )}>
          <X className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card Content - Compact */}
      <div
        className={cn(
          "relative bg-card border border-border/50 rounded-2xl px-4 py-3 transition-all duration-200 ease-out cursor-pointer",
          isCompleted && "opacity-60",
          isCancelled && "opacity-40"
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => translateX === 0 && onClick()}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
            config.bgColor
          )}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-lg font-bold text-foreground",
                isCancelled && "line-through opacity-70"
              )}>
                {compromisso.hora}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className={cn(
                "text-sm font-medium text-muted-foreground truncate",
                isCancelled && "line-through opacity-70"
              )}>
                {config.label}
              </span>
            </div>
            <p className={cn(
              "text-base font-medium text-foreground truncate",
              isCancelled && "line-through opacity-70"
            )}>
              {compromisso.cliente}
            </p>
          </div>
          
          {/* Status Badge */}
          <span className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0",
            status.badgeColor
          )}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
};
