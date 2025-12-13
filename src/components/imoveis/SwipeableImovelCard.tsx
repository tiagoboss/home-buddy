import { useState, useRef } from 'react';
import { Building2, MapPin, Bed, Ruler, Bath, Car, Heart, Calendar, Send } from 'lucide-react';
import { Imovel } from '@/types';
import { ImovelModalidadeBadge } from './ImovelModalidadeBadge';
import { cn } from '@/lib/utils';

interface SwipeableImovelCardProps {
  imovel: Imovel;
  onClick: () => void;
  onFavorite: () => void;
  onSendToClient: () => void;
  onScheduleVisit: () => void;
  viewMode: 'list' | 'grid';
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const SwipeableImovelCard = ({
  imovel,
  onClick,
  onFavorite,
  onSendToClient,
  onScheduleVisit,
  viewMode,
}: SwipeableImovelCardProps) => {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - startX.current;
    setTranslateX(Math.max(-120, Math.min(120, diff)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateX < -60) {
      onSendToClient();
    } else if (translateX > 60) {
      onScheduleVisit();
    }
    setTranslateX(0);
  };

  const getPriceDisplay = () => {
    switch (imovel.modalidade) {
      case 'locacao':
        return (
          <div>
            <span className="text-lg font-bold">{formatCurrency(imovel.preco)}</span>
            <span className="text-xs text-muted-foreground">/mês</span>
            {imovel.condominio && (
              <p className="text-xs text-muted-foreground">+ Cond: {formatCurrency(imovel.condominio)}</p>
            )}
          </div>
        );
      case 'lancamento':
        return (
          <div>
            <span className="text-xs text-muted-foreground">A partir de</span>
            <p className="text-lg font-bold">{formatCurrency(imovel.preco)}</p>
            {imovel.entrega && <p className="text-xs text-muted-foreground">Entrega: {imovel.entrega}</p>}
          </div>
        );
      case 'temporada':
        return (
          <div>
            <span className="text-lg font-bold">{formatCurrency(imovel.preco)}</span>
            <span className="text-xs text-muted-foreground">/diária</span>
          </div>
        );
      default:
        return <span className="text-lg font-bold">{formatCurrency(imovel.preco)}</span>;
    }
  };

  if (viewMode === 'grid') {
    return (
      <div
        className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-sm cursor-pointer"
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative aspect-square bg-muted">
          <img
            src={imovel.foto || '/placeholder.svg'}
            alt={imovel.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <ImovelModalidadeBadge modalidade={imovel.modalidade} className="text-[10px] px-1.5 py-0.5" />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full"
          >
            <Heart
              className={cn('w-4 h-4', imovel.favorito ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground')}
            />
          </button>
        </div>
        <div className="p-2">
          <p className="font-bold text-sm truncate">{formatCurrency(imovel.preco)}</p>
          <p className="text-xs text-muted-foreground truncate">{imovel.bairro}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{imovel.quartos}q</span>
            <span>{imovel.area}m²</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-emerald-500 flex items-center justify-start pl-4">
          <div className="flex flex-col items-center text-white">
            <Calendar className="w-6 h-6" />
            <span className="text-xs mt-1">Agendar</span>
          </div>
        </div>
        <div className="flex-1 bg-green-500 flex items-center justify-end pr-4">
          <div className="flex flex-col items-center text-white">
            <Send className="w-6 h-6" />
            <span className="text-xs mt-1">Enviar</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div
        className="relative bg-card border border-border/50 shadow-sm transition-transform"
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 bg-muted">
          <img
            src={imovel.foto || '/placeholder.svg'}
            alt={imovel.titulo}
            className="w-full h-full object-cover"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <ImovelModalidadeBadge modalidade={imovel.modalidade} />
            {imovel.novo && (
              <span className="px-2 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">Novo</span>
            )}
            {imovel.baixouPreco && (
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">Baixou</span>
            )}
          </div>
          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite();
            }}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full"
          >
            <Heart
              className={cn('w-5 h-5', imovel.favorito ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground')}
            />
          </button>
          {/* Price Tag */}
          <div className="absolute bottom-3 left-3">
            <div className="px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-lg">{getPriceDisplay()}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{imovel.titulo}</h3>

          {imovel.construtora && (
            <p className="text-xs text-muted-foreground mb-1">🏗️ {imovel.construtora}</p>
          )}

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>
              {imovel.bairro}, {imovel.cidade}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              <span>{imovel.tipo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{imovel.quartos}</span>
            </div>
            {imovel.banheiros > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{imovel.banheiros}</span>
              </div>
            )}
            {imovel.vagas > 0 && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                <span>{imovel.vagas}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Ruler className="w-4 h-4" />
              <span>{imovel.area}m²</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
