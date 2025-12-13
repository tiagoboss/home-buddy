-- Add new columns to imoveis table for complete property management
ALTER TABLE public.imoveis 
ADD COLUMN IF NOT EXISTS modalidade text DEFAULT 'venda',
ADD COLUMN IF NOT EXISTS banheiros integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS vagas integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS condominio numeric,
ADD COLUMN IF NOT EXISTS iptu numeric,
ADD COLUMN IF NOT EXISTS descricao text,
ADD COLUMN IF NOT EXISTS caracteristicas text[],
ADD COLUMN IF NOT EXISTS entrega text,
ADD COLUMN IF NOT EXISTS construtora text,
ADD COLUMN IF NOT EXISTS favorito boolean DEFAULT false;

-- Add check constraint for modalidade
ALTER TABLE public.imoveis 
ADD CONSTRAINT imoveis_modalidade_check 
CHECK (modalidade IN ('venda', 'locacao', 'lancamento', 'temporada'));