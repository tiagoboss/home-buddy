import { FileText, Calendar, Camera, ClipboardList, Phone, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type QuickActionType = 'lead' | 'visita' | 'imovel' | 'proposta' | 'ligacao' | 'checkin' | null;

interface QuickActionsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect?: (action: QuickActionType) => void;
}

const actions: { icon: typeof FileText; label: string; color: string; iconColor?: string; action: QuickActionType }[] = [
  { icon: FileText, label: 'Registrar Lead', color: 'bg-info', action: 'lead' },
  { icon: Calendar, label: 'Agendar Visita', color: 'bg-success', action: 'visita' },
  { icon: Camera, label: 'Capturar Imóvel', color: 'bg-warning', action: 'imovel' },
  { icon: ClipboardList, label: 'Nova Proposta', color: 'bg-secondary', iconColor: 'text-muted-foreground', action: 'proposta' },
  { icon: Phone, label: 'Registrar Ligação', color: 'bg-muted', iconColor: 'text-muted-foreground', action: 'ligacao' },
  { icon: MapPin, label: 'Check-in Visita', color: 'bg-destructive', action: 'checkin' },
];

export const QuickActionsSheet = ({ isOpen, onClose, onActionSelect }: QuickActionsSheetProps) => {
  if (!isOpen) return null;

  const handleAction = (action: QuickActionType) => {
    onClose();
    if (onActionSelect) {
      onActionSelect(action);
    }
  };
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up-sheet">
        <div className="bg-card rounded-t-3xl shadow-elevated max-w-lg mx-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4">
            <h2 className="text-lg font-semibold text-foreground">Ação Rápida</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          {/* Actions Grid */}
          <div className="px-5 pb-8 grid grid-cols-3 gap-4">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => handleAction(action.action)}
                className="flex flex-col items-center gap-2 py-4 rounded-xl bg-secondary/50 animate-scale-press hover:bg-secondary transition-colors"
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  action.color
                )}>
                  <action.icon className={cn("w-6 h-6", action.iconColor || "text-white")} />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
          
          {/* Safe area */}
          <div className="h-safe-bottom" />
        </div>
      </div>
    </>
  );
};
