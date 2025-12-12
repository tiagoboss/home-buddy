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
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      {/* Background Actions */}
      <div className="absolute inset-0 flex">
        {/* Left side - Confirm (shown on right swipe) */}
        <div className={cn(
          "flex-1 flex items-center justify-start pl-6 bg-success transition-opacity duration-200",
          translateX > 40 ? "opacity-100" : "opacity-50"
        )}>
          <Check className="w-6 h-6 text-white" />
        </div>
        {/* Right side - Cancel (shown on left swipe) */}
        <div className={cn(
          "flex-1 flex items-center justify-end pr-6 bg-destructive transition-opacity duration-200",
          translateX < -40 ? "opacity-100" : "opacity-50"
        )}>
          <X className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          "relative bg-card border border-border/50 rounded-2xl p-4 transition-all duration-200 ease-out cursor-pointer",
          isCompleted && "opacity-60",
          isCancelled && "opacity-40"
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => translateX === 0 && onClick()}
      >
        <div className="flex gap-4">
          {/* Icon */}
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
            config.bgColor
          )}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Header: Time + Status */}
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xl font-bold text-foreground tracking-tight",
                isCancelled && "line-through opacity-70"
              )}>
                {compromisso.hora}
              </span>
              <span className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full",
                status.badgeColor
              )}>
                {status.label}
              </span>
            </div>
            
            {/* Type + Client */}
            <p className={cn(
              "text-base font-medium text-foreground leading-tight",
              isCancelled && "line-through opacity-70"
            )}>
              {config.label} - {compromisso.cliente}
            </p>
            
            {/* Property */}
            {compromisso.imovel && (
              <p className="text-sm text-muted-foreground leading-tight">
                {compromisso.imovel}
              </p>
            )}
            
            {/* Address */}
            {compromisso.endereco && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground flex-1 min-w-0">
                  <MapPin className="w-4 h-4 flex-shrink-0 opacity-70" />
                  <span className="truncate">{compromisso.endereco}</span>
                </div>
                <button 
                  onClick={handleNavigate}
                  className="w-9 h-9 rounded-full bg-info/90 hover:bg-info flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
                >
                  <Navigation className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <Check className="w-5 h-5 text-success" />
          </div>
        )}
      </div>
    </div>
  );
};
