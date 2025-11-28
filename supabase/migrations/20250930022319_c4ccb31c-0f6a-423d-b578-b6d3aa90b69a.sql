-- Criar tabela de projetos
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'on-track',
  team_size INTEGER DEFAULT 0,
  budget TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de tarefas
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  wbs TEXT NOT NULL,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_critical BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'not-started',
  parent_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de dependências
CREATE TABLE public.task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  predecessor_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  successor_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(predecessor_id, successor_id)
);

-- Índices para melhor performance
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_parent_id ON public.tasks(parent_id);
CREATE INDEX idx_task_dependencies_predecessor ON public.task_dependencies(predecessor_id);
CREATE INDEX idx_task_dependencies_successor ON public.task_dependencies(successor_id);

-- Habilitar RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_dependencies ENABLE ROW LEVEL SECURITY;

-- RLS policies (por enquanto, todos podem ver e editar - ajustar depois com auth)
CREATE POLICY "Allow public read access to projects" 
ON public.projects FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to projects" 
ON public.projects FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to projects" 
ON public.projects FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to projects" 
ON public.projects FOR DELETE 
USING (true);

CREATE POLICY "Allow public read access to tasks" 
ON public.tasks FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to tasks" 
ON public.tasks FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access to tasks" 
ON public.tasks FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access to tasks" 
ON public.tasks FOR DELETE 
USING (true);

CREATE POLICY "Allow public read access to task_dependencies" 
ON public.task_dependencies FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access to task_dependencies" 
ON public.task_dependencies FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public delete access to task_dependencies" 
ON public.task_dependencies FOR DELETE 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();