import { useState, useEffect } from 'react';
import { X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/TimePicker';
import { useCompromissos } from '@/hooks/useCompromissos';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VisitaFormProps {
  isOpen: boolean;
  onClose: () => void;
  prefillData?: {
    imovel?: string;
    endereco?: string;
  };
}

// Validation schema
const visitaSchema = z.object({
  tipo: z.enum(['visita', 'reuniao', 'ligacao']),
  hora: z.string().min(1, 'Horário é obrigatório').regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido'),
  cliente: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  telefone: z.string().optional().refine(
    (val) => !val || val.replace(/\D/g, '').length >= 10,
    'Telefone deve ter pelo menos 10 dígitos'
  ),
  imovel: z.string().max(200, 'Descrição muito longa').optional(),
  endereco: z.string().max(300, 'Endereço muito longo').optional(),
  lead_id: z.string().optional(),
});

// Phone mask function
const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length <= 2) {
    return digits.length > 0 ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const VisitaForm = ({ isOpen, onClose, prefillData }: VisitaFormProps) => {
  const { createCompromisso } = useCompromissos();
  const { leads } = useLeads();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    tipo: 'visita' as 'visita' | 'reuniao' | 'ligacao',
    hora: '',
    cliente: '',
    telefone: '',
    imovel: prefillData?.imovel || '',
    endereco: prefillData?.endereco || '',
    lead_id: '',
  });

  // Update form when prefillData changes
  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({
        ...prev,
        imovel: prefillData.imovel || prev.imovel,
        endereco: prefillData.endereco || prev.endereco,
      }));
    }
  }, [prefillData]);

  // Clear error when field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    handleFieldChange('telefone', formatted);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Date validation
    if (!date) {
      newErrors.date = 'Data é obrigatória';
    }

    // Schema validation
    const result = visitaSchema.safeParse(formData);
    if (!result.success) {
      result.error.errors.forEach(err => {
        const field = err.path[0] as string;
        newErrors[field] = err.message;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Corrija os erros no formulário');
      return;
    }

    setLoading(true);
    try {
      const { error } = await createCompromisso({
        tipo: formData.tipo,
        data: format(date!, 'yyyy-MM-dd'),
        hora: formData.hora,
        cliente: formData.cliente.trim(),
        imovel: formData.imovel || null,
        endereco: formData.endereco || null,
        status: 'pendente',
        lead_id: formData.lead_id || null,
        lead: null,
      });

      if (error) throw error;
      
      toast.success('Visita agendada com sucesso!');
      setFormData({ tipo: 'visita', hora: '', cliente: '', telefone: '', imovel: '', endereco: '', lead_id: '' });
      setDate(undefined);
      setErrors({});
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao agendar visita');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ tipo: 'visita', hora: '', cliente: '', telefone: '', imovel: '', endereco: '', lead_id: '' });
    setDate(undefined);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={resetForm}
      />
      
      <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up-sheet">
        <div className="bg-card rounded-t-3xl shadow-elevated max-w-lg mx-auto max-h-[85vh] overflow-y-auto">
          <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-card">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          
          <div className="flex items-center justify-between px-5 pb-4 sticky top-5 bg-card">
            <h2 className="text-lg font-semibold text-foreground">Agendar Visita</h2>
            <button 
              onClick={resetForm}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value: any) => handleFieldChange('tipo', value)}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visita">Visita</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="ligacao">Ligação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-12 rounded-xl justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      errors.date && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      setDate(newDate);
                      if (errors.date) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.date;
                          return newErrors;
                        });
                      }
                    }}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label>Hora *</Label>
              <TimePicker
                value={formData.hora}
                onChange={(value) => handleFieldChange('hora', value)}
                placeholder="Selecione o horário"
                hasError={!!errors.hora}
              />
              {errors.hora && <p className="text-xs text-destructive">{errors.hora}</p>}
            </div>

            {leads.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="lead">Lead (opcional)</Label>
                <Select 
                  value={formData.lead_id} 
                  onValueChange={(value) => {
                    const lead = leads.find(l => l.id === value);
                    setFormData(prev => ({ 
                      ...prev, 
                      lead_id: value,
                      cliente: lead ? lead.nome : prev.cliente,
                      telefone: lead?.telefone ? formatPhone(lead.telefone) : prev.telefone
                    }));
                    // Clear related errors
                    setErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.cliente;
                      delete newErrors.telefone;
                      return newErrors;
                    });
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Selecionar lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="cliente">Nome do Cliente *</Label>
              <Input
                id="cliente"
                placeholder="Nome do cliente"
                value={formData.cliente}
                onChange={(e) => handleFieldChange('cliente', e.target.value)}
                className={cn("h-12 rounded-xl", errors.cliente && "border-destructive")}
                maxLength={100}
              />
              {errors.cliente && <p className="text-xs text-destructive">{errors.cliente}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone do Cliente</Label>
              <Input
                id="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={cn("h-12 rounded-xl", errors.telefone && "border-destructive")}
              />
              {errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imovel">Imóvel</Label>
              <Input
                id="imovel"
                placeholder="Descrição do imóvel"
                value={formData.imovel}
                onChange={(e) => handleFieldChange('imovel', e.target.value)}
                className={cn("h-12 rounded-xl", errors.imovel && "border-destructive")}
                maxLength={200}
              />
              {errors.imovel && <p className="text-xs text-destructive">{errors.imovel}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Endereço da visita"
                value={formData.endereco}
                onChange={(e) => handleFieldChange('endereco', e.target.value)}
                className={cn("h-12 rounded-xl", errors.endereco && "border-destructive")}
                maxLength={300}
              />
              {errors.endereco && <p className="text-xs text-destructive">{errors.endereco}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl mt-6"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Agendar'}
            </Button>
          </form>
          
          <div className="h-safe-bottom" />
        </div>
      </div>
    </>
  );
};
