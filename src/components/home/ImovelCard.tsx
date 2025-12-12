import { Imovel } from '@/types';
import { formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Bed, Maximize2 } from 'lucide-react';

interface ImovelCardProps {
  imovel: Imovel;
}

export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  return (
    <div className="flex-shrink-0 w-[200px] ios-card overflow-hidden animate-scale-press snap-start">
      <div className="relative">
        <img 
          src={imovel.foto} 
          alt={imovel.titulo}
          className="w-full h-28 object-cover"
        />
        {imovel.novo && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-1 bg-success text-success-foreground rounded-full">
            Novo
          </span>
        )}
        {imovel.baixouPreco && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-1 bg-warning text-warning-foreground rounded-full">
            Baixou preço
          </span>
        )}
      </div>
      
      <div className="p-3">
        <p className="text-lg font-bold text-foreground">
          {formatCurrency(imovel.preco)}
        </p>
        <p className="text-sm text-foreground mt-0.5 truncate">
          {imovel.titulo}
        </p>
        <p className="text-xs text-muted-foreground">
          {imovel.bairro}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Bed className="w-3.5 h-3.5" />
            <span>{imovel.quartos}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{imovel.area}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
