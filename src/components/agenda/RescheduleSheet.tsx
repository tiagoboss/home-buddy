import { useState } from 'react';
import { Compromisso } from '@/hooks/useCompromissos';
import { Calendar, Clock, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { TimePicker } from '@/components/ui/TimePicker';

interface RescheduleSheetProps {
  compromisso: Compromisso | null;
  isOpen: boolean;
  onClose: () => void;
  onReschedule: (id: string, newDate: string, newTime: string) => void;
}

export const RescheduleSheet = ({ 
  compromisso, 
  isOpen, 
  onClose, 
  onReschedule 
}: RescheduleSheetProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    compromisso ? new Date(compromisso.data) : undefined
  );
  const [selectedTime, setSelectedTime] = useState(compromisso?.hora || '10:00');
  const [showTimePicker, setShowTimePicker] = useState(false);

  if (!compromisso || !isOpen) return null;

  const handleSave = () => {
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      onReschedule(compromisso.id, dateString, selectedTime);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 z-50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl animate-slide-up-sheet max-h-[85%] flex flex-col">
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">Reagendar Compromisso</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center animate-scale-press"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Current Info */}
          <div className="bg-secondary rounded-xl p-3 mb-4">
            <p className="text-sm text-muted-foreground mb-1">Compromisso atual:</p>
            <p className="font-medium text-foreground">{compromisso.cliente}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(compromisso.data), "d 'de' MMMM", { locale: ptBR })} às {compromisso.hora}
            </p>
          </div>

          {/* Date Picker */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              Nova Data
            </label>
            <div className="bg-secondary rounded-xl p-2">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="pointer-events-auto"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>

          {/* Time Picker */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Clock className="w-4 h-4 text-primary" />
              Novo Horário
            </label>
            
            {showTimePicker ? (
              <TimePicker
                value={selectedTime}
                onChange={(time) => {
                  setSelectedTime(time);
                  setShowTimePicker(false);
                }}
              />
            ) : (
              <button
                onClick={() => setShowTimePicker(true)}
                className="w-full p-4 bg-secondary rounded-xl text-left animate-scale-press"
              >
                <span className="text-lg font-semibold text-foreground">{selectedTime}</span>
              </button>
            )}
          </div>

          {/* Preview */}
          {selectedDate && (
            <div className="bg-primary/10 rounded-xl p-4 mb-4">
              <p className="text-sm text-primary font-medium mb-1">Nova data e hora:</p>
              <p className="text-lg font-bold text-foreground">
                {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              <p className="text-lg font-bold text-primary">{selectedTime}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 p-4 bg-secondary text-foreground rounded-xl font-semibold animate-scale-press"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedDate}
            className={cn(
              "flex-1 p-4 rounded-xl font-semibold animate-scale-press",
              selectedDate 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            )}
          >
            Confirmar
          </button>
        </div>
      </div>
    </>
  );
};
