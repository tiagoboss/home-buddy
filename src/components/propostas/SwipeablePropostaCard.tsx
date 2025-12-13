import { useState, useRef, TouchEvent } from 'react';
import { Proposta } from '@/hooks/usePropostas';
import { Check, X, MessageSquare, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SwipeablePropostaCardProps {
  proposta: Proposta;
  onClick: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: 'Pendente', color: 'bg-warning' },
  aceita: { label: 'Aceita', color: 'bg-success' },
  recusada: { label: 'Recusada', color: 'bg-destructive' },
  contra_proposta: { label: 'Contra-proposta', color: 'bg-info' },
  expirada: { label: 'Expirada', color: 'bg-muted-foreground' },
};

export const SwipeablePropostaCard = ({ proposta, onClick, onAccept, onReject }: SwipeablePropostaCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    const limitedDiff = Math.max(-150, Math.min(150, diff));
    setTranslateX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (translateX > 80 && proposta.status === 'pendente') {
      onAccept?.();
    } else if (translateX < -80 && proposta.status === 'pendente') {
      onReject?.();
    }
    setTranslateX(0);
  };

  const status = statusConfig[proposta.status] || statusConfig.pendente;
  const timeSince = formatDistanceToNow(new Date(proposta.created_at), { 
    addSuffix: false, 
    locale: ptBR 
  });

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const isPending = proposta.status === 'pendente';

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background Actions */}
      {isPending && (
        <div className="absolute inset-0 flex">
          {/* Left side - Accept (shown on right swipe) */}
          <div className={cn(
            "flex-1 flex items-center justify-start pl-4 bg-success transition-opacity",
            translateX > 40 ? "opacity-100" : "opacity-50"
          )}>
            <Check className="w-6 h-6 text-white" />
          </div>
          {/* Right side - Reject (shown on left swipe) */}
          <div className={cn(
            "flex-1 flex items-center justify-end pr-4 bg-destructive transition-opacity",
            translateX < -40 ? "opacity-100" : "opacity-50"
          )}>
            <X className="w-6 h-6 text-white" />
          </div>
        </div>
      )}

      {/* Card Content */}
      <div
        className={cn(
          "relative bg-card ios-list-item transition-transform duration-200 ease-out cursor-pointer",
          !isPending && "pointer-events-auto"
        )}
        style={{ transform: isPending ? `translateX(${translateX}px)` : undefined }}
        onTouchStart={isPending ? handleTouchStart : undefined}
        onTouchMove={isPending ? handleTouchMove : undefined}
        onTouchEnd={isPending ? handleTouchEnd : undefined}
        onClick={() => translateX === 0 && onClick()}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-semibold text-primary flex-shrink-0">
            R$
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-base font-semibold text-foreground">
                {formatCurrency(proposta.valor_proposta)}
              </p>
              <span className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full text-white flex-shrink-0",
                status.color
              )}>
                {status.label}
              </span>
            </div>
            
            <p className="text-sm text-foreground truncate">
              {proposta.lead?.nome || 'Lead não encontrado'}
            </p>
            
            <p className="text-xs text-muted-foreground truncate">
              {proposta.imovel?.titulo || 'Imóvel não encontrado'}
            </p>
            
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <span>há {timeSince}</span>
              {proposta.validade && (
                <>
                  <span>•</span>
                  <span>Válida até {format(parseISO(proposta.validade), "dd/MM", { locale: ptBR })}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
