import { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, User, CheckCircle, Loader2, Navigation, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCheckins } from '@/hooks/useCheckins';
import { useCompromissos } from '@/hooks/useCompromissos';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import { z } from 'zod';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CheckinFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const checkinSchema = z.object({
  compromisso_id: z.string().min(1, 'Selecione uma visita'),
  observacoes: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

type FormErrors = {
  compromisso_id?: string;
  observacoes?: string;
  geolocation?: string;
};

export const CheckinForm = ({ isOpen, onClose }: CheckinFormProps) => {
  const { createCheckin } = useCheckins();
  const { compromissos } = useCompromissos();
  const { 
    latitude, 
    longitude, 
    accuracy, 
    loading: geoLoading, 
    error: geoError,
    getCurrentPosition,
    clearLocation,
  } = useGeolocation();
  
  const [formData, setFormData] = useState({
    compromisso_id: '',
    observacoes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Filtrar apenas visitas de hoje ou pendentes
  const visitasDisponiveis = compromissos.filter(c => 
    c.tipo === 'visita' && 
    (c.status === 'pendente' || c.status === 'confirmado') &&
    (isToday(parseISO(c.data)) || parseISO(c.data) <= new Date())
  );

  // Limpar estado ao fechar
  useEffect(() => {
    if (!isOpen) {
      setFormData({ compromisso_id: '', observacoes: '' });
      setErrors({});
      clearLocation();
    }
  }, [isOpen, clearLocation]);

  const validateForm = () => {
    try {
      checkinSchema.parse({
        compromisso_id: formData.compromisso_id,
        observacoes: formData.observacoes || undefined,
      });
      
      if (!latitude || !longitude) {
        setErrors({ geolocation: 'Capture sua localização antes de confirmar' });
        return false;
      }
      
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        err.errors.forEach((error) => {
          const field = error.path[0] as keyof FormErrors;
          newErrors[field] = error.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Corrija os erros no formulário');
      return;
    }

    setLoading(true);

    const selectedVisita = visitasDisponiveis.find(v => v.id === formData.compromisso_id);
    
    const { error } = await createCheckin({
      compromisso_id: formData.compromisso_id,
      latitude: latitude!,
      longitude: longitude!,
      endereco_confirmado: selectedVisita?.endereco || undefined,
      observacoes: formData.observacoes || undefined,
    });

    setLoading(false);

    if (error) {
      toast.error('Erro ao registrar check-in');
      return;
    }

    toast.success('Check-in registrado com sucesso!');
    setFormData({ compromisso_id: '', observacoes: '' });
    clearLocation();
    setErrors({});
    onClose();
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const selectedVisita = visitasDisponiveis.find(v => v.id === formData.compromisso_id);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 animate-slide-up max-h-[85%] overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold">Check-in Visita</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Visita Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Visita *
            </label>
            <Select 
              value={formData.compromisso_id} 
              onValueChange={(value) => handleFieldChange('compromisso_id', value)}
            >
              <SelectTrigger className={cn(errors.compromisso_id && "border-destructive")}>
                <SelectValue placeholder="Selecione uma visita" />
              </SelectTrigger>
              <SelectContent>
                {visitasDisponiveis.length === 0 ? (
                  <div className="py-4 px-2 text-center text-muted-foreground text-sm">
                    Nenhuma visita disponível para check-in
                  </div>
                ) : (
                  visitasDisponiveis.map((visita) => (
                    <SelectItem key={visita.id} value={visita.id}>
                      <div className="flex flex-col">
                        <span>{visita.cliente}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(visita.data), "dd/MM", { locale: ptBR })} às {visita.hora}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.compromisso_id && (
              <p className="text-xs text-destructive">{errors.compromisso_id}</p>
            )}
          </div>

          {/* Detalhes da Visita Selecionada */}
          {selectedVisita && (
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{selectedVisita.cliente}</span>
              </div>
              {selectedVisita.endereco && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedVisita.endereco}</span>
                </div>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{format(parseISO(selectedVisita.data), "dd/MM/yyyy", { locale: ptBR })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedVisita.hora}</span>
                </div>
              </div>
            </div>
          )}

          {/* Geolocalização */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Navigation className="w-4 h-4 text-muted-foreground" />
              Localização *
            </label>
            
            {latitude && longitude ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Localização capturada!</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Lat: {latitude.toFixed(6)}</p>
                  <p>Long: {longitude.toFixed(6)}</p>
                  {accuracy && <p>Precisão: ~{Math.round(accuracy)}m</p>}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={getCurrentPosition}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Atualizar localização
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className={cn(
                "border rounded-xl p-4 text-center",
                errors.geolocation ? "border-destructive bg-destructive/5" : "border-dashed border-muted-foreground/30"
              )}>
                {geoError ? (
                  <div className="text-destructive text-sm mb-3">
                    {geoError}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm mb-3">
                    Capture sua localização para confirmar presença no imóvel
                  </p>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentPosition}
                  disabled={geoLoading}
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Obtendo localização...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Capturar Localização
                    </>
                  )}
                </Button>
              </div>
            )}
            {errors.geolocation && (
              <p className="text-xs text-destructive">{errors.geolocation}</p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Observações
            </label>
            <Textarea
              placeholder="Notas sobre a visita..."
              value={formData.observacoes}
              onChange={(e) => handleFieldChange('observacoes', e.target.value)}
              rows={3}
              className={cn(errors.observacoes && "border-destructive")}
            />
            {errors.observacoes && (
              <p className="text-xs text-destructive">{errors.observacoes}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-medium"
            disabled={loading || !latitude || !longitude}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirmar Check-in
              </>
            )}
          </Button>
        </form>
      </div>
    </>
  );
};
