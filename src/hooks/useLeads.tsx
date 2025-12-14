import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { leads as mockLeadsData } from '@/data/mockData';

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

// Convert mock data to Lead format
const convertMockLeads = (): Lead[] => {
  return mockLeadsData.map(lead => ({
    id: lead.id,
    user_id: '',
    nome: lead.nome,
    telefone: lead.telefone,
    email: lead.email || null,
    status: lead.status as Lead['status'],
    interesse: lead.interesse,
    faixa_preco: null,
    bairros: null,
    ultimo_contato: lead.ultimoContato,
    avatar: lead.avatar,
    created_at: lead.ultimoContato,
    updated_at: lead.ultimoContato,
  }));
};

export const useLeads = () => {
  const { user } = useAuth();
  // Initialize with mock data immediately
  const [leads, setLeads] = useState<Lead[]>(convertMockLeads());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(true);

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
      
      // Only use DB data if we have results, otherwise keep mock data
      if (data && data.length > 0) {
        setLeads(data as Lead[]);
        setIsUsingMockData(false);
      }
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
      // Keep mock data on error
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
      setIsUsingMockData(false);
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
    // For mock data, just remove from state
    if (isUsingMockData) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      return { error: null };
    }

    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (!error) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
    }

    return { error };
  };

  return { leads, loading, error, isUsingMockData, fetchLeads, createLead, updateLead, deleteLead };
};
