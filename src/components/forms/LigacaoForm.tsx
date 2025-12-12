import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeads } from '@/hooks/useLeads';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LigacaoFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LigacaoForm = ({ isOpen, onClose }: LigacaoFormProps) => {
  const { user } = useAuth();
  const { leads, updateLead } = useLeads();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lead_id: '',
    descricao: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lead_id || !formData.descricao.trim()) {
      toast.error('Selecione um lead e descreva a ligação');
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
          lead_id: formData.lead_id,
          tipo: 'ligacao',
          descricao: formData.descricao.trim(),
        });

      if (error) throw error;

      // Update lead's ultimo_contato
      await updateLead(formData.lead_id, {
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
                onValueChange={(value) => setFormData({ ...formData, lead_id: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o que foi conversado..."
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="min-h-[120px] rounded-xl resize-none"
                maxLength={1000}
              />
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
