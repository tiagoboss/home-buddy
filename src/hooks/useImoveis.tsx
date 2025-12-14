import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { imoveis as mockImoveisData } from '@/data/mockData';

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

// Convert mock data to Imovel format
const convertMockImoveis = (): Imovel[] => {
  return mockImoveisData.map(imovel => ({
    id: imovel.id,
    user_id: '',
    titulo: imovel.titulo,
    tipo: imovel.tipo,
    modalidade: imovel.modalidade as Modalidade,
    preco: imovel.preco,
    bairro: imovel.bairro,
    cidade: imovel.cidade,
    quartos: imovel.quartos,
    banheiros: imovel.banheiros || 1,
    vagas: imovel.vagas,
    area: imovel.area,
    condominio: imovel.condominio || null,
    iptu: imovel.iptu || null,
    descricao: imovel.descricao || null,
    caracteristicas: imovel.caracteristicas || null,
    entrega: imovel.entrega || null,
    construtora: imovel.construtora || null,
    foto: imovel.foto,
    fotos: null,
    novo: imovel.novo,
    baixou_preco: imovel.baixouPreco,
    favorito: imovel.favorito,
    telefone_contato: imovel.telefoneContato || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
};

export const useImoveis = () => {
  const { user } = useAuth();
  // Initialize with mock data immediately
  const [imoveis, setImoveis] = useState<Imovel[]>(convertMockImoveis());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(true);

  const fetchImoveis = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('imoveis')
        .select('*')
        .order('created_at', { ascending: false });

      // If user is logged in, filter by user_id
      if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Only use DB data if we have results, otherwise keep mock data
      if (data && data.length > 0) {
        setImoveis(data as Imovel[]);
        setIsUsingMockData(false);
      }
    } catch (err: any) {
      console.error('Error fetching imoveis:', err);
      setError(err.message);
      // Keep mock data on error
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
      setIsUsingMockData(false);
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
    // For mock data, just remove from state
    if (isUsingMockData) {
      setImoveis((prev) => prev.filter((i) => i.id !== id));
      return { error: null };
    }

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
    isUsingMockData,
    fetchImoveis,
    createImovel,
    updateImovel,
    deleteImovel,
  };
};
