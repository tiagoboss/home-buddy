import { useState, useMemo } from 'react';
import { useImoveis, Imovel as DbImovel, Modalidade } from '@/hooks/useImoveis';
import { useFavoritos } from '@/hooks/useFavoritos';
import { imoveis as mockImoveis } from '@/data/mockData';
import { ImovelFilters } from '@/components/imoveis/ImovelFilters';
import { SwipeableImovelCard } from '@/components/imoveis/SwipeableImovelCard';
import { ImovelDetailSheet } from '@/components/imoveis/ImovelDetailSheet';
import { ImoveisEmptyState } from '@/components/imoveis/ImoveisEmptyState';
import { VisitaForm } from '@/components/forms/VisitaForm';
import { ImovelForm } from '@/components/forms/ImovelForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Imovel as ImovelType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export const ImoveisPage = () => {
  const { user } = useAuth();
  const { imoveis: dbImoveis, loading, updateImovel } = useImoveis();
  const { isFavorito, toggleFavorito } = useFavoritos();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalidade, setSelectedModalidade] = useState<Modalidade | 'todos'>('todos');
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [sortBy, setSortBy] = useState('recentes');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<ImovelType | null>(null);
  
  // Visita form state
  const [visitaFormOpen, setVisitaFormOpen] = useState(false);
  const [visitaPrefillData, setVisitaPrefillData] = useState<{ imovel?: string; endereco?: string } | undefined>();
  
  // Edit form state
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editImovelData, setEditImovelData] = useState<DbImovel | null>(null);

  const isUsingMockData = dbImoveis.length === 0;

  // Use mock data if no db data
  const allImoveis: ImovelType[] = useMemo(() => {
    if (!isUsingMockData) {
      return dbImoveis.map(i => ({
        id: i.id,
        titulo: i.titulo,
        tipo: i.tipo,
        modalidade: i.modalidade,
        preco: i.preco,
        bairro: i.bairro || '',
        cidade: i.cidade || '',
        quartos: i.quartos,
        banheiros: i.banheiros,
        vagas: i.vagas,
        area: i.area,
        condominio: i.condominio || undefined,
        iptu: i.iptu || undefined,
        descricao: i.descricao || undefined,
        caracteristicas: i.caracteristicas || undefined,
        entrega: i.entrega || undefined,
        construtora: i.construtora || undefined,
        foto: i.foto || '',
        novo: i.novo,
        baixouPreco: i.baixou_preco,
        favorito: i.favorito,
        telefoneContato: i.telefone_contato || undefined,
      }));
    }
    // Apply localStorage favorites to mock data
    return mockImoveis.map(i => ({
      ...i,
      favorito: isFavorito(i.id),
    }));
  }, [dbImoveis, isUsingMockData, isFavorito]);

  // Calculate counts
  const counts = useMemo(() => {
    const modalidade: Record<string, number> = {};
    const tipo: Record<string, number> = {};
    
    allImoveis.forEach(i => {
      modalidade[i.modalidade] = (modalidade[i.modalidade] || 0) + 1;
      tipo[i.tipo] = (tipo[i.tipo] || 0) + 1;
    });
    
    return { modalidade, tipo };
  }, [allImoveis]);

  // Filter and sort
  const filteredImoveis = useMemo(() => {
    let result = [...allImoveis];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.titulo.toLowerCase().includes(query) ||
        i.bairro.toLowerCase().includes(query) ||
        i.cidade.toLowerCase().includes(query)
      );
    }

    // Modalidade filter
    if (selectedModalidade !== 'todos') {
      result = result.filter(i => i.modalidade === selectedModalidade);
    }

    // Tipo filter
    if (selectedTipo !== 'Todos') {
      result = result.filter(i => i.tipo === selectedTipo);
    }

    // Favorites filter
    if (showFavorites) {
      result = result.filter(i => i.favorito);
    }

    // Sort
    switch (sortBy) {
      case 'preco-asc':
        result.sort((a, b) => a.preco - b.preco);
        break;
      case 'preco-desc':
        result.sort((a, b) => b.preco - a.preco);
        break;
      case 'area-desc':
        result.sort((a, b) => b.area - a.area);
        break;
      case 'quartos-desc':
        result.sort((a, b) => b.quartos - a.quartos);
        break;
    }

    return result;
  }, [allImoveis, searchQuery, selectedModalidade, selectedTipo, sortBy, showFavorites]);

  const handleFavorite = async (imovel: ImovelType) => {
    if (isUsingMockData) {
      toggleFavorito(imovel.id);
      // Update selected imovel if it's the same
      if (selectedImovel?.id === imovel.id) {
        setSelectedImovel({ ...imovel, favorito: !imovel.favorito });
      }
    } else {
      await updateImovel(imovel.id, { favorito: !imovel.favorito });
      if (selectedImovel?.id === imovel.id) {
        setSelectedImovel({ ...imovel, favorito: !imovel.favorito });
      }
    }
  };

  const handleSendToClient = (imovel: ImovelType) => {
    const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(value);
    const message = `🏠 *${imovel.titulo}*\n\n📍 ${imovel.bairro}, ${imovel.cidade}\n💰 ${formatCurrency(imovel.preco)}${imovel.modalidade === 'locacao' ? '/mês' : imovel.modalidade === 'temporada' ? '/diária' : ''}\n\n🛏️ ${imovel.quartos} quartos | 🚿 ${imovel.banheiros} banheiros | 🚗 ${imovel.vagas} vagas | 📐 ${imovel.area}m²${imovel.descricao ? `\n\n${imovel.descricao}` : ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleScheduleVisit = (imovel: ImovelType) => {
    const endereco = imovel.bairro && imovel.cidade 
      ? `${imovel.bairro}, ${imovel.cidade}` 
      : imovel.bairro || imovel.cidade || '';
    
    setVisitaPrefillData({
      imovel: imovel.titulo,
      endereco: endereco,
    });
    setVisitaFormOpen(true);
  };

  const handleEdit = (imovel: ImovelType) => {
    // Find the original DB imovel for editing
    const dbImovel = dbImoveis.find(i => i.id === imovel.id);
    if (dbImovel) {
      setEditImovelData(dbImovel);
      setEditFormOpen(true);
      setSelectedImovel(null);
    }
  };

  const handleCloseVisitaForm = () => {
    setVisitaFormOpen(false);
    setVisitaPrefillData(undefined);
  };

  const handleCloseEditForm = () => {
    setEditFormOpen(false);
    setEditImovelData(null);
  };

  if (loading) {
    return (
      <div className="px-4 pt-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-8 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="px-4 pt-4 pb-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">Imóveis</h1>
        <p className="text-sm text-muted-foreground">{allImoveis.length} imóveis cadastrados</p>
      </div>

      {/* Filters */}
      <ImovelFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedModalidade={selectedModalidade}
        onModalidadeChange={setSelectedModalidade}
        selectedTipo={selectedTipo}
        onTipoChange={setSelectedTipo}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showFavorites={showFavorites}
        onShowFavoritesChange={setShowFavorites}
        counts={counts}
      />

      {/* Results */}
      {filteredImoveis.length === 0 ? (
        <ImoveisEmptyState />
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3 mt-4' : 'space-y-4 mt-4'}>
          {filteredImoveis.map((imovel) => (
            <SwipeableImovelCard
              key={imovel.id}
              imovel={imovel}
              onClick={() => setSelectedImovel(imovel)}
              onFavorite={() => handleFavorite(imovel)}
              onSendToClient={() => handleSendToClient(imovel)}
              onScheduleVisit={() => handleScheduleVisit(imovel)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Detail Sheet */}
      {selectedImovel && (
        <ImovelDetailSheet
          imovel={selectedImovel}
          isOpen={!!selectedImovel}
          onClose={() => setSelectedImovel(null)}
          onFavorite={() => handleFavorite(selectedImovel)}
          onScheduleVisit={() => {
            setSelectedImovel(null);
            handleScheduleVisit(selectedImovel);
          }}
          onEdit={user && !isUsingMockData ? () => handleEdit(selectedImovel) : undefined}
        />
      )}

      {/* Visita Form */}
      <VisitaForm
        isOpen={visitaFormOpen}
        onClose={handleCloseVisitaForm}
        prefillData={visitaPrefillData}
      />

      {/* Edit Form */}
      <ImovelForm
        isOpen={editFormOpen}
        onClose={handleCloseEditForm}
        editData={editImovelData}
        onDeleted={() => setSelectedImovel(null)}
      />
    </div>
  );
};
