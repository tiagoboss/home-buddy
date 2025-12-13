import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LeadInfo {
  id: string;
  nome: string;
  telefone: string | null;
}

export interface ImovelInfo {
  id: string;
  titulo: string;
  bairro: string | null;
  preco: number;
}

export interface Proposta {
  id: string;
  user_id: string;
  lead_id: string;
  imovel_id: string;
  valor_proposta: number;
  status: 'pendente' | 'aceita' | 'recusada' | 'contra_proposta' | 'expirada';
  observacoes: string | null;
  validade: string | null;
  created_at: string;
  updated_at: string;
  lead?: LeadInfo;
  imovel?: ImovelInfo;
}

export const usePropostas = () => {
  const { user } = useAuth();
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPropostas = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setPropostas([]);
        return;
      }

      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          lead:leads(id, nome, telefone),
          imovel:imoveis(id, titulo, bairro, preco)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map(item => ({
        ...item,
        lead: item.lead as LeadInfo,
        imovel: item.imovel as ImovelInfo,
      }));
      
      setPropostas(formattedData as Proposta[]);
    } catch (err: any) {
      console.error('Error fetching propostas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropostas();
  }, [user]);

  const createProposta = async (proposta: {
    lead_id: string;
    imovel_id: string;
    valor_proposta: number;
    observacoes?: string;
    validade?: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('propostas')
      .insert({
        ...proposta,
        user_id: user.id,
        status: 'pendente',
      })
      .select(`
        *,
        lead:leads(id, nome, telefone),
        imovel:imoveis(id, titulo, bairro, preco)
      `)
      .single();

    if (!error && data) {
      const formattedData = {
        ...data,
        lead: data.lead as LeadInfo,
        imovel: data.imovel as ImovelInfo,
      };
      setPropostas((prev) => [formattedData as Proposta, ...prev]);
    }

    return { data, error };
  };

  const updateProposta = async (id: string, updates: Partial<Proposta>) => {
    const { error } = await supabase
      .from('propostas')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setPropostas((prev) =>
        prev.map((proposta) => (proposta.id === id ? { ...proposta, ...updates } : proposta))
      );
    }

    return { error };
  };

  const deleteProposta = async (id: string) => {
    const { error } = await supabase.from('propostas').delete().eq('id', id);

    if (!error) {
      setPropostas((prev) => prev.filter((proposta) => proposta.id !== id));
    }

    return { error };
  };

  return { propostas, loading, error, fetchPropostas, createProposta, updateProposta, deleteProposta };
};
