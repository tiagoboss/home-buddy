import { Building2 } from 'lucide-react';

export const ImoveisEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <Building2 className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum imóvel encontrado</h3>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Não há imóveis que correspondam aos filtros selecionados. Tente ajustar os filtros ou adicione novos imóveis.
      </p>
    </div>
  );
};
