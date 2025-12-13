import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CompromissoInfo {
  id: string;
  cliente: string;
  endereco: string | null;
  data: string;
  hora: string;
  tipo: string;
}

export interface Checkin {
  id: string;
  user_id: string;
  compromisso_id: string;
  latitude: number | null;
  longitude: number | null;
  endereco_confirmado: string | null;
  observacoes: string | null;
  foto_url: string | null;
  created_at: string;
  compromisso?: CompromissoInfo;
}

export const useCheckins = () => {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCheckins = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setCheckins([]);
        return;
      }

      const { data, error } = await supabase
        .from('checkins')
        .select(`
          *,
          compromisso:compromissos(id, cliente, endereco, data, hora, tipo)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map(item => ({
        ...item,
        compromisso: item.compromisso as CompromissoInfo,
      }));
      
      setCheckins(formattedData as Checkin[]);
    } catch (err: any) {
      console.error('Error fetching checkins:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckins();
  }, [user]);

  const createCheckin = async (checkin: {
    compromisso_id: string;
    latitude?: number;
    longitude?: number;
    endereco_confirmado?: string;
    observacoes?: string;
    foto_url?: string;
  }) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('checkins')
      .insert({
        ...checkin,
        user_id: user.id,
      })
      .select(`
        *,
        compromisso:compromissos(id, cliente, endereco, data, hora, tipo)
      `)
      .single();

    if (!error && data) {
      const formattedData = {
        ...data,
        compromisso: data.compromisso as CompromissoInfo,
      };
      setCheckins((prev) => [formattedData as Checkin, ...prev]);
    }

    return { data, error };
  };

  const deleteCheckin = async (id: string) => {
    const { error } = await supabase.from('checkins').delete().eq('id', id);

    if (!error) {
      setCheckins((prev) => prev.filter((checkin) => checkin.id !== id));
    }

    return { error };
  };

  return { checkins, loading, error, fetchCheckins, createCheckin, deleteCheckin };
};
