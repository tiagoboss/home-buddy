import { useState, useRef } from 'react';
import { X, MapPin, Bed, Bath, Car, Ruler, Building2, Heart, MessageCircle, Calendar, Navigation, Share2, Pencil, Send } from 'lucide-react';
import { Imovel } from '@/types';
import { ImovelModalidadeBadge } from './ImovelModalidadeBadge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImovelDetailSheetProps {
  imovel: Imovel;
  isOpen: boolean;
  onClose: () => void;
  onFavorite: () => void;
  onScheduleVisit?: () => void;
  onEdit?: () => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const ImovelDetailSheet = ({ imovel, isOpen, onClose, onFavorite, onScheduleVisit, onEdit }: ImovelDetailSheetProps) => {
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const DRAG_THRESHOLD = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (translateY > DRAG_THRESHOLD) {
      onClose();
    }
    setTranslateY(0);
  };

  const getPhoneNumber = () => {
    const phone = imovel.telefoneContato;
    if (!phone) return null;
    return phone.replace(/\D/g, '');
  };

  const handleSendToClient = () => {
    // Opens WhatsApp to send property info to a client (no pre-filled number)
    const message = `🏠 *${imovel.titulo}*\n\n📍 ${imovel.bairro}, ${imovel.cidade}\n💰 ${formatCurrency(imovel.preco)}${imovel.modalidade === 'locacao' ? '/mês' : imovel.modalidade === 'temporada' ? '/diária' : ''}\n\n🛏️ ${imovel.quartos} quartos | 🚿 ${imovel.banheiros} banheiros | 🚗 ${imovel.vagas} vagas | 📐 ${imovel.area}m²${imovel.descricao ? `\n\n${imovel.descricao}` : ''}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleNavigate = () => {
    const address = `${imovel.bairro}, ${imovel.cidade}`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const handleShare = async () => {
    const shareText = `Confira este imóvel: ${imovel.titulo} - ${formatCurrency(imovel.preco)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: imovel.titulo,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error - fallback to clipboard
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(shareText);
        }
      }
    } else {
      await copyToClipboard(shareText);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copiado para a área de transferência!');
    } catch {
      toast.error('Não foi possível compartilhar');
    }
  };

  const getPriceDisplay = () => {
    switch (imovel.modalidade) {
      case 'locacao':
        return (
          <div>
            <span className="text-2xl font-bold">{formatCurrency(imovel.preco)}</span>
            <span className="text-muted-foreground">/mês</span>
            {imovel.condominio && (
              <p className="text-sm text-muted-foreground mt-1">
                Condomínio: {formatCurrency(imovel.condominio)}
              </p>
            )}
            {imovel.iptu && (
              <p className="text-sm text-muted-foreground">
                IPTU: {formatCurrency(imovel.iptu)}/ano
              </p>
            )}
          </div>
        );
      case 'lancamento':
        return (
          <div>
            <span className="text-sm text-muted-foreground">A partir de</span>
            <p className="text-2xl font-bold">{formatCurrency(imovel.preco)}</p>
            {imovel.entrega && (
              <p className="text-sm text-muted-foreground mt-1">Entrega: {imovel.entrega}</p>
            )}
          </div>
        );
      case 'temporada':
        return (
          <div>
            <span className="text-2xl font-bold">{formatCurrency(imovel.preco)}</span>
            <span className="text-muted-foreground">/diária</span>
          </div>
        );
      default:
        return <span className="text-2xl font-bold">{formatCurrency(imovel.preco)}</span>;
    }
  };

  if (!isOpen) return null;

  const hasPhone = !!getPhoneNumber();

  return (
    <div className="absolute inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ opacity: Math.max(0, 1 - translateY / 300) }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[90%] overflow-hidden flex flex-col"
        style={{
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-6">
          {/* Image */}
          <div className="relative h-56 bg-muted">
            <img
              src={imovel.foto || '/placeholder.svg'}
              alt={imovel.titulo}
              className="w-full h-full object-cover"
            />
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute top-4 right-4 flex gap-2">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="p-2 bg-background/80 backdrop-blur-sm rounded-full"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-2 bg-background/80 backdrop-blur-sm rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={onFavorite}
                className="p-2 bg-background/80 backdrop-blur-sm rounded-full"
              >
                <Heart
                  className={cn(
                    'w-5 h-5',
                    imovel.favorito ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 flex gap-2">
              <ImovelModalidadeBadge modalidade={imovel.modalidade} />
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
          </div>

          <div className="px-4 pt-4 space-y-4">
            {/* Title & Price */}
            <div>
              <h2 className="text-xl font-bold text-foreground">{imovel.titulo}</h2>
              {imovel.construtora && (
                <p className="text-sm text-muted-foreground">🏗️ {imovel.construtora}</p>
              )}
              <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {imovel.bairro}, {imovel.cidade}
                </span>
              </div>
              <div className="mt-3">{getPriceDisplay()}</div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center p-3 bg-muted rounded-xl">
                <Bed className="w-5 h-5 text-primary mb-1" />
                <span className="text-sm font-semibold">{imovel.quartos}</span>
                <span className="text-xs text-muted-foreground">Quartos</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted rounded-xl">
                <Bath className="w-5 h-5 text-primary mb-1" />
                <span className="text-sm font-semibold">{imovel.banheiros || 0}</span>
                <span className="text-xs text-muted-foreground">Banheiros</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted rounded-xl">
                <Car className="w-5 h-5 text-primary mb-1" />
                <span className="text-sm font-semibold">{imovel.vagas || 0}</span>
                <span className="text-xs text-muted-foreground">Vagas</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-muted rounded-xl">
                <Ruler className="w-5 h-5 text-primary mb-1" />
                <span className="text-sm font-semibold">{imovel.area}</span>
                <span className="text-xs text-muted-foreground">m²</span>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-xl">
              <Building2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{imovel.tipo}</span>
            </div>

            {/* Description */}
            {imovel.descricao && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Descrição</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{imovel.descricao}</p>
              </div>
            )}

            {/* Caracteristicas */}
            {imovel.caracteristicas && imovel.caracteristicas.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {imovel.caracteristicas.map((carac, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-muted rounded-full text-sm text-muted-foreground"
                    >
                      {carac}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Map Link */}
            <button
              onClick={handleNavigate}
              className="w-full flex items-center justify-center gap-2 p-4 bg-muted rounded-xl text-sm font-medium"
            >
              <Navigation className="w-5 h-5 text-primary" />
              Ver no mapa
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-4 border-t border-border bg-background">
          <div className="flex gap-3">
            <button
              onClick={handleSendToClient}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl font-medium"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
            <button
              onClick={onScheduleVisit}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium"
            >
              <Calendar className="w-5 h-5" />
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
