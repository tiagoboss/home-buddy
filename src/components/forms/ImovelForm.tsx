import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImoveis } from '@/hooks/useImoveis';
import { toast } from 'sonner';

interface ImovelFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImovelForm = ({ isOpen, onClose }: ImovelFormProps) => {
  const { createImovel } = useImoveis();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    tipo: '',
    preco: '',
    bairro: '',
    cidade: '',
    quartos: '',
    area: '',
    foto: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.tipo || !formData.preco) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    const preco = parseFloat(formData.preco.replace(/\D/g, ''));
    if (isNaN(preco) || preco <= 0) {
      toast.error('Informe um preço válido');
      return;
    }

    setLoading(true);
    try {
      const { error } = await createImovel({
        titulo: formData.titulo.trim(),
        tipo: formData.tipo,
        preco,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        quartos: parseInt(formData.quartos) || 0,
        area: parseFloat(formData.area) || 0,
        foto: formData.foto || null,
        novo: true,
        baixou_preco: false,
      });

      if (error) throw error;
      
      toast.success('Imóvel cadastrado com sucesso!');
      setFormData({ titulo: '', tipo: '', preco: '', bairro: '', cidade: '', quartos: '', area: '', foto: '' });
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar imóvel');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(parseInt(number) || 0);
    return formatted;
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
            <h2 className="text-lg font-semibold text-foreground">Capturar Imóvel</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="px-5 pb-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ex: Apartamento 3 quartos"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={200}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select 
                value={formData.tipo} 
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Casa">Casa</SelectItem>
                  <SelectItem value="Cobertura">Cobertura</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Comercial">Comercial</SelectItem>
                  <SelectItem value="Sala">Sala</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preco">Preço *</Label>
              <Input
                id="preco"
                placeholder="R$ 0"
                value={formData.preco ? formatCurrency(formData.preco) : ''}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value.replace(/\D/g, '') })}
                className="h-12 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quartos">Quartos</Label>
                <Input
                  id="quartos"
                  type="number"
                  placeholder="0"
                  value={formData.quartos}
                  onChange={(e) => setFormData({ ...formData, quartos: e.target.value })}
                  className="h-12 rounded-xl"
                  min="0"
                  max="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  placeholder="0"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="h-12 rounded-xl"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                placeholder="Nome do bairro"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Nome da cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto">URL da Foto</Label>
              <Input
                id="foto"
                type="url"
                placeholder="https://..."
                value={formData.foto}
                onChange={(e) => setFormData({ ...formData, foto: e.target.value })}
                className="h-12 rounded-xl"
                maxLength={500}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl mt-6"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Cadastrar Imóvel'}
            </Button>
          </form>
          
          <div className="h-safe-bottom" />
        </div>
      </div>
    </>
  );
};
