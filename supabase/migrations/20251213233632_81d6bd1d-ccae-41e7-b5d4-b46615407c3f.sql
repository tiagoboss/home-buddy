-- Criar tabela de check-ins
CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  compromisso_id UUID NOT NULL REFERENCES public.compromissos(id) ON DELETE CASCADE,
  latitude NUMERIC,
  longitude NUMERIC,
  endereco_confirmado TEXT,
  observacoes TEXT,
  foto_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own checkins"
  ON public.checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins"
  ON public.checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins"
  ON public.checkins FOR DELETE
  USING (auth.uid() = user_id);