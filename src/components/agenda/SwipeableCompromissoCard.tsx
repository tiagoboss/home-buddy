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
    <div className="relative overflow-hidden rounded-xl">
      {/* Background Actions */}
      <div className="absolute inset-0 flex">
        {/* Left side - Confirm (shown on right swipe) */}
        <div className={cn(
          "flex-1 flex items-center justify-start pl-4 bg-success transition-opacity",
          translateX > 40 ? "opacity-100" : "opacity-50"
        )}>
          <Check className="w-6 h-6 text-white" />
        </div>
        {/* Right side - Cancel (shown on left swipe) */}
        <div className={cn(
          "flex-1 flex items-center justify-end pr-4 bg-destructive transition-opacity",
          translateX < -40 ? "opacity-100" : "opacity-50"
        )}>
          <X className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card Content */}
      <div
        className={cn(
          "relative bg-card ios-card p-4 transition-transform duration-200 ease-out cursor-pointer min-h-[120px]",
          isCompleted && "opacity-60",
          isCancelled && "opacity-40"
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => translateX === 0 && onClick()}
      >
        <div className="flex items-start gap-3 h-full">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
            config.bgColor
          )}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className={cn(
                "text-lg font-semibold text-foreground",
                isCancelled && "line-through"
              )}>
                {compromisso.hora}
              </span>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                status.badgeColor
              )}>
                {status.label}
              </span>
            </div>
            
            <p className={cn(
              "text-base font-medium text-foreground",
              isCancelled && "line-through"
            )}>
              {config.label} - {compromisso.cliente}
            </p>
            
            <p className="text-sm text-muted-foreground mt-0.5 min-h-[20px]">
              {compromisso.imovel || '—'}
            </p>
            
            <div className="flex items-center gap-2 mt-auto pt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground flex-1 min-w-0">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{compromisso.endereco || 'Sem endereço'}</span>
              </div>
              {compromisso.endereco && (
                <button 
                  onClick={handleNavigate}
                  className="w-8 h-8 rounded-full bg-info flex items-center justify-center animate-scale-press flex-shrink-0"
                >
                  <Navigation className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
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
