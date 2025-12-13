import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/useLeads';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const ligacaoSchema = z.object({
  lead_id: z.string().min(1, 'Selecione um lead'),
  descricao: z.string().trim().min(1, 'Descrição é obrigatória').max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
});

type LigacaoFormData = z.infer<typeof ligacaoSchema>;

interface LigacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LigacaoForm = ({ isOpen, onClose }: LigacaoFormProps) => {
  const { user } = useAuth();
  const { leads, updateLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LigacaoFormData, string>>>({});
  const [formData, setFormData] = useState({
    lead_id: '',
    descricao: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = ligacaoSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LigacaoFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof LigacaoFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('interacoes')
        .insert({
          user_id: user.id,
          lead_id: result.data.lead_id,
          tipo: 'ligacao',
          descricao: result.data.descricao,
        });

      if (error) throw error;

      // Update lead's ultimo_contato
      await updateLead(result.data.lead_id, {
        ultimo_contato: new Date().toISOString(),
      });
      
      toast.success('Ligação registrada com sucesso!');
      setFormData({ lead_id: '', descricao: '' });
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao registrar ligação');
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
            <h2 className="text-lg font-semibold text-foreground">Registrar Ligação</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead">Lead *</Label>
              <Select 
                value={formData.lead_id} 
                onValueChange={(value) => {
                  setFormData({ ...formData, lead_id: value });
                  if (errors.lead_id) setErrors({ ...errors, lead_id: undefined });
                }}
              >
                <SelectTrigger className={`h-12 rounded-xl ${errors.lead_id ? 'border-destructive' : ''}`}>
                  <SelectValue placeholder="Selecione o lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.length === 0 ? (
                    <SelectItem value="none" disabled>Nenhum lead cadastrado</SelectItem>
                  ) : (
                    leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        {lead.nome} {lead.telefone ? `- ${lead.telefone}` : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.lead_id && <p className="text-xs text-destructive">{errors.lead_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o que foi conversado..."
                value={formData.descricao}
                onChange={(e) => {
                  setFormData({ ...formData, descricao: e.target.value });
                  if (errors.descricao) setErrors({ ...errors, descricao: undefined });
                }}
                className={`min-h-[120px] rounded-xl resize-none ${errors.descricao ? 'border-destructive' : ''}`}
                maxLength={1000}
              />
              {errors.descricao && <p className="text-xs text-destructive">{errors.descricao}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl mt-6"
              disabled={loading || leads.length === 0}
            >
              {loading ? 'Salvando...' : 'Registrar Ligação'}
            </Button>
          </form>
          
          <div className="h-safe-bottom" />
        </div>
      </div>
    </>
  );
};
