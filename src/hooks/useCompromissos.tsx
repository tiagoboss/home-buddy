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

// Mock data for demo/preview mode
const getMockCompromissos = (): Compromisso[] => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  return [
    {
      id: 'mock-1',
      user_id: 'demo',
      tipo: 'visita',
      data: today,
      hora: '09:00',
      cliente: 'João Silva',
      imovel: 'Apartamento 3 quartos - Jardins',
      endereco: 'Rua Oscar Freire, 1234 - Jardins, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-1',
      lead: { id: 'mock-lead-1', nome: 'João Silva', telefone: '11999991234', email: 'joao@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      user_id: 'demo',
      tipo: 'ligacao',
      data: today,
      hora: '11:30',
      cliente: 'Maria Santos',
      imovel: null,
      endereco: null,
      status: 'pendente',
      lead_id: 'mock-lead-2',
      lead: { id: 'mock-lead-2', nome: 'Maria Santos', telefone: '11988885678', email: 'maria@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      user_id: 'demo',
      tipo: 'reuniao',
      data: today,
      hora: '14:00',
      cliente: 'Carlos Oliveira',
      imovel: 'Cobertura Duplex - Moema',
      endereco: 'Av. Ibirapuera, 2500 - Moema, SP',
      status: 'pendente',
      lead_id: 'mock-lead-3',
      lead: { id: 'mock-lead-3', nome: 'Carlos Oliveira', telefone: '11977779012', email: 'carlos@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      user_id: 'demo',
      tipo: 'visita',
      data: tomorrow,
      hora: '10:00',
      cliente: 'Ana Paula Costa',
      imovel: 'Casa 4 suítes - Alphaville',
      endereco: 'Alameda Rio Negro, 500 - Alphaville, SP',
      status: 'pendente',
      lead_id: 'mock-lead-4',
      lead: { id: 'mock-lead-4', nome: 'Ana Paula Costa', telefone: '11966663456', email: 'ana@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-5',
      user_id: 'demo',
      tipo: 'visita',
      data: tomorrow,
      hora: '15:30',
      cliente: 'Roberto Mendes',
      imovel: 'Studio - Vila Madalena',
      endereco: 'Rua Harmonia, 123 - Vila Madalena, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-5',
      lead: { id: 'mock-lead-5', nome: 'Roberto Mendes', telefone: '11955557890', email: 'roberto@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

export const useCompromissos = () => {
  const { user } = useAuth();
  const [compromissos, setCompromissos] = useState<Compromisso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompromissos = async () => {
    // Use mock data when not authenticated
    if (!user) {
      setCompromissos(getMockCompromissos());
      setLoading(false);
      return;
    }

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
