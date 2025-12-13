import { Search, Grid3X3, List, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Modalidade } from '@/types';

interface ImovelFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedModalidade: Modalidade | 'todos';
  onModalidadeChange: (modalidade: Modalidade | 'todos') => void;
  selectedTipo: string;
  onTipoChange: (tipo: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  showFavorites: boolean;
  onShowFavoritesChange: (show: boolean) => void;
  counts: {
    modalidade: Record<string, number>;
    tipo: Record<string, number>;
  };
}

const modalidades: { value: Modalidade | 'todos'; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'venda', label: 'Venda' },
  { value: 'locacao', label: 'Locação' },
  { value: 'lancamento', label: 'Lançamento' },
  { value: 'temporada', label: 'Temporada' },
];

const tipos = ['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Studio', 'Comercial'];

const sortOptions = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'preco-asc', label: 'Menor preço' },
  { value: 'preco-desc', label: 'Maior preço' },
  { value: 'area-desc', label: 'Maior área' },
  { value: 'quartos-desc', label: 'Mais quartos' },
];

export const ImovelFilters = ({
  searchQuery,
  onSearchChange,
  selectedModalidade,
  onModalidadeChange,
  selectedTipo,
  onTipoChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  showFavorites,
  onShowFavoritesChange,
  counts,
}: ImovelFiltersProps) => {
  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar imóveis..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' ? 'bg-background shadow-sm' : 'text-muted-foreground'
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' ? 'bg-background shadow-sm' : 'text-muted-foreground'
            )}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modalidade Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {modalidades.map((mod) => {
          const count = mod.value === 'todos' 
            ? Object.values(counts.modalidade).reduce((a, b) => a + b, 0)
            : counts.modalidade[mod.value] || 0;
          return (
            <button
              key={mod.value}
              onClick={() => onModalidadeChange(mod.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5',
                selectedModalidade === mod.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {mod.label}
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                selectedModalidade === mod.value
                  ? 'bg-primary-foreground/20'
                  : 'bg-background'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tipo Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tipos.map((tipo) => {
          const count = tipo === 'Todos'
            ? Object.values(counts.tipo).reduce((a, b) => a + b, 0)
            : counts.tipo[tipo] || 0;
          return (
            <button
              key={tipo}
              onClick={() => onTipoChange(tipo)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                selectedTipo === tipo
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted/50 text-muted-foreground'
              )}
            >
              {tipo}
            </button>
          );
        })}
        <button
          onClick={() => onShowFavoritesChange(!showFavorites)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1',
            showFavorites
              ? 'bg-rose-500 text-white'
              : 'bg-muted/50 text-muted-foreground'
          )}
        >
          ❤️ Favoritos
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Ordenar:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-muted rounded-lg px-3 py-1.5 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
