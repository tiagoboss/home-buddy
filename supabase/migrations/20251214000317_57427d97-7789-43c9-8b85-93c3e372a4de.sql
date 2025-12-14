-- Add public SELECT policy for imoveis table
CREATE POLICY "Anyone can view properties for sharing"
ON public.imoveis
FOR SELECT
USING (true);