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

// Mock data for demo/preview mode - uses current date for presentation
const getMockCompromissos = (): Compromisso[] => {
  const getDateString = (daysFromToday: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date.toISOString().split('T')[0];
  };

  // Dias passados (para preencher a semana toda)
  const dayMinus3 = getDateString(-3);
  const dayMinus2 = getDateString(-2);
  const dayMinus1 = getDateString(-1);
  const today = getDateString(0);
  const tomorrow = getDateString(1);
  const day2 = getDateString(2);
  const day3 = getDateString(3);
  const day4 = getDateString(4);
  const day5 = getDateString(5);
  const day6 = getDateString(6);
  
  return [
    // 3 dias atrás - 2 compromissos (realizados)
    {
      id: 'mock-past-1',
      user_id: 'demo',
      tipo: 'visita',
      data: dayMinus3,
      hora: '10:00',
      cliente: 'Lucas Ferreira',
      imovel: 'Apartamento 2 quartos - Pinheiros',
      endereco: 'Rua dos Pinheiros, 500 - Pinheiros, SP',
      status: 'realizado',
      lead_id: 'mock-lead-past-1',
      lead: { id: 'mock-lead-past-1', nome: 'Lucas Ferreira', telefone: '11944441111', email: 'lucas@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-past-2',
      user_id: 'demo',
      tipo: 'ligacao',
      data: dayMinus3,
      hora: '15:00',
      cliente: 'Juliana Martins',
      imovel: null,
      endereco: null,
      status: 'realizado',
      lead_id: 'mock-lead-past-2',
      lead: { id: 'mock-lead-past-2', nome: 'Juliana Martins', telefone: '11933332222', email: 'juliana@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // 2 dias atrás - 3 compromissos
    {
      id: 'mock-past-3',
      user_id: 'demo',
      tipo: 'visita',
      data: dayMinus2,
      hora: '09:30',
      cliente: 'Pedro Almeida',
      imovel: 'Casa térrea - Brooklin',
      endereco: 'Rua Flórida, 200 - Brooklin, SP',
      status: 'realizado',
      lead_id: 'mock-lead-past-3',
      lead: { id: 'mock-lead-past-3', nome: 'Pedro Almeida', telefone: '11922223333', email: 'pedro@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-past-4',
      user_id: 'demo',
      tipo: 'reuniao',
      data: dayMinus2,
      hora: '14:00',
      cliente: 'Camila Rocha',
      imovel: 'Loft - Itaim',
      endereco: 'Rua Joaquim Floriano, 800 - Itaim, SP',
      status: 'cancelado',
      lead_id: 'mock-lead-past-4',
      lead: { id: 'mock-lead-past-4', nome: 'Camila Rocha', telefone: '11911114444', email: 'camila@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-past-5',
      user_id: 'demo',
      tipo: 'ligacao',
      data: dayMinus2,
      hora: '17:00',
      cliente: 'Rafael Silva',
      imovel: null,
      endereco: null,
      status: 'realizado',
      lead_id: 'mock-lead-past-5',
      lead: { id: 'mock-lead-past-5', nome: 'Rafael Silva', telefone: '11900005555', email: 'rafael@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Ontem - 2 compromissos
    {
      id: 'mock-past-6',
      user_id: 'demo',
      tipo: 'visita',
      data: dayMinus1,
      hora: '11:00',
      cliente: 'Beatriz Nunes',
      imovel: 'Apartamento Garden - Vila Olímpia',
      endereco: 'Rua Funchal, 400 - Vila Olímpia, SP',
      status: 'realizado',
      lead_id: 'mock-lead-past-6',
      lead: { id: 'mock-lead-past-6', nome: 'Beatriz Nunes', telefone: '11988886666', email: 'beatriz@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-past-7',
      user_id: 'demo',
      tipo: 'reuniao',
      data: dayMinus1,
      hora: '16:00',
      cliente: 'Thiago Costa',
      imovel: 'Penthouse - Perdizes',
      endereco: 'Rua Cardoso de Almeida, 1500 - Perdizes, SP',
      status: 'realizado',
      lead_id: 'mock-lead-past-7',
      lead: { id: 'mock-lead-past-7', nome: 'Thiago Costa', telefone: '11977777777', email: 'thiago@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Hoje - 4 compromissos
    {
      id: 'mock-1',
      user_id: 'demo',
      tipo: 'visita',
      data: today,
      hora: '09:00',
      cliente: 'Maria Santos',
      imovel: 'Apartamento 3 quartos - Jardins',
      endereco: 'Rua Oscar Freire, 1234 - Jardins, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-1',
      lead: { id: 'mock-lead-1', nome: 'Maria Santos', telefone: '11999991234', email: 'maria@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-2',
      user_id: 'demo',
      tipo: 'ligacao',
      data: today,
      hora: '11:30',
      cliente: 'Carlos Oliveira',
      imovel: null,
      endereco: null,
      status: 'pendente',
      lead_id: 'mock-lead-2',
      lead: { id: 'mock-lead-2', nome: 'Carlos Oliveira', telefone: '11988885678', email: 'carlos@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-3',
      user_id: 'demo',
      tipo: 'visita',
      data: today,
      hora: '14:00',
      cliente: 'Ana Paula Costa',
      imovel: 'Cobertura Duplex - Moema',
      endereco: 'Av. Ibirapuera, 2500 - Moema, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-3',
      lead: { id: 'mock-lead-3', nome: 'Ana Paula Costa', telefone: '11977779012', email: 'ana@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-4',
      user_id: 'demo',
      tipo: 'reuniao',
      data: today,
      hora: '16:30',
      cliente: 'Roberto Mendes',
      imovel: 'Casa 4 suítes - Alphaville',
      endereco: 'Alameda Rio Negro, 500 - Alphaville, SP',
      status: 'pendente',
      lead_id: 'mock-lead-4',
      lead: { id: 'mock-lead-4', nome: 'Roberto Mendes', telefone: '11966663456', email: 'roberto@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Amanhã - 3 compromissos
    {
      id: 'mock-5',
      user_id: 'demo',
      tipo: 'visita',
      data: tomorrow,
      hora: '10:00',
      cliente: 'Fernanda Lima',
      imovel: 'Studio - Vila Madalena',
      endereco: 'Rua Harmonia, 123 - Vila Madalena, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-5',
      lead: { id: 'mock-lead-5', nome: 'Fernanda Lima', telefone: '11955557890', email: 'fernanda@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-6',
      user_id: 'demo',
      tipo: 'reuniao',
      data: tomorrow,
      hora: '14:30',
      cliente: 'Pedro Almeida',
      imovel: 'Loft - Pinheiros',
      endereco: 'Rua dos Pinheiros, 800 - Pinheiros, SP',
      status: 'pendente',
      lead_id: 'mock-lead-6',
      lead: { id: 'mock-lead-6', nome: 'Pedro Almeida', telefone: '11944441234', email: 'pedro@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-7',
      user_id: 'demo',
      tipo: 'ligacao',
      data: tomorrow,
      hora: '17:00',
      cliente: 'Juliana Ferreira',
      imovel: null,
      endereco: null,
      status: 'pendente',
      lead_id: 'mock-lead-7',
      lead: { id: 'mock-lead-7', nome: 'Juliana Ferreira', telefone: '11933335678', email: 'juliana@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Dia +2 - 2 compromissos
    {
      id: 'mock-8',
      user_id: 'demo',
      tipo: 'visita',
      data: day2,
      hora: '09:30',
      cliente: 'Marcos Souza',
      imovel: 'Casa Térrea - Brooklin',
      endereco: 'Av. Eng. Luís Carlos Berrini, 1500 - Brooklin, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-8',
      lead: { id: 'mock-lead-8', nome: 'Marcos Souza', telefone: '11922229012', email: 'marcos@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-9',
      user_id: 'demo',
      tipo: 'visita',
      data: day2,
      hora: '15:00',
      cliente: 'Camila Rodrigues',
      imovel: 'Apartamento 2 quartos - Itaim',
      endereco: 'Rua Joaquim Floriano, 200 - Itaim Bibi, SP',
      status: 'pendente',
      lead_id: 'mock-lead-9',
      lead: { id: 'mock-lead-9', nome: 'Camila Rodrigues', telefone: '11911113456', email: 'camila@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Dia +3 - 3 compromissos
    {
      id: 'mock-10',
      user_id: 'demo',
      tipo: 'reuniao',
      data: day3,
      hora: '10:00',
      cliente: 'Ricardo Barbosa',
      imovel: 'Cobertura - Vila Nova Conceição',
      endereco: 'Rua Afonso Brás, 500 - Vila Nova Conceição, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-10',
      lead: { id: 'mock-lead-10', nome: 'Ricardo Barbosa', telefone: '11900007890', email: 'ricardo@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-11',
      user_id: 'demo',
      tipo: 'visita',
      data: day3,
      hora: '14:00',
      cliente: 'Patrícia Gomes',
      imovel: 'Apartamento Garden - Morumbi',
      endereco: 'Av. Morumbi, 3000 - Morumbi, SP',
      status: 'pendente',
      lead_id: 'mock-lead-11',
      lead: { id: 'mock-lead-11', nome: 'Patrícia Gomes', telefone: '11898761234', email: 'patricia@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-12',
      user_id: 'demo',
      tipo: 'ligacao',
      data: day3,
      hora: '16:30',
      cliente: 'Bruno Martins',
      imovel: null,
      endereco: null,
      status: 'pendente',
      lead_id: 'mock-lead-12',
      lead: { id: 'mock-lead-12', nome: 'Bruno Martins', telefone: '11887655678', email: 'bruno@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Dia +4 - 2 compromissos
    {
      id: 'mock-13',
      user_id: 'demo',
      tipo: 'visita',
      data: day4,
      hora: '11:00',
      cliente: 'Luciana Pereira',
      imovel: 'Casa em Condomínio - Granja Viana',
      endereco: 'Estrada da Granja, 100 - Granja Viana, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-13',
      lead: { id: 'mock-lead-13', nome: 'Luciana Pereira', telefone: '11876549012', email: 'luciana@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-14',
      user_id: 'demo',
      tipo: 'reuniao',
      data: day4,
      hora: '15:30',
      cliente: 'Felipe Nascimento',
      imovel: 'Apartamento Alto Padrão - Perdizes',
      endereco: 'Rua Cardoso de Almeida, 1200 - Perdizes, SP',
      status: 'pendente',
      lead_id: 'mock-lead-14',
      lead: { id: 'mock-lead-14', nome: 'Felipe Nascimento', telefone: '11865433456', email: 'felipe@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Dia +5 - 2 compromissos
    {
      id: 'mock-15',
      user_id: 'demo',
      tipo: 'visita',
      data: day5,
      hora: '10:30',
      cliente: 'Amanda Castro',
      imovel: 'Flat - Paulista',
      endereco: 'Av. Paulista, 2000 - Bela Vista, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-15',
      lead: { id: 'mock-lead-15', nome: 'Amanda Castro', telefone: '11854327890', email: 'amanda@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-16',
      user_id: 'demo',
      tipo: 'ligacao',
      data: day5,
      hora: '14:00',
      cliente: 'Thiago Ribeiro',
      imovel: null,
      endereco: null,
      status: 'pendente',
      lead_id: 'mock-lead-16',
      lead: { id: 'mock-lead-16', nome: 'Thiago Ribeiro', telefone: '11843211234', email: 'thiago@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Dia +6 - 2 compromissos
    {
      id: 'mock-17',
      user_id: 'demo',
      tipo: 'visita',
      data: day6,
      hora: '09:00',
      cliente: 'Gabriela Nunes',
      imovel: 'Duplex - Santana',
      endereco: 'Rua Voluntários da Pátria, 3500 - Santana, SP',
      status: 'confirmado',
      lead_id: 'mock-lead-17',
      lead: { id: 'mock-lead-17', nome: 'Gabriela Nunes', telefone: '11832105678', email: 'gabriela@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mock-18',
      user_id: 'demo',
      tipo: 'reuniao',
      data: day6,
      hora: '16:00',
      cliente: 'Daniel Cardoso',
      imovel: 'Apartamento Compacto - Mooca',
      endereco: 'Rua da Mooca, 800 - Mooca, SP',
      status: 'pendente',
      lead_id: 'mock-lead-18',
      lead: { id: 'mock-lead-18', nome: 'Daniel Cardoso', telefone: '11820999012', email: 'daniel@email.com' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

export const useCompromissos = () => {
  const { user } = useAuth();
  const [compromissos, setCompromissos] = useState<Compromisso[]>(getMockCompromissos());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(true);

  const fetchCompromissos = async () => {
    // Always show mock data first, then try to fetch real data
    if (!user) {
      setCompromissos(getMockCompromissos());
      setUseMockData(true);
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
      
      // Fallback to mock data if database is empty
      if (!data || data.length === 0) {
        setCompromissos(getMockCompromissos());
        setUseMockData(true);
      } else {
        setCompromissos(data as Compromisso[]);
        setUseMockData(false);
      }
    } catch (err: any) {
      console.error('Error fetching compromissos:', err);
      setError(err.message);
      // Use mock data on error as well
      setCompromissos(getMockCompromissos());
      setUseMockData(true);
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
    // If using mock data, create locally
    if (useMockData || !user) {
      const newCompromisso: Compromisso = {
        ...compromisso,
        id: `mock-${Date.now()}`,
        user_id: 'demo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setCompromissos((prev) => [...prev, newCompromisso].sort((a, b) => {
        const dateA = new Date(`${a.data}T${a.hora}`);
        const dateB = new Date(`${b.data}T${b.hora}`);
        return dateA.getTime() - dateB.getTime();
      }));
      
      return { data: newCompromisso, error: null };
    }

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
    // If using mock data, update locally only
    if (useMockData) {
      setCompromissos((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c))
          .sort((a, b) => {
            const dateA = new Date(`${a.data}T${a.hora}`);
            const dateB = new Date(`${b.data}T${b.hora}`);
            return dateA.getTime() - dateB.getTime();
          })
      );
      return { error: null };
    }

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
    // If using mock data, delete locally only
    if (useMockData) {
      setCompromissos((prev) => prev.filter((c) => c.id !== id));
      return { error: null };
    }

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
    useMockData,
    fetchCompromissos,
    createCompromisso,
    updateCompromisso,
    deleteCompromisso,
  };
};
