import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';
import { z } from 'zod';

const leadSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  telefone: z.string().optional().refine(
    (val) => !val || val.replace(/\D/g, '').length >= 10,
    'Telefone deve ter pelo menos 10 dígitos'
  ),
  email: z.string().optional().refine(
    (val) => !val || z.string().email().safeParse(val).success,
    'Email inválido'
  ),
  interesse: z.string().max(200, 'Interesse deve ter no máximo 200 caracteres').optional(),
  faixa_preco: z.string().optional(),
  status: z.enum(['novo', 'quente', 'morno', 'frio', 'negociacao', 'fechado', 'perdido']),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const LeadForm = ({ isOpen, onClose }: LeadFormProps) => {
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    interesse: '',
    faixa_preco: '',
    status: 'novo' as const,
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, telefone: formatted });
    if (errors.telefone) setErrors({ ...errors, telefone: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LeadFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LeadFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await createLead({
        nome: result.data.nome,
        telefone: result.data.telefone || null,
        email: result.data.email || null,
        interesse: result.data.interesse || null,
        faixa_preco: result.data.faixa_preco || null,
        status: result.data.status,
        bairros: null,
        ultimo_contato: new Date().toISOString(),
        avatar: null,
      });

      if (error) throw error;
      
      toast.success('Lead registrado com sucesso!');
      setFormData({ nome: '', telefone: '', email: '', interesse: '', faixa_preco: '', status: 'novo' });
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar lead');
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
            <h2 className="text-lg font-semibold text-foreground">Registrar Lead</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Nome do lead"
                value={formData.nome}
                onChange={(e) => {
                  setFormData({ ...formData, nome: e.target.value });
                  if (errors.nome) setErrors({ ...errors, nome: undefined });
                }}
                className={`h-12 rounded-xl ${errors.nome ? 'border-destructive' : ''}`}
                maxLength={100}
              />
              {errors.nome && <p className="text-xs text-destructive">{errors.nome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={handlePhoneChange}
                className={`h-12 rounded-xl ${errors.telefone ? 'border-destructive' : ''}`}
                maxLength={16}
              />
              {errors.telefone && <p className="text-xs text-destructive">{errors.telefone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                className={`h-12 rounded-xl ${errors.email ? 'border-destructive' : ''}`}
                maxLength={255}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interesse">Interesse</Label>
              <Input
                id="interesse"
                placeholder="Ex: Apartamento 3 quartos"
                value={formData.interesse}
                onChange={(e) => setFormData({ ...formData, interesse: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="faixa_preco">Faixa de Preço</Label>
              <Select 
                value={formData.faixa_preco} 
                onValueChange={(value) => setFormData({ ...formData, faixa_preco: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ate-300k">Até R$ 300 mil</SelectItem>
                  <SelectItem value="300k-500k">R$ 300 mil - R$ 500 mil</SelectItem>
                  <SelectItem value="500k-800k">R$ 500 mil - R$ 800 mil</SelectItem>
                  <SelectItem value="800k-1m">R$ 800 mil - R$ 1 milhão</SelectItem>
                  <SelectItem value="acima-1m">Acima de R$ 1 milhão</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="quente">Quente</SelectItem>
                  <SelectItem value="morno">Morno</SelectItem>
                  <SelectItem value="frio">Frio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl mt-6"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Registrar Lead'}
            </Button>
          </form>
          
          <div className="h-safe-bottom" />
        </div>
      </div>
    </>
  );
};
