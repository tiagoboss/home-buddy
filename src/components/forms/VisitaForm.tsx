import { useState } from 'react';
import { X, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useCompromissos } from '@/hooks/useCompromissos';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VisitaFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitaForm = ({ isOpen, onClose }: VisitaFormProps) => {
  const { createCompromisso } = useCompromissos();
  const { leads } = useLeads();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    tipo: 'visita' as 'visita' | 'reuniao' | 'ligacao',
    hora: '',
    cliente: '',
    imovel: '',
    endereco: '',
    lead_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.cliente.trim() || !date || !formData.hora) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const { error } = await createCompromisso({
        tipo: formData.tipo,
        data: format(date, 'yyyy-MM-dd'),
        hora: formData.hora,
        cliente: formData.cliente.trim(),
        imovel: formData.imovel || null,
        endereco: formData.endereco || null,
        status: 'pendente',
        lead_id: formData.lead_id || null,
      });

      if (error) throw error;
      
      toast.success('Visita agendada com sucesso!');
      setFormData({ tipo: 'visita', hora: '', cliente: '', imovel: '', endereco: '', lead_id: '' });
      setDate(undefined);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao agendar visita');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      />
      
      <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up-sheet">
        <div className="bg-card rounded-t-3xl shadow-elevated max-w-lg mx-auto max-h-[85vh] overflow-y-auto">
          <div className="flex justify-center pt-3 pb-2 sticky top-0 bg-card">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
          
          <div className="flex items-center justify-between px-5 pb-4 sticky top-5 bg-card">
            <h2 className="text-lg font-semibold text-foreground">Agendar Visita</h2>
            <button 
              onClick={onClose}
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
                onValueChange={(value: any) => setFormData({ ...formData, tipo: value })}
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
                      !date && "text-muted-foreground"
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
                    onSelect={setDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hora">Hora *</Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>

            {leads.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="lead">Lead (opcional)</Label>
                <Select 
                  value={formData.lead_id} 
                  onValueChange={(value) => {
                    const lead = leads.find(l => l.id === value);
                    setFormData({ 
                      ...formData, 
                      lead_id: value,
                      cliente: lead ? lead.nome : formData.cliente
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
                onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imovel">Imóvel</Label>
              <Input
                id="imovel"
                placeholder="Descrição do imóvel"
                value={formData.imovel}
                onChange={(e) => setFormData({ ...formData, imovel: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Endereço da visita"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={300}
              />
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
