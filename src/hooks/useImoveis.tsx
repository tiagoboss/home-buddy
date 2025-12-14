import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type Modalidade = 'venda' | 'locacao' | 'lancamento' | 'temporada';

export interface Imovel {
  id: string;
  user_id: string;
  titulo: string;
  tipo: string;
  modalidade: Modalidade;
  preco: number;
  bairro: string | null;
  cidade: string | null;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  condominio: number | null;
  iptu: number | null;
  descricao: string | null;
  caracteristicas: string[] | null;
  entrega: string | null;
  construtora: string | null;
  foto: string | null;
  fotos: string[] | null;
  novo: boolean;
  baixou_preco: boolean;
  favorito: boolean;
  telefone_contato: string | null;
  created_at: string;
  updated_at: string;
}

export const useImoveis = () => {
  const { user } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImoveis = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImoveis(data as Imovel[]);
    } catch (err: any) {
      console.error('Error fetching imoveis:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImoveis();
  }, [user]);

  const createImovel = async (imovel: Omit<Imovel, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('imoveis')
      .insert({ ...imovel, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setImoveis((prev) => [data as Imovel, ...prev]);
    }

    return { data, error };
  };

  const updateImovel = async (id: string, updates: Partial<Imovel>) => {
    const { error } = await supabase
      .from('imoveis')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setImoveis((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
      );
    }

    return { error };
  };

  const deleteImovel = async (id: string) => {
    const { error } = await supabase.from('imoveis').delete().eq('id', id);

    if (!error) {
      setImoveis((prev) => prev.filter((i) => i.id !== id));
    }

    return { error };
  };

  return {
    imoveis,
    loading,
    error,
    fetchImoveis,
    createImovel,
    updateImovel,
    deleteImovel,
  };
};
