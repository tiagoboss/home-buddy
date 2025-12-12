import { useState, useRef, TouchEvent } from 'react';
import { Lead } from '@/hooks/useLeads';
import { MessageCircle, Phone, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SwipeableLeadCardProps {
  lead: Lead;
  onClick: () => void;
  onDelete?: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-info' },
  quente: { label: 'Quente', color: 'bg-destructive' },
  morno: { label: 'Morno', color: 'bg-warning' },
  frio: { label: 'Frio', color: 'bg-muted-foreground' },
  negociacao: { label: 'Negociação', color: 'bg-primary' },
  fechado: { label: 'Fechado', color: 'bg-success' },
  perdido: { label: 'Perdido', color: 'bg-destructive/50' },
};

export const SwipeableLeadCard = ({ lead, onClick, onDelete }: SwipeableLeadCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const currentX = useRef(0);

  const formatPhone = (phone: string | null) => {
    if (!phone) return null;
    return phone.replace(/\D/g, '');
  };

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    // Limit swipe distance
    const limitedDiff = Math.max(-150, Math.min(150, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (translateX > 80) {
      // Swipe right - Call
      const phone = formatPhone(lead.telefone);
      if (phone) {
        window.open(`tel:+55${phone}`);
      }
    } else if (translateX < -80) {
      // Swipe left - WhatsApp
      const phone = formatPhone(lead.telefone);
      if (phone) {
        window.open(`https://wa.me/55${phone}`, '_blank');
      }
    }
    setTranslateX(0);
  };

  const status = statusConfig[lead.status] || statusConfig.novo;
  const timeSince = formatDistanceToNow(new Date(lead.ultimo_contato), { 
    addSuffix: false, 
    locale: ptBR 
  });

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background Actions */}
      <div className="absolute inset-0 flex">
        {/* Left side - Call (shown on right swipe) */}
        <div className={cn(
          "flex-1 flex items-center justify-start pl-4 bg-info transition-opacity",
          translateX > 40 ? "opacity-100" : "opacity-50"
        )}>
          <Phone className="w-6 h-6 text-white" />
        </div>
        {/* Right side - WhatsApp (shown on left swipe) */}
        <div className={cn(
          "flex-1 flex items-center justify-end pr-4 bg-success transition-opacity",
          translateX < -40 ? "opacity-100" : "opacity-50"
        )}>
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Card Content */}
      <div
        className="relative bg-card ios-list-item transition-transform duration-200 ease-out cursor-pointer"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => translateX === 0 && onClick()}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
            {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-base font-medium text-foreground truncate">
                {lead.nome}
              </p>
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full text-white flex-shrink-0",
                status.color
              )}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {lead.interesse || 'Sem interesse definido'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lead.telefone || 'Sem telefone'} • há {timeSince}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
