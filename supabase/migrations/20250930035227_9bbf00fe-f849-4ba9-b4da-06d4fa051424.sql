-- Tabela para armazenar contexto e narrativa do projeto (editável)
CREATE TABLE public.project_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  story TEXT,
  origin TEXT,
  impact TEXT,
  objectives TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_by UUID,
  UNIQUE(project_id)
);

-- Tabela para riscos do projeto
CREATE TABLE public.project_risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  probability INTEGER CHECK (probability >= 1 AND probability <= 5),
  impact INTEGER CHECK (impact >= 1 AND impact <= 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'mitigated', 'occurred', 'closed')),
  mitigation_plan TEXT,
  owner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para problemas/issues do projeto
CREATE TABLE public.project_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  assigned_to UUID,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Tabela para KPIs do projeto
CREATE TABLE public.project_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC,
  unit TEXT,
  category TEXT CHECK (category IN ('schedule', 'cost', 'quality', 'satisfaction', 'custom')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_kpis ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public access to project_context" ON public.project_context FOR ALL USING (true);
CREATE POLICY "Allow public access to project_risks" ON public.project_risks FOR ALL USING (true);
CREATE POLICY "Allow public access to project_issues" ON public.project_issues FOR ALL USING (true);
CREATE POLICY "Allow public access to project_kpis" ON public.project_kpis FOR ALL USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_project_context_updated_at
  BEFORE UPDATE ON public.project_context
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_risks_updated_at
  BEFORE UPDATE ON public.project_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_issues_updated_at
  BEFORE UPDATE ON public.project_issues
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_kpis_updated_at
  BEFORE UPDATE ON public.project_kpis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();