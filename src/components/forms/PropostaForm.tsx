import { useState } from 'react';
import { X, FileText, User, Home, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePropostas } from '@/hooks/usePropostas';
import { useLeads } from '@/hooks/useLeads';
import { useImoveis } from '@/hooks/useImoveis';
import { toast } from 'sonner';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface PropostaFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const propostaSchema = z.object({
  lead_id: z.string().min(1, 'Selecione um lead'),
  imovel_id: z.string().min(1, 'Selecione um imóvel'),
  valor_proposta: z.number().positive('Valor deve ser maior que zero'),
  observacoes: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  validade: z.date().optional(),
});

type FormErrors = {
  lead_id?: string;
  imovel_id?: string;
  valor_proposta?: string;
  observacoes?: string;
  validade?: string;
};

export const PropostaForm = ({ isOpen, onClose }: PropostaFormProps) => {
  const { createProposta } = usePropostas();
  const { leads } = useLeads();
  const { imoveis } = useImoveis();
  
  const [formData, setFormData] = useState({
    lead_id: '',
    imovel_id: '',
    valor_proposta: '',
    observacoes: '',
  });
  const [validade, setValidade] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const amount = parseInt(numbers || '0', 10) / 100;
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const parseCurrency = (value: string): number => {
    const numbers = value.replace(/\D/g, '');
    return parseInt(numbers || '0', 10) / 100;
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({ ...prev, valor_proposta: formatted }));
    if (errors.valor_proposta) {
      setErrors(prev => ({ ...prev, valor_proposta: undefined }));
    }
  };

  const validateForm = () => {
    try {
      propostaSchema.parse({
        lead_id: formData.lead_id,
        imovel_id: formData.imovel_id,
        valor_proposta: parseCurrency(formData.valor_proposta),
        observacoes: formData.observacoes || undefined,
        validade: validade,
      });
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
    
    const { error } = await createProposta({
      lead_id: formData.lead_id,
      imovel_id: formData.imovel_id,
      valor_proposta: parseCurrency(formData.valor_proposta),
      observacoes: formData.observacoes || undefined,
      validade: validade ? format(validade, 'yyyy-MM-dd') : undefined,
    });

    setLoading(false);

    if (error) {
      toast.error('Erro ao criar proposta');
      return;
    }

    toast.success('Proposta criada com sucesso!');
    setFormData({ lead_id: '', imovel_id: '', valor_proposta: '', observacoes: '' });
    setValidade(undefined);
    setErrors({});
    onClose();
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold">Nova Proposta</h2>
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
          {/* Lead Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Lead *
            </label>
            <Select 
              value={formData.lead_id} 
              onValueChange={(value) => handleFieldChange('lead_id', value)}
            >
              <SelectTrigger className={cn(errors.lead_id && "border-destructive")}>
                <SelectValue placeholder="Selecione um lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.lead_id && (
              <p className="text-xs text-destructive">{errors.lead_id}</p>
            )}
          </div>

          {/* Imóvel Select */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Home className="w-4 h-4 text-muted-foreground" />
              Imóvel *
            </label>
            <Select 
              value={formData.imovel_id} 
              onValueChange={(value) => handleFieldChange('imovel_id', value)}
            >
              <SelectTrigger className={cn(errors.imovel_id && "border-destructive")}>
                <SelectValue placeholder="Selecione um imóvel" />
              </SelectTrigger>
              <SelectContent>
                {imoveis.map((imovel) => (
                  <SelectItem key={imovel.id} value={imovel.id}>
                    {imovel.titulo} - {imovel.bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.imovel_id && (
              <p className="text-xs text-destructive">{errors.imovel_id}</p>
            )}
          </div>

          {/* Valor da Proposta */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Valor da Proposta *
            </label>
            <Input
              type="text"
              inputMode="numeric"
              placeholder="R$ 0,00"
              value={formData.valor_proposta}
              onChange={handleCurrencyChange}
              className={cn(errors.valor_proposta && "border-destructive")}
            />
            {errors.valor_proposta && (
              <p className="text-xs text-destructive">{errors.valor_proposta}</p>
            )}
          </div>

          {/* Validade */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Validade da Proposta
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !validade && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {validade ? format(validade, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={validade}
                  onSelect={setValidade}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Observações
            </label>
            <Textarea
              placeholder="Detalhes adicionais sobre a proposta..."
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
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Proposta'}
          </Button>
        </form>
      </div>
    </>
  );
};
