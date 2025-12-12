import { Lead } from '@/hooks/useLeads';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail, Calendar, MapPin, DollarSign, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState, useRef, useCallback } from 'react';

interface LeadDetailSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onScheduleVisit?: (lead: Lead) => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-info' },
  quente: { label: 'Quente', color: 'bg-destructive' },
  morno: { label: 'Morno', color: 'bg-warning' },
  frio: { label: 'Frio', color: 'bg-muted-foreground' },
  negociacao: { label: 'Em Negociação', color: 'bg-primary' },
  fechado: { label: 'Fechado', color: 'bg-success' },
  perdido: { label: 'Perdido', color: 'bg-destructive/50' },
};

const DRAG_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 0.5;

export const LeadDetailSheet = ({ lead, isOpen, onClose, onScheduleVisit }: LeadDetailSheetProps) => {
  const [dragOffset, setDragOffset] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const dragStartY = useRef(0);
  const dragStartTime = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
    dragStartTime.current = Date.now();
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStartY.current;
    
    // Only allow dragging down
    if (diff > 0) {
      setDragOffset(diff);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const elapsed = Date.now() - dragStartTime.current;
    const velocity = dragOffset / elapsed;

    // Close if dragged past threshold or fast swipe
    if (dragOffset > DRAG_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
        setDragOffset(0);
        setIsClosing(false);
      }, 200);
    } else {
      // Animate back to original position
      setDragOffset(0);
    }
  }, [dragOffset, onClose]);

  if (!lead || !isOpen) return null;

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    return phone.replace(/\D/g, '');
  };

  const handleWhatsApp = () => {
    const phone = formatPhone(lead.telefone);
    if (phone) {
      window.open(`https://wa.me/55${phone}`, '_blank');
    }
  };

  const handleCall = () => {
    const phone = formatPhone(lead.telefone);
    if (phone) {
      window.open(`tel:+55${phone}`);
    }
  };

  const handleEmail = () => {
    if (lead.email) {
      window.open(`mailto:${lead.email}`);
    }
  };

  const status = statusConfig[lead.status] || statusConfig.novo;

  // Calculate overlay opacity based on drag
  const overlayOpacity = Math.max(0, 0.6 - (dragOffset / 500));

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black z-50 animate-fade-in transition-opacity duration-200"
        style={{ opacity: overlayOpacity }}
        onClick={onClose}
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
        <div className="flex items-center gap-3 px-4 pb-3 border-b border-border flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-base font-semibold text-primary flex-shrink-0">
            {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">{lead.nome}</h2>
            <span className={cn(
              "inline-block text-[10px] font-medium px-2 py-0.5 rounded-full text-white",
              status.color
            )}>
              {status.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2.5 gap-1 text-[10px]"
              onClick={handleWhatsApp}
              disabled={!lead.telefone}
            >
              <MessageCircle className="w-4 h-4 text-success" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2.5 gap-1 text-[10px]"
              onClick={handleCall}
              disabled={!lead.telefone}
            >
              <Phone className="w-4 h-4 text-info" />
              Ligar
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2.5 gap-1 text-[10px]"
              onClick={handleEmail}
              disabled={!lead.email}
            >
              <Mail className="w-4 h-4 text-warning" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-col h-auto py-2.5 gap-1 text-[10px]"
              onClick={() => onScheduleVisit?.(lead)}
            >
              <Calendar className="w-4 h-4 text-primary" />
              Agendar
            </Button>
          </div>

          {/* Contact Info */}
          <div className="ios-card p-3 space-y-2">
            <h3 className="text-xs font-semibold text-foreground">Contato</h3>
            {lead.telefone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.telefone}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
          </div>

          {/* Preferences */}
          {(lead.interesse || lead.faixa_preco || (lead.bairros && lead.bairros.length > 0)) && (
            <div className="ios-card p-3 space-y-2">
              <h3 className="text-xs font-semibold text-foreground">Preferências</h3>
              {lead.interesse && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Interesse: </span>
                  <span>{lead.interesse}</span>
                </div>
              )}
              {lead.faixa_preco && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <span>{lead.faixa_preco}</span>
                </div>
              )}
              {lead.bairros && lead.bairros.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex flex-wrap gap-1">
                    {lead.bairros.map((bairro, i) => (
                      <span key={i} className="px-2 py-0.5 bg-secondary rounded-full text-[10px]">
                        {bairro}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline */}
          <div className="ios-card p-3 space-y-2">
            <h3 className="text-xs font-semibold text-foreground">Histórico</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Último contato: {format(new Date(lead.ultimo_contato), "dd/MM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                Cadastrado: {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>

        {/* Safe area padding */}
        <div className="h-6 flex-shrink-0" />
      </div>
    </>
  );
};
