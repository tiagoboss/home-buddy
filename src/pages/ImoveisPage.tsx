import { useState, useMemo } from 'react';
import { useImoveis, Imovel, Modalidade } from '@/hooks/useImoveis';
import { imoveis as mockImoveis } from '@/data/mockData';
import { ImovelFilters } from '@/components/imoveis/ImovelFilters';
import { SwipeableImovelCard } from '@/components/imoveis/SwipeableImovelCard';
import { ImovelDetailSheet } from '@/components/imoveis/ImovelDetailSheet';
import { ImoveisEmptyState } from '@/components/imoveis/ImoveisEmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Imovel as ImovelType } from '@/types';

export const ImoveisPage = () => {
  const { imoveis: dbImoveis, loading, updateImovel } = useImoveis();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalidade, setSelectedModalidade] = useState<Modalidade | 'todos'>('todos');
  const [selectedTipo, setSelectedTipo] = useState('Todos');
  const [sortBy, setSortBy] = useState('recentes');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState<ImovelType | null>(null);

  // Use mock data if no db data
  const allImoveis: ImovelType[] = useMemo(() => {
    if (dbImoveis.length > 0) {
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
      }));
    }
    return mockImoveis;
  }, [dbImoveis]);

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
    if (dbImoveis.length > 0) {
      await updateImovel(imovel.id, { favorito: !imovel.favorito });
    }
  };

  const handleWhatsApp = (imovel: ImovelType) => {
    const message = `Olá! Tenho interesse no imóvel: ${imovel.titulo}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleScheduleVisit = (imovel: ImovelType) => {
    // TODO: Open visit form with pre-filled data
    console.log('Schedule visit for:', imovel.titulo);
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
              onWhatsApp={() => handleWhatsApp(imovel)}
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
        />
      )}
    </div>
  );
};
