import { Building2, MapPin, Bed, Ruler, Plus } from 'lucide-react';
import { imoveis } from '@/data/mockData';
import { cn } from '@/lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const ImoveisPage = () => {
  return (
    <div className="px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imóveis</h1>
          <p className="text-sm text-muted-foreground">{imoveis.length} imóveis cadastrados</p>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {['Todos', 'Apartamento', 'Casa', 'Cobertura', 'Comercial'].map((filter, index) => (
          <button
            key={filter}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              index === 0
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Imóveis List */}
      <div className="space-y-4 pb-4">
        {imoveis.map((imovel) => (
          <div
            key={imovel.id}
            className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm"
          >
            {/* Image */}
            <div className="relative h-48 bg-muted">
              <img
                src={imovel.foto}
                alt={imovel.titulo}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {imovel.novo && (
                  <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">
                    Novo
                  </span>
                )}
                {imovel.baixouPreco && (
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                    Baixou
                  </span>
                )}
              </div>
              {/* Price Tag */}
              <div className="absolute bottom-3 left-3">
                <span className="px-3 py-1.5 bg-background/90 backdrop-blur-sm text-foreground text-lg font-bold rounded-lg">
                  {formatCurrency(imovel.preco)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-1">{imovel.titulo}</h3>
              
              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>{imovel.bairro}, {imovel.cidade}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="w-4 h-4" />
                  <span>{imovel.tipo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{imovel.quartos} quartos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="w-4 h-4" />
                  <span>{imovel.area}m²</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
