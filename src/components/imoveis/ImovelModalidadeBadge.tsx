import { Modalidade } from '@/types';
import { cn } from '@/lib/utils';

interface ImovelModalidadeBadgeProps {
  modalidade: Modalidade;
  className?: string;
}

const modalidadeConfig: Record<Modalidade, { label: string; className: string }> = {
  venda: {
    label: 'Venda',
    className: 'bg-emerald-500 text-white',
  },
  locacao: {
    label: 'Locação',
    className: 'bg-blue-500 text-white',
  },
  lancamento: {
    label: 'Lançamento',
    className: 'bg-purple-500 text-white',
  },
  temporada: {
    label: 'Temporada',
    className: 'bg-amber-500 text-white',
  },
};

export const ImovelModalidadeBadge = ({ modalidade, className }: ImovelModalidadeBadgeProps) => {
  const config = modalidadeConfig[modalidade];

  return (
    <span
      className={cn(
        'px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wide',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
