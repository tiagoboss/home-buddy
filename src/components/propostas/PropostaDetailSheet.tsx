import { X, FileText, User, Home, DollarSign, Calendar, Clock, MessageSquare, Check, XCircle, RefreshCw } from 'lucide-react';
import { Proposta } from '@/hooks/usePropostas';
import { Button } from '@/components/ui/button';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useState, useRef, TouchEvent } from 'react';

interface PropostaDetailSheetProps {
  proposta: Proposta | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  pendente: { label: 'Pendente', color: 'text-warning', bgColor: 'bg-warning/10' },
  aceita: { label: 'Aceita', color: 'text-success', bgColor: 'bg-success/10' },
  recusada: { label: 'Recusada', color: 'text-destructive', bgColor: 'bg-destructive/10' },
  contra_proposta: { label: 'Contra-proposta', color: 'text-info', bgColor: 'bg-info/10' },
  expirada: { label: 'Expirada', color: 'text-muted-foreground', bgColor: 'bg-muted' },
};

export const PropostaDetailSheet = ({ proposta, isOpen, onClose, onUpdateStatus }: PropostaDetailSheetProps) => {
  const [translateY, setTranslateY] = useState(0);
  const startY = useRef(0);
  const DRAG_THRESHOLD = 100;

  const handleTouchStart = (e: TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const diff = e.touches[0].clientY - startY.current;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > DRAG_THRESHOLD) {
      onClose();
    }
    setTranslateY(0);
  };

  if (!isOpen || !proposta) return null;

  const status = statusConfig[proposta.status] || statusConfig.pendente;
  const isPending = proposta.status === 'pendente';

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        style={{ opacity: Math.max(0.6 - translateY / 500, 0) }}
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 animate-slide-up max-h-[85%] overflow-hidden flex flex-col"
        style={{ transform: `translateY(${translateY}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", status.bgColor)}>
              <FileText className={cn("w-6 h-6", status.color)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Proposta</h2>
              <span className={cn("text-sm font-medium", status.color)}>{status.label}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Valor */}
          <div className="text-center py-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl">
            <p className="text-sm text-muted-foreground mb-1">Valor da Proposta</p>
            <p className="text-3xl font-bold text-foreground">{formatCurrency(proposta.valor_proposta)}</p>
          </div>

          {/* Lead Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" />
              Lead
            </h3>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="font-medium text-foreground">{proposta.lead?.nome || 'Não encontrado'}</p>
              {proposta.lead?.telefone && (
                <p className="text-sm text-muted-foreground">{proposta.lead.telefone}</p>
              )}
            </div>
          </div>

          {/* Imóvel Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Home className="w-4 h-4" />
              Imóvel
            </h3>
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="font-medium text-foreground">{proposta.imovel?.titulo || 'Não encontrado'}</p>
              {proposta.imovel?.bairro && (
                <p className="text-sm text-muted-foreground">{proposta.imovel.bairro}</p>
              )}
              {proposta.imovel?.preco && (
                <p className="text-sm text-primary font-medium mt-1">
                  Preço: {formatCurrency(proposta.imovel.preco)}
                </p>
              )}
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Criada há</span>
              </div>
              <p className="font-medium text-foreground">
                {formatDistanceToNow(new Date(proposta.created_at), { locale: ptBR })}
              </p>
            </div>
            {proposta.validade && (
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Válida até</span>
                </div>
                <p className="font-medium text-foreground">
                  {format(parseISO(proposta.validade), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
            )}
          </div>

          {/* Observações */}
          {proposta.observacoes && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Observações
              </h3>
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm text-foreground whitespace-pre-wrap">{proposta.observacoes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          {isPending && (
            <div className="space-y-3 pt-4">
              <Button
                className="w-full h-12 bg-success hover:bg-success/90"
                onClick={() => onUpdateStatus(proposta.id, 'aceita')}
              >
                <Check className="w-5 h-5 mr-2" />
                Aceitar Proposta
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => onUpdateStatus(proposta.id, 'contra_proposta')}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Contra-proposta
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onUpdateStatus(proposta.id, 'recusada')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Recusar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
