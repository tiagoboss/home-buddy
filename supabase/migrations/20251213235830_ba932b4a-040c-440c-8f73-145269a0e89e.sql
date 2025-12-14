-- Add fotos array column to imoveis table
ALTER TABLE public.imoveis 
ADD COLUMN fotos text[] DEFAULT NULL;