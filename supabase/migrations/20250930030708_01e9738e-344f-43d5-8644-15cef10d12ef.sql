-- Adicionar campos PERT e restrições à tabela tasks
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS optimistic_duration integer,
ADD COLUMN IF NOT EXISTS most_likely_duration integer,
ADD COLUMN IF NOT EXISTS pessimistic_duration integer,
ADD COLUMN IF NOT EXISTS use_pert boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS early_start date,
ADD COLUMN IF NOT EXISTS early_finish date,
ADD COLUMN IF NOT EXISTS late_start date,
ADD COLUMN IF NOT EXISTS late_finish date,
ADD COLUMN IF NOT EXISTS slack integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS constraint_type text,
ADD COLUMN IF NOT EXISTS constraint_date date,
ADD COLUMN IF NOT EXISTS resource_id uuid,
ADD COLUMN IF NOT EXISTS buffer_id uuid,
ADD COLUMN IF NOT EXISTS baseline_duration integer,
ADD COLUMN IF NOT EXISTS baseline_start_date date,
ADD COLUMN IF NOT EXISTS baseline_end_date date;

-- Criar tabela de recursos
CREATE TABLE IF NOT EXISTS public.resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  name text NOT NULL,
  daily_capacity numeric DEFAULT 8.0,
  calendar_id uuid,
  skills text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de calendários
CREATE TABLE IF NOT EXISTS public.calendars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  name text NOT NULL,
  holidays date[],
  working_days integer[] DEFAULT ARRAY[1,2,3,4,5],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de buffers
CREATE TABLE IF NOT EXISTS public.buffers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  duration integer NOT NULL,
  consumed integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de baselines
CREATE TABLE IF NOT EXISTS public.baselines (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  name text NOT NULL,
  snapshot_date timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT false,
  data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de decisões
CREATE TABLE IF NOT EXISTS public.decisions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL,
  meeting_id uuid,
  task_id uuid,
  description text NOT NULL,
  impact_type text,
  impact_value jsonb,
  created_at timestamp with time zone DEFAULT now(),
  created_by uuid
);

-- Atualizar tabela de dependências para incluir tipo e lag
ALTER TABLE public.task_dependencies
ADD COLUMN IF NOT EXISTS dependency_type text DEFAULT 'FS',
ADD COLUMN IF NOT EXISTS lag_days integer DEFAULT 0;

-- Habilitar RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buffers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decisions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Allow public access to resources" ON public.resources FOR ALL USING (true);
CREATE POLICY "Allow public access to calendars" ON public.calendars FOR ALL USING (true);
CREATE POLICY "Allow public access to buffers" ON public.buffers FOR ALL USING (true);
CREATE POLICY "Allow public access to baselines" ON public.baselines FOR ALL USING (true);
CREATE POLICY "Allow public access to decisions" ON public.decisions FOR ALL USING (true);

-- Trigger para updated_at
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendars_updated_at
BEFORE UPDATE ON public.calendars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_buffers_updated_at
BEFORE UPDATE ON public.buffers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();