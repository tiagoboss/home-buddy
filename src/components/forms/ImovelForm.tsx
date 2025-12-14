import { useState, useEffect } from 'react';
import { X, Trash2, Plus, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useImoveis, Imovel } from '@/hooks/useImoveis';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ImovelFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Imovel | null;
  onDeleted?: () => void;
}

const MAX_PHOTOS = 10;

export const ImovelForm = ({ isOpen, onClose, editData, onDeleted }: ImovelFormProps) => {
  const { createImovel, updateImovel, deleteImovel } = useImoveis();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<{
    titulo: string;
    tipo: string;
    modalidade: 'venda' | 'locacao' | 'lancamento' | 'temporada';
    preco: string;
    bairro: string;
    cidade: string;
    quartos: string;
    banheiros: string;
    vagas: string;
    area: string;
    condominio: string;
    fotos: string[];
    telefoneContato: string;
  }>({
    titulo: '',
    tipo: '',
    modalidade: 'venda',
    preco: '',
    bairro: '',
    cidade: '',
    quartos: '',
    banheiros: '',
    vagas: '',
    area: '',
    condominio: '',
    fotos: [''],
    telefoneContato: '',
  });

  const isEditMode = !!editData;

  useEffect(() => {
    if (editData) {
      // Combine foto and fotos into a single array
      const allPhotos: string[] = [];
      if (editData.foto) allPhotos.push(editData.foto);
      if (editData.fotos && editData.fotos.length > 0) {
        editData.fotos.forEach(f => {
          if (f && !allPhotos.includes(f)) allPhotos.push(f);
        });
      }
      
      setFormData({
        titulo: editData.titulo,
        tipo: editData.tipo,
        modalidade: editData.modalidade,
        preco: editData.preco.toString(),
        bairro: editData.bairro || '',
        cidade: editData.cidade || '',
        quartos: editData.quartos.toString(),
        banheiros: editData.banheiros.toString(),
        vagas: editData.vagas.toString(),
        area: editData.area.toString(),
        condominio: editData.condominio?.toString() || '',
        fotos: allPhotos.length > 0 ? allPhotos : [''],
        telefoneContato: editData.telefone_contato || '',
      });
    } else {
      setFormData({
        titulo: '',
        tipo: '',
        modalidade: 'venda',
        preco: '',
        bairro: '',
        cidade: '',
        quartos: '',
        banheiros: '',
        vagas: '',
        area: '',
        condominio: '',
        fotos: [''],
        telefoneContato: '',
      });
    }
  }, [editData, isOpen]);

  const handleAddPhoto = () => {
    if (formData.fotos.length < MAX_PHOTOS) {
      setFormData({ ...formData, fotos: [...formData.fotos, ''] });
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newFotos = formData.fotos.filter((_, i) => i !== index);
    setFormData({ ...formData, fotos: newFotos.length > 0 ? newFotos : [''] });
  };

  const handlePhotoChange = (index: number, value: string) => {
    const newFotos = [...formData.fotos];
    newFotos[index] = value;
    setFormData({ ...formData, fotos: newFotos });
  };

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
      // Filter out empty photo URLs
      const validFotos = formData.fotos.filter(f => f.trim() !== '');
      const fotoPrincipal = validFotos[0] || null;
      const fotosAdicionais = validFotos.slice(1);

      const imovelData = {
        titulo: formData.titulo.trim(),
        tipo: formData.tipo,
        modalidade: formData.modalidade,
        preco,
        bairro: formData.bairro || null,
        cidade: formData.cidade || null,
        quartos: parseInt(formData.quartos) || 0,
        banheiros: parseInt(formData.banheiros) || 0,
        vagas: parseInt(formData.vagas) || 0,
        area: parseFloat(formData.area) || 0,
        condominio: formData.condominio ? parseFloat(formData.condominio.replace(/\D/g, '')) : null,
        iptu: null,
        descricao: null,
        caracteristicas: null,
        entrega: null,
        construtora: null,
        foto: fotoPrincipal,
        fotos: fotosAdicionais.length > 0 ? fotosAdicionais : null,
        novo: !isEditMode,
        baixou_preco: false,
        favorito: editData?.favorito || false,
        telefone_contato: formData.telefoneContato || null,
      };

      if (isEditMode && editData) {
        const { error } = await updateImovel(editData.id, imovelData);
        if (error) throw error;
        toast.success('Imóvel atualizado com sucesso!');
      } else {
        const { error } = await createImovel(imovelData);
        if (error) throw error;
        toast.success('Imóvel cadastrado com sucesso!');
      }
      
      onClose();
    } catch (err: any) {
      toast.error(err.message || `Erro ao ${isEditMode ? 'atualizar' : 'cadastrar'} imóvel`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editData) return;
    
    setDeleting(true);
    try {
      const { error } = await deleteImovel(editData.id);
      if (error) throw error;
      toast.success('Imóvel excluído com sucesso!');
      onDeleted?.();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir imóvel');
    } finally {
      setDeleting(false);
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

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
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
            <h2 className="text-lg font-semibold text-foreground">
              {isEditMode ? 'Editar Imóvel' : 'Capturar Imóvel'}
            </h2>
            <div className="flex items-center gap-2">
              {isEditMode && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center"
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir imóvel?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O imóvel será permanentemente removido.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        {deleting ? 'Excluindo...' : 'Excluir'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
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
              <Label htmlFor="modalidade">Modalidade *</Label>
              <Select 
                value={formData.modalidade} 
                onValueChange={(value: 'venda' | 'locacao' | 'lancamento' | 'temporada') => setFormData({ ...formData, modalidade: value })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Selecione a modalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="locacao">Locação</SelectItem>
                  <SelectItem value="lancamento">Lançamento</SelectItem>
                  <SelectItem value="temporada">Temporada</SelectItem>
                </SelectContent>
              </Select>
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
                  <SelectItem value="Studio">Studio</SelectItem>
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

            <div className="grid grid-cols-3 gap-3">
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
                <Label htmlFor="banheiros">Banheiros</Label>
                <Input
                  id="banheiros"
                  type="number"
                  placeholder="0"
                  value={formData.banheiros}
                  onChange={(e) => setFormData({ ...formData, banheiros: e.target.value })}
                  className="h-12 rounded-xl"
                  min="0"
                  max="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vagas">Vagas</Label>
                <Input
                  id="vagas"
                  type="number"
                  placeholder="0"
                  value={formData.vagas}
                  onChange={(e) => setFormData({ ...formData, vagas: e.target.value })}
                  className="h-12 rounded-xl"
                  min="0"
                  max="20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="condominio">Condomínio</Label>
                <Input
                  id="condominio"
                  placeholder="R$ 0"
                  value={formData.condominio ? formatCurrency(formData.condominio) : ''}
                  onChange={(e) => setFormData({ ...formData, condominio: e.target.value.replace(/\D/g, '') })}
                  className="h-12 rounded-xl"
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
              <Label htmlFor="telefoneContato">Telefone de Contato</Label>
              <Input
                id="telefoneContato"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.telefoneContato}
                onChange={(e) => setFormData({ ...formData, telefoneContato: formatPhone(e.target.value) })}
                className="h-12 rounded-xl"
                maxLength={15}
              />
            </div>

            {/* Photos Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Fotos ({formData.fotos.filter(f => f.trim()).length}/{MAX_PHOTOS})
                </Label>
                {formData.fotos.length < MAX_PHOTOS && (
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground">
                A primeira foto será a capa do imóvel
              </p>

              <div className="space-y-2">
                {formData.fotos.map((foto, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="url"
                        placeholder={index === 0 ? 'URL da foto de capa' : `URL da foto ${index + 1}`}
                        value={foto}
                        onChange={(e) => handlePhotoChange(index, e.target.value)}
                        className="h-12 rounded-xl pr-10"
                        maxLength={500}
                      />
                      {foto && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded overflow-hidden bg-muted">
                          <img 
                            src={foto} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {formData.fotos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl mt-6"
              disabled={loading}
            >
              {loading ? 'Salvando...' : isEditMode ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
            </Button>
          </form>
          
          <div className="h-safe-bottom" />
        </div>
      </div>
    </>
  );
};