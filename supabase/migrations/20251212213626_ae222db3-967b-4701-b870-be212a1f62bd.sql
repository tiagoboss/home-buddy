-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;

-- Create permissive policy for viewing leads (for demo purposes)
CREATE POLICY "Anyone can view leads" 
ON public.leads 
FOR SELECT 
USING (true);