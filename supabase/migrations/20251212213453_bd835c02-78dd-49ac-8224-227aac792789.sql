-- Remove foreign key constraint on leads.user_id to allow mock data
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_user_id_fkey;