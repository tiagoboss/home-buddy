import { Imovel } from '@/types';
import { formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Bed, Maximize2 } from 'lucide-react';

interface ImovelCardProps {
  imovel: Imovel;
}

export const ImovelCard = ({ imovel }: ImovelCardProps) => {
  return (
    <div className="flex-shrink-0 w-[160px] ios-card overflow-hidden animate-scale-press snap-start">
      <div className="relative">
        <img 
          src={imovel.foto} 
          alt={imovel.titulo}
          className="w-full h-20 object-cover"
        />
        {imovel.novo && (
          <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 bg-success text-success-foreground rounded-full">
            Novo
          </span>
        )}
        {imovel.baixouPreco && (
          <span className="absolute top-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 bg-warning text-warning-foreground rounded-full">
            Baixou
          </span>
        )}
      </div>
      
      <div className="p-2.5">
        <p className="text-base font-bold text-foreground leading-tight">
          {formatCurrency(imovel.preco)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
          {imovel.bairro}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <Bed className="w-3 h-3" />
            <span>{imovel.quartos}</span>
          </div>
          <div className="flex items-center gap-0.5 text-[9px] text-muted-foreground">
            <Maximize2 className="w-3 h-3" />
            <span>{imovel.area}m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
