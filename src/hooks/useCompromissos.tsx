import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface LeadInfo {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
}

export interface Compromisso {
  id: string;
  user_id: string;
  tipo: 'visita' | 'reuniao' | 'ligacao';
  data: string;
  hora: string;
  cliente: string;
  imovel: string | null;
  endereco: string | null;
  status: 'pendente' | 'confirmado' | 'cancelado' | 'realizado';
  lead_id: string | null;
  lead: LeadInfo | null;
  created_at: string;
  updated_at: string;
}

export const useCompromissos = () => {
  const { user } = useAuth();
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompromissos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('compromissos')
        .select(`
          *,
          lead:leads(id, nome, telefone, email)
        `)
        .eq('user_id', user.id)
        .order('data', { ascending: true })
        .order('hora', { ascending: true });

      if (error) throw error;
      setCompromissos(data as Compromisso[]);
    } catch (err: any) {
      console.error('Error fetching compromissos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompromissos();
  }, [user]);

  const createCompromisso = async (
    compromisso: Omit<Compromisso, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('compromissos')
      .insert({ ...compromisso, user_id: user.id })
      .select()
      .single();

    if (!error && data) {
      setCompromissos((prev) => [...prev, data as Compromisso].sort((a, b) => {
        const dateA = new Date(`${a.data}T${a.hora}`);
        const dateB = new Date(`${b.data}T${b.hora}`);
        return dateA.getTime() - dateB.getTime();
      }));
    }

    return { data, error };
  };

  const updateCompromisso = async (id: string, updates: Partial<Compromisso>) => {
    const { error } = await supabase
      .from('compromissos')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setCompromissos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    }

    return { error };
  };

  const deleteCompromisso = async (id: string) => {
    const { error } = await supabase.from('compromissos').delete().eq('id', id);

    if (!error) {
      setCompromissos((prev) => prev.filter((c) => c.id !== id));
    }

    return { error };
  };

  return {
    compromissos,
    loading,
    error,
    fetchCompromissos,
    createCompromisso,
    updateCompromisso,
    deleteCompromisso,
  };
};
