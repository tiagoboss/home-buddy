import { useState, useRef, TouchEvent } from 'react';
import { Compromisso } from '@/hooks/useCompromissos';
import { Home, Phone, Users, Check, X } from 'lucide-react';
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
    const limitedDiff = Math.max(-120, Math.min(120, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (translateX > 80 && onConfirm) {
      onConfirm();
    } else if (translateX < -80 && onCancel) {
      onCancel();
    }
    setTranslateX(0);
  };

  const config = tipoConfig[compromisso.tipo] || tipoConfig.visita;
  const Icon = config.icon;
  
  const status = compromisso.status || 'pendente';
  const isCompleted = status === 'realizado';
  const isCancelled = status === 'cancelado';
  const isConfirmed = status === 'confirmado';
  
  // Only show status badge if NOT pending
  const showStatus = status !== 'pendente';

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Background Actions - Only visible when swiping */}
      <div className={cn(
        "absolute inset-0 flex transition-opacity duration-150 rounded-2xl overflow-hidden",
        translateX === 0 ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className={cn(
          "flex-1 flex items-center justify-start pl-6 bg-success transition-opacity duration-200",
          translateX > 0 ? "opacity-100" : "opacity-0"
        )}>
          <Check className="w-6 h-6 text-white" />
        </div>
        <div className={cn(
          "flex-1 flex items-center justify-end pr-6 bg-destructive transition-opacity duration-200",
          translateX < 0 ? "opacity-100" : "opacity-0"
        )}>
          <X className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card Content - Clean & Compact */}
      <div
        className={cn(
          "relative bg-card border border-border/50 rounded-2xl px-3 py-2.5 transition-all duration-200 ease-out cursor-pointer",
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
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            config.bgColor
          )}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-base font-bold text-foreground",
                isCancelled && "line-through opacity-70"
              )}>
                {compromisso.hora}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className={cn(
                "text-sm text-muted-foreground",
                isCancelled && "line-through opacity-70"
              )}>
                {config.label}
              </span>
            </div>
            <p className={cn(
              "text-sm font-medium text-foreground truncate",
              isCancelled && "line-through opacity-70"
            )}>
              {compromisso.cliente}
            </p>
          </div>
          
          {/* Status Badge - Only when not pending */}
          {showStatus && (
            <span className={cn(
              "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
              isConfirmed && "bg-success/10 text-success",
              isCancelled && "bg-destructive/10 text-destructive",
              isCompleted && "bg-muted text-muted-foreground"
            )}>
              {isConfirmed && 'Confirmado'}
              {isCancelled && 'Cancelado'}
              {isCompleted && 'Realizado'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
