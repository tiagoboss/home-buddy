import { Lead } from '@/hooks/useLeads';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export const LeadDetailSheet = ({ lead, isOpen, onClose, onScheduleVisit }: LeadDetailSheetProps) => {
  if (!lead) return null;

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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[80vh] rounded-t-3xl px-4 pb-8 pt-6 overflow-hidden flex flex-col"
        aria-describedby="lead-detail-description"
      >
        <SheetDescription id="lead-detail-description" className="sr-only">
          Detalhes do lead {lead.nome}
        </SheetDescription>
        
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-semibold text-primary flex-shrink-0">
            {lead.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <SheetTitle className="text-lg truncate">{lead.nome}</SheetTitle>
            <span className={cn(
              "inline-block text-xs font-medium px-2.5 py-0.5 rounded-full text-white mt-1",
              status.color
            )}>
              {status.label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pt-4">
          {/* Quick Actions */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="outline"
              className="flex-col h-auto py-3 gap-1.5 text-xs"
              onClick={handleWhatsApp}
              disabled={!lead.telefone}
            >
              <MessageCircle className="w-5 h-5 text-success" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-3 gap-1.5 text-xs"
              onClick={handleCall}
              disabled={!lead.telefone}
            >
              <Phone className="w-5 h-5 text-info" />
              Ligar
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-3 gap-1.5 text-xs"
              onClick={handleEmail}
              disabled={!lead.email}
            >
              <Mail className="w-5 h-5 text-warning" />
              Email
            </Button>
            <Button
              variant="outline"
              className="flex-col h-auto py-3 gap-1.5 text-xs"
              onClick={() => onScheduleVisit?.(lead)}
            >
              <Calendar className="w-5 h-5 text-primary" />
              Agendar
            </Button>
          </div>

          {/* Contact Info */}
          <div className="ios-card p-3 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Contato</h3>
            {lead.telefone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.telefone}</span>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="ios-card p-3 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Preferências</h3>
            {lead.interesse && (
              <div className="text-sm">
                <span className="text-muted-foreground">Interesse: </span>
                <span>{lead.interesse}</span>
              </div>
            )}
            {lead.faixa_preco && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <span>{lead.faixa_preco}</span>
              </div>
            )}
            {lead.bairros && lead.bairros.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {lead.bairros.map((bairro, i) => (
                    <span key={i} className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                      {bairro}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="ios-card p-3 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                Último contato: {format(new Date(lead.ultimo_contato), "dd/MM 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>
                Cadastrado: {format(new Date(lead.created_at), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
