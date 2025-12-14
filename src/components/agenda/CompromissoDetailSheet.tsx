import { Compromisso } from '@/hooks/useCompromissos';
import { useHaptic } from '@/hooks/useHaptic';
import { Home, Phone, Users, MapPin, MessageCircle, X, Check, Calendar, Navigation, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useRef, useCallback } from 'react';

interface CompromissoDetailSheetProps {
  compromisso: Compromisso | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onReschedule?: () => void;
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

const DRAG_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;

export const CompromissoDetailSheet = ({ 
  compromisso, 
  isOpen, 
  onClose,
  onConfirm,
  onCancel,
  onComplete,
  onReschedule
}: CompromissoDetailSheetProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const isDragging = useRef(false);
  const haptic = useHaptic();

  const handleConfirmWithHaptic = useCallback(() => {
    haptic.success();
    onConfirm?.();
  }, [haptic, onConfirm]);

  const handleCancelWithHaptic = useCallback(() => {
    haptic.error();
    onCancel?.();
  }, [haptic, onCancel]);

  const handleCompleteWithHaptic = useCallback(() => {
    haptic.success();
    onComplete?.();
  }, [haptic, onComplete]);

  const handleRescheduleWithHaptic = useCallback(() => {
    haptic.medium();
    onReschedule?.();
  }, [haptic, onReschedule]);

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
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setDragOffset(0);
        setIsClosing(false);
      }, 200);
    } else {
      setDragOffset(0);
    }
  }, [dragOffset, onClose]);

  if (!compromisso || !isOpen) return null;

  const config = tipoConfig[compromisso.tipo] || tipoConfig.visita;
  const status = statusConfig[compromisso.status || 'pendente'];
  const Icon = config.icon;

  const formattedDate = format(new Date(compromisso.data), "EEEE, d 'de' MMMM", { locale: ptBR });
  const overlayOpacity = Math.max(0, 0.6 - (dragOffset / 500));

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    return phone.replace(/\D/g, '');
  };

  const leadPhone = compromisso.lead?.telefone;
  const formattedPhone = formatPhone(leadPhone);

  const handleCall = () => {
    if (formattedPhone) {
      window.open(`tel:+55${formattedPhone}`);
    }
  };

  const handleWhatsApp = () => {
    if (formattedPhone) {
      window.open(`https://wa.me/55${formattedPhone}`, '_blank');
    }
  };

  const handleNavigate = () => {
    if (compromisso.endereco) {
      const encodedAddress = encodeURIComponent(compromisso.endereco);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const canReschedule = compromisso.status !== 'realizado' && compromisso.status !== 'cancelado';

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black z-50 animate-fade-in transition-opacity duration-200"
        style={{ opacity: overlayOpacity }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl",
          "touch-none",
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

        {/* Content */}
        <div className="px-4 pb-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              config.bgColor
            )}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-foreground">
                  {config.label}
                </h2>
                <span className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  status.badgeColor
                )}>
                  {status.label}
                </span>
              </div>
              <p className="text-base text-muted-foreground">
                {compromisso.cliente}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
                <p className="text-lg font-semibold text-foreground">{compromisso.hora}</p>
              </div>
            </div>

            {compromisso.imovel && (
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
                <Home className="w-5 h-5 text-muted-foreground" />
                <p className="text-base text-foreground">{compromisso.imovel}</p>
              </div>
            )}

            {compromisso.endereco && (
              <button 
                onClick={handleNavigate}
                className="w-full flex items-center gap-3 p-3 bg-secondary rounded-xl animate-scale-press"
              >
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <p className="text-base text-foreground flex-1 text-left">{compromisso.endereco}</p>
                <Navigation className="w-5 h-5 text-info" />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          {formattedPhone ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={handleCall}
                className="flex items-center justify-center gap-2 p-4 bg-info/10 rounded-xl animate-scale-press"
              >
                <Phone className="w-5 h-5 text-info" />
                <span className="font-medium text-info">Ligar</span>
              </button>
              <button 
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 p-4 bg-success/10 rounded-xl animate-scale-press"
              >
              <MessageCircle className="w-5 h-5 text-success" />
              <span className="font-medium text-success">WhatsApp</span>
            </button>
          </div>
          ) : (
            <div className="p-4 bg-muted/50 rounded-xl mb-6 text-center">
              <p className="text-sm text-muted-foreground">
                Sem telefone do lead vinculado
              </p>
            </div>
          )}

          {/* Reschedule Button */}
          {canReschedule && onReschedule && (
            <button 
              onClick={handleRescheduleWithHaptic}
              className="w-full flex items-center justify-center gap-2 p-4 bg-secondary text-foreground rounded-xl animate-scale-press mb-4 active:scale-95 transition-transform"
            >
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Reagendar</span>
            </button>
          )}

          {/* Status Actions */}
          {compromisso.status !== 'realizado' && compromisso.status !== 'cancelado' && (
            <div className="space-y-3">
              {compromisso.status === 'pendente' && onConfirm && (
                <button 
                  onClick={handleConfirmWithHaptic}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-success text-white rounded-xl animate-scale-press active:scale-95 transition-transform"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Confirmar Compromisso</span>
                </button>
              )}
              
              {compromisso.status === 'confirmado' && onComplete && (
                <button 
                  onClick={handleCompleteWithHaptic}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-success text-white rounded-xl animate-scale-press active:scale-95 transition-transform"
                >
                  <Check className="w-5 h-5" />
                  <span className="font-semibold">Marcar como Realizado</span>
                </button>
              )}

              {onCancel && (
                <button 
                  onClick={handleCancelWithHaptic}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-xl animate-scale-press active:scale-95 transition-transform"
                >
                  <X className="w-5 h-5" />
                  <span className="font-semibold">Cancelar Compromisso</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
