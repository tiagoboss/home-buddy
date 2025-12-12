import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/useLeads';
import { toast } from 'sonner';

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadForm = ({ isOpen, onClose }: LeadFormProps) => {
  const { createLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    interesse: '',
    faixa_preco: '',
    status: 'novo' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setLoading(true);
    try {
      const { error } = await createLead({
        nome: formData.nome.trim(),
        telefone: formData.telefone || null,
        email: formData.email || null,
        interesse: formData.interesse || null,
        faixa_preco: formData.faixa_preco || null,
        status: formData.status,
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
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={20}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={255}
              />
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
