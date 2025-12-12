import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Lead {
  id: string;
  user_id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  status: 'novo' | 'quente' | 'morno' | 'frio' | 'negociacao' | 'fechado' | 'perdido';
  interesse: string | null;
  faixa_preco: string | null;
  bairros: string[] | null;
  ultimo_contato: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export const useLeads = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('leads')
        .select('*')
        .order('ultimo_contato', { ascending: false });

      // If user is logged in, filter by user_id
      if (user) {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setLeads(data as Lead[]);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const createLead = async (lead: Omit<Lead, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('leads')
      .insert({ ...lead, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setLeads((prev) => [data as Lead, ...prev]);
    }

    return { data, error };
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
      );
    }

    return { error };
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (!error) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }

    return { error };
  };

  return { leads, loading, error, fetchLeads, createLead, updateLead, deleteLead };
};
